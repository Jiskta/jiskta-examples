# Jiskta Air Quality Map Explorer

An interactive web app: click anywhere on a map of Europe (or the world) and instantly see historical air quality charts for that location — NO₂, PM2.5, temperature, and wind speed from the Copernicus CAMS + ERA5 datasets.

## What it shows

- **NO₂ & PM2.5** monthly trends (CAMS, 0.1° resolution)
- **Temperature** monthly trend (ERA5, 0.25° resolution)
- **Wind speed** monthly trend (ERA5 u10+v10 → √(u²+v²), 0.25° resolution)
- **WHO guideline cards** — annual mean vs the 2021 WHO limits, colour-coded (green / amber / red)
- Credit cost displayed per query

## Quick start

```bash
cd nodejs-map-explorer
npm install
cp .env.example .env          # add your Jiskta API key
JISKTA_API_KEY=sk_live_... node server.js
# → open http://localhost:3000
```

Then click anywhere on the map. The sidebar fetches the last 6 years of monthly data and renders charts instantly.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `JISKTA_API_KEY` | *(required)* | Your Jiskta API key |
| `PORT` | `3000` | HTTP port |

## Credits consumed per click

Each click fires three parallel queries:
- CAMS: `no2 + pm2p5 + t2m`, monthly aggregate → **1 tile × N months × 3 variables**
- ERA5 wind: `u10 + v10`, monthly aggregate → **1 tile × N months × 2 variables**
- Exceedance: `no2` hours above threshold → **1 tile × N months × 1 variable**

For the default 6-year range (72 months), a single click costs **≈ 432 credits**
(3×72 + 2×72 + 1×72 = 432 — well within the Starter package's 6,500).

## Stack

- **Node.js** + **Express** for routing
- **[Jiskta Node SDK](https://github.com/jiskta/jiskta-node)** — zero runtime dependencies
- **[Leaflet](https://leafletjs.com/)** — OpenStreetMap tiles
- **[Chart.js](https://www.chartjs.org/)** — time-series line charts

## Extending it

**Add more variables** — edit `server.js` to include `pm10`, `o3`, or ERA5 vars (`blh`, `tp`). Add corresponding datasets in `public/index.html`.

**Add exceedance analysis** — the `/api/exceedance` endpoint is already wired up; call it with `threshold: 10` (WHO NO₂) to show "hours above limit per year".

**Deploy to Cloudflare Workers / Railway / Fly.io** — set `JISKTA_API_KEY` as a secret env var; the app is stateless and starts in < 50 ms.
