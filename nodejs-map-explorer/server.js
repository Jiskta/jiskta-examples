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
app.use(express.json());

// Build location params for the SDK: named area or lat/lon point.
const locParams = (q) =>
  q.area ? { area: q.area } : { lat: parseFloat(q.lat), lon: parseFloat(q.lon) };

function handleError(err, res) {
  if (err instanceof JisktaError) {
    res.status(err.statusCode ?? 500).json({ error: err.message });
  } else {
    res.status(500).json({ error: String(err) });
  }
}

// ──────────────────────────────────────────────
// GET /api/query
// Params: (lat=&lon= OR area=) + start=&end=
// Returns: { airQuality, temperature, wind, snappedLat, snappedLon, areaPolygon? }
// ──────────────────────────────────────────────
app.get("/api/query", async (req, res) => {
  const { lat, lon, area, start, end } = req.query;

  if (!start || !end || (!area && (!lat || !lon))) {
    return res.status(400).json({ error: "Provide (lat + lon) or area, plus start and end." });
  }

  const loc = locParams(req.query);
  const t0  = Date.now();

  try {
    const tApi = Date.now();

    // Fetch air quality+temperature and wind speed in parallel.
    // Wind (ERA5) uses allSettled so a missing ERA5 year doesn't fail the whole request.
    const [aqResult, windResult] = await Promise.allSettled([
      client.query({ ...loc, start, end, variables: ["no2", "pm2p5", "t2m"], aggregate: "monthly" }),
      client.query({ ...loc, start, end, variables: ["wind_speed"],           aggregate: "monthly" }),
    ]);

    if (aqResult.status === "rejected") throw aqResult.reason;
    const { rows, meta } = aqResult.value;
    const windRows = windResult.status === "fulfilled" ? windResult.value.rows : [];
    if (windResult.status === "rejected") console.warn(`[query] wind data unavailable: ${windResult.reason?.message}`);

    const tApiMs = Date.now() - tApi;
    console.log(`[query] Jiskta API: ${tApiMs}ms, rows=${rows.length}, credits_remaining=${meta.credits_remaining}`);

    const aqRows   = rows.map(({ lat, lon, year_month, no2_mean, pm2p5_mean }) => ({ lat, lon, year_month, no2_mean, pm2p5_mean }));
    const tempRows = rows.map(({ lat, lon, year_month, t2m_mean })             => ({ lat, lon, year_month, t2m_mean }));

    const tSerialize = Date.now();
    const body = {
      airQuality:        aqRows,
      temperature:       tempRows,
      wind:              windRows,
      snappedLat:        rows[0]?.lat ?? parseFloat(lat),
      snappedLon:        rows[0]?.lon ?? parseFloat(lon),
      credits_used:      meta.credits_used,
      credits_remaining: meta.credits_remaining,
    };
    const tSerializeMs = Date.now() - tSerialize;
    const tTotalMs     = Date.now() - t0;

    // For named-area queries, fetch the GeoJSON polygon for map rendering.
    if (area) {
      try {
        const url = `https://api.jiskta.com/api/v1/climate/query?` +
          `area=${encodeURIComponent(area)}&time_start=${start}&time_end=${end}` +
          `&variables=no2&format=stats&include_polygon=true`;
        const polyResp = await fetch(url, { headers: { "X-API-Key": apiKey } });
        if (polyResp.ok) {
          const polyData = await polyResp.json();
          body.areaPolygon = polyData.polygon ?? null;
          if (polyData.bbox) {
            const [minLon, minLat, maxLon, maxLat] = polyData.bbox;
            body.snappedLat = (minLat + maxLat) / 2;
            body.snappedLon = (minLon + maxLon) / 2;
          }
        }
      } catch (_) { /* polygon fetch is best-effort */ }
    }

    res.setHeader("Server-Timing",
      `api;desc="Jiskta API";dur=${tApiMs},` +
      `serialize;desc="JSON serialize";dur=${tSerializeMs},` +
      `total;desc="Server total";dur=${tTotalMs}`
    );
    res.json(body);
    console.log(`[query] total: ${tTotalMs}ms (api=${tApiMs}ms serialize=${tSerializeMs}ms)`);
  } catch (err) { handleError(err, res); }
});

// ──────────────────────────────────────────────
// GET /api/exceedance
// Returns daily NO₂ for the calendar heatmap.
// ──────────────────────────────────────────────
app.get("/api/exceedance", async (req, res) => {
  const { lat, lon, area, start, end } = req.query;

  if (!start || !end || (!area && (!lat || !lon))) {
    return res.status(400).json({ error: "Provide (lat + lon) or area, plus start and end." });
  }

  try {
    const { rows } = await client.query({
      ...locParams(req.query), start, end,
      variables: ["no2"], aggregate: "daily",
    });
    res.json({ rows });
  } catch (err) { handleError(err, res); }
});

// ──────────────────────────────────────────────
// GET /api/seasonal
// Returns seasonal NO₂ + PM2.5 (DJF, MAM, JJA, SON).
// ──────────────────────────────────────────────
app.get("/api/seasonal", async (req, res) => {
  const { lat, lon, area, start, end } = req.query;

  if (!start || !end || (!area && (!lat || !lon))) {
    return res.status(400).json({ error: "Provide (lat + lon) or area, plus start and end." });
  }

  try {
    const { rows } = await client.query({
      ...locParams(req.query), start, end,
      variables: ["no2", "pm2p5"], aggregate: "seasonal",
    });
    res.json({ rows });
  } catch (err) { handleError(err, res); }
});

// ──────────────────────────────────────────────
// POST /api/mask
// Body: { lat_min, lat_max, lon_min, lon_max, start, end, mask, variables?, aggregate? }
// Returns: { rows, credits_used }
// ──────────────────────────────────────────────
app.post("/api/mask", async (req, res) => {
  const { lat_min, lat_max, lon_min, lon_max, start, end, mask, variables, aggregate } = req.body;

  if (!lat_min || !lat_max || !lon_min || !lon_max || !start || !end || !mask) {
    return res.status(400).json({
      error: "lat_min, lat_max, lon_min, lon_max, start, end, mask are required.",
    });
  }

  try {
    const result = await client.queryWithMask({
      lat_min: parseFloat(lat_min),
      lat_max: parseFloat(lat_max),
      lon_min: parseFloat(lon_min),
      lon_max: parseFloat(lon_max),
      start, end,
      variables:  variables  ?? ["no2", "pm2p5"],
      aggregate:  aggregate  ?? "monthly",
      mask,
    });
    const rows = result.rows ?? result;
    res.json({ rows, credits_used: result.meta?.credits_used ?? 0 });
  } catch (err) { handleError(err, res); }
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
