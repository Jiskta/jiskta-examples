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
// Proxy to Jiskta API; returns { airQuality, temperature, credits_remaining }
// ──────────────────────────────────────────────
app.get("/api/query", async (req, res) => {
  const { lat, lon, start, end } = req.query;

  if (!lat || !lon || !start || !end) {
    return res.status(400).json({ error: "lat, lon, start, end are required" });
  }

  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);

  try {
    // Fetch CAMS air quality (NO₂ + PM2.5) and ERA5 temperature in parallel
    const [aqRows, tempRows] = await Promise.all([
      client.query({
        lat: latNum,
        lon: lonNum,
        start,
        end,
        variables: ["no2", "pm2p5"],
        aggregate: "monthly",
      }),
      client.query({
        lat: latNum,
        lon: lonNum,
        start,
        end,
        variables: ["t2m"],
        aggregate: "monthly",
      }),
    ]);

    res.json({
      airQuality: aqRows,
      temperature: tempRows,
      // expose snapped coordinates from first row
      snappedLat: aqRows[0]?.lat ?? latNum,
      snappedLon: aqRows[0]?.lon ?? lonNum,
    });
  } catch (err) {
    if (err instanceof JisktaError) {
      res.status(err.statusCode ?? 500).json({ error: err.message });
    } else {
      res.status(500).json({ error: String(err) });
    }
  }
});

// ──────────────────────────────────────────────
// GET /api/credits
// ──────────────────────────────────────────────
app.get("/api/credits", async (_req, res) => {
  try {
    const data = await client.stats({
      lat: [48.8, 48.9],
      lon: [2.3, 2.4],
      start: "2023-01",
      end: "2023-01",
      variables: ["no2"],
    });
    res.json({ credits_remaining: data.credits_remaining });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`\n🗺️  Jiskta Map Explorer running at http://localhost:${PORT}\n`);
  console.log("  Click anywhere on the map to explore air quality history.");
  console.log("  Ctrl+C to stop.\n");
});
