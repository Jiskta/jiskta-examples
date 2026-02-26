# Jiskta Air Quality Map Explorer

An interactive web app: click anywhere on a map of Europe (or the world) and instantly see historical air quality charts for that location — NO₂, PM2.5, and temperature from the Copernicus CAMS + ERA5 datasets.

![screenshot](https://jiskta.com/assets/map-explorer-preview.png)

## What it shows

- **NO₂ & PM2.5** monthly trends (CAMS, 0.1° resolution)
- **Temperature** monthly trend (ERA5, 0.25° resolution)
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

Each click fetches two parallel queries:
- CAMS: `no2 + pm2p5`, monthly aggregate → **1 tile × N months × 2 variables**
- ERA5: `t2m`, monthly aggregate → **1 tile × N months × 1 variable**

For the default 6-year range (72 months), a single click costs **≈ 18 credits** (well within the Starter package's 6,500).

## Stack

- **Node.js** (built-in `https`, no framework overhead) + Express for routing
- **[Jiskta Node SDK](https://github.com/fvsever/jiskta-node)** — zero runtime dependencies
- **[Leaflet](https://leafletjs.com/)** — OpenStreetMap tiles
- **[Chart.js](https://www.chartjs.org/)** — time-series line charts

## Extending it

**Add more variables** — edit `server.js` line 35 to include `pm10`, `o3`, or ERA5 vars (`blh`, `u10`, `v10`). Add corresponding datasets in `public/index.html`.

**Add exceedance analysis** — after the main fetch, call a second endpoint with `aggregate: "exceedance"` and `threshold: 10` (WHO NO₂) to show "hours above limit per year".

**Deploy to Cloudflare Workers / Railway / Fly.io** — set `JISKTA_API_KEY` as a secret env var; the app is stateless and starts in < 50 ms.
