// Jiskta Map Explorer — Node.js backend
// Usage: JISKTA_API_KEY=sk_live_... node server.js

import express from "express";
import { JisktaClient, JisktaError } from "jiskta";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const apiKey = process.env.JISKTA_API_KEY;
if (!apiKey) {
  console.error("Error: JISKTA_API_KEY environment variable not set.");
  console.error("  export JISKTA_API_KEY=sk_live_...");
  process.exit(1);
}

const client = new JisktaClient(apiKey);

app.use(express.static(join(__dirname, "public")));

// ──────────────────────────────────────────────
// GET /api/query
// One call returns rows + credits_remaining together.
// ──────────────────────────────────────────────
app.get("/api/query", async (req, res) => {
  const { lat, lon, start, end } = req.query;

  if (!lat || !lon || !start || !end) {
    return res.status(400).json({ error: "lat, lon, start, end are required" });
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  const t0 = Date.now();

  try {
    const tApi = Date.now();

    const { rows, meta } = await client.query({
      lat: latNum,
      lon: lonNum,
      start,
      end,
      variables: ["no2", "pm2p5", "t2m"],
      aggregate: "monthly",
    });

    const tApiMs = Date.now() - tApi;
    console.log(`[query] Jiskta API: ${tApiMs}ms, rows=${rows.length}, credits_remaining=${meta.credits_remaining}`);

    const aqRows = rows.map(({ lat, lon, year_month, no2_mean, pm2p5_mean }) => ({
      lat, lon, year_month, no2_mean, pm2p5_mean,
    }));
    const tempRows = rows.map(({ lat, lon, year_month, t2m_mean }) => ({
      lat, lon, year_month, t2m_mean,
    }));

    const tSerialize = Date.now();
    const body = {
      airQuality:        aqRows,
      temperature:       tempRows,
      snappedLat:        rows[0]?.lat ?? latNum,
      snappedLon:        rows[0]?.lon ?? lonNum,
      credits_used:      meta.credits_used,
      credits_remaining: meta.credits_remaining,
    };
    const tSerializeMs = Date.now() - tSerialize;
    const tTotalMs = Date.now() - t0;

    // Server-Timing header — visible in browser DevTools Network tab → Timing
    // Shows exact server breakdown vs browser TTFB to isolate discrepancies
    res.setHeader("Server-Timing",
      `api;desc="Jiskta API";dur=${tApiMs},` +
      `serialize;desc="JSON serialize";dur=${tSerializeMs},` +
      `total;desc="Server total";dur=${tTotalMs}`
    );
    res.json(body);
    console.log(`[query] total: ${tTotalMs}ms (api=${tApiMs}ms serialize=${tSerializeMs}ms)`);
  } catch (err) {
    if (err instanceof JisktaError) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    } else {
      res.status(500).json({ error: String(err) });
    }
  }
});

app.listen(PORT, () => {
  console.log(`\n🗺️  Jiskta Map Explorer running at http://localhost:${PORT}\n`);
  console.log("  Click anywhere on the map to explore air quality history.");
  console.log("  Ctrl+C to stop.\n");

  // Warm up the connection to api.jiskta.com so the first user click
  // doesn't pay the DNS + TLS handshake cost (~500ms).
  client.query({ lat: 48.85, lon: 2.35, start: "2024-01", end: "2024-01",
                 variables: ["no2"], aggregate: "monthly" })
    .then(() => console.log("  Connection to api.jiskta.com warmed up.\n"))
    .catch(() => {}); // ignore errors (bad key, no network, etc.)
});
