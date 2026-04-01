# Jiskta API — Example Notebooks

Practical examples using the [Jiskta Climate Data API](https://jiskta.com) and the official Python SDK.

## Notebooks

| # | Notebook | What it covers |
|---|----------|----------------|
| 1 | [Quick Start](notebooks/01_quick_start.ipynb) | Install the SDK, make your first query, plot daily NO₂ over Paris |
| 2 | [City Air Quality Report](notebooks/02_air_quality_report.ipynb) | Full-year multi-pollutant analysis with seasonal trends |
| 3 | [WHO Exceedance Analysis](notebooks/03_who_exceedance.ipynb) | Flag days that exceed WHO 2021 air quality guidelines; heatmap calendar |
| 4 | [Multi-City Comparison](notebooks/04_multi_city_comparison.ipynb) | Compare NO₂ levels across Paris, London, Amsterdam and Berlin |
| 5 | [EEA Monthly Validation](notebooks/05_eea_monthly_validation.ipynb) | Cross-validate CAMS reanalysis against EEA station measurements |
| 6 | [Proptech Air Score](notebooks/06_proptech_air_score.ipynb) | Rank properties by air quality for real-estate listings |
| 7 | [Urban Planning Analysis](notebooks/07_urban_planning.ipynb) | Spatial NO₂ trend analysis for city planning use cases |
| 8 | [ESG Reporting](notebooks/08_esg_reporting.ipynb) | ESRS E2 air quality section for CSRD statutory reports |
| 9 | [ESG Satellite Validation](notebooks/09_esg_satellite_validation.ipynb) | Cross-validate CAMS air quality against stock performance and E-PRTR emissions |

## Setup

### 1 — Get an API key

Sign up at [jiskta.com](https://jiskta.com) and copy your key from the [dashboard](https://jiskta.com/dashboard).

### 2 — Clone this repo

```bash
git clone https://github.com/jiskta/jiskta-examples.git
cd jiskta-examples
```

### 3 — Install dependencies

```bash
pip install -r requirements.txt
```

Or manually:

```bash
pip install "jiskta[pandas]>=0.5.0" matplotlib seaborn numpy jupyterlab
```

### 4 — Set your API key

Set your key as an environment variable (recommended — keeps it out of notebooks):

```bash
export JISKTA_API_KEY=sk_live_YOUR_API_KEY
```

Or replace `sk_live_YOUR_API_KEY` directly in each notebook's first code cell.

### 5 — Open the notebooks

```bash
jupyter lab
```

## SDK

The [jiskta Python SDK](https://pypi.org/project/jiskta/) is available on PyPI:

```bash
pip install "jiskta[pandas]"
```

Full documentation: [jiskta.com/docs](https://jiskta.com/docs)

## License

Example notebooks are MIT licensed. Data from the Jiskta API is subject to the [Jiskta Terms of Service](https://jiskta.com/terms).

Data sources used in these notebooks:
- **Copernicus CAMS** — European Centre for Medium-Range Weather Forecasts (ECMWF). Contains modified Copernicus Atmosphere Monitoring Service information.
- **ERA5** — ECMWF ERA5 reanalysis. Contains modified Copernicus Climate Change Service information.
- **E-PRTR** — European Environment Agency. Licence: CC BY 4.0.
- **ODIAC** — Oda & Maksyutov (2011), NIES. DOI: 10.17595/20170411.001
