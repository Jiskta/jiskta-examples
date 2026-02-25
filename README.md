# Jiskta API — Example Notebooks

Practical examples using the [Jiskta Climate Data API](https://jiskta.com) and the official Python SDK.

## Notebooks

| # | Notebook | What it covers |
|---|----------|----------------|
| 1 | [Quick Start](notebooks/01_quick_start.ipynb) | Install the SDK, make your first query, plot daily NO₂ over Paris |
| 2 | [City Air Quality Report](notebooks/02_air_quality_report.ipynb) | Full-year multi-pollutant analysis with seasonal trends |
| 3 | [WHO Exceedance Analysis](notebooks/03_who_exceedance.ipynb) | Flag days that exceed WHO air quality guidelines; heatmap calendar |
| 4 | [Multi-City Comparison](notebooks/04_multi_city_comparison.ipynb) | Compare NO₂ levels across Paris, London, Amsterdam and Berlin |

## Setup

```bash
pip install -r requirements.txt
jupyter lab
```

Replace `sk_live_YOUR_API_KEY` in each notebook with your key from [jiskta.com/dashboard](https://jiskta.com/dashboard).

## SDKs

| Language | Package | Status |
|----------|---------|--------|
| Python | [`jiskta`](https://github.com/fvsever/jiskta-python) | ✅ Available |
| Node.js | `jiskta` (npm) | 🔜 Coming soon |
| R | `jiskta` (CRAN) | 🔜 Coming soon |

## Credits

Each query costs `geographic_tiles × months × pollutants` credits.  
Buy credits at [jiskta.com/pricing](https://jiskta.com/pricing).
