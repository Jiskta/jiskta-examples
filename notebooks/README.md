# Jiskta Python Notebooks

Jupyter notebooks demonstrating the [Jiskta Python SDK](https://pypi.org/project/jiskta/) against the Copernicus CAMS and ERA5 climate datasets.

## Notebooks

| # | Notebook | What it covers |
|---|----------|----------------|
| 1 | [Quick Start](01_quick_start.ipynb) | Install the SDK, make your first query, plot daily NO₂ over Paris |
| 2 | [City Air Quality Report](02_air_quality_report.ipynb) | Full-year multi-pollutant analysis with seasonal trends |
| 3 | [WHO Exceedance Analysis](03_who_exceedance.ipynb) | Flag days that exceed WHO 2021 air quality guidelines; heatmap calendar |
| 4 | [Multi-City Comparison](04_multi_city_comparison.ipynb) | Compare NO₂ across Paris, London, Amsterdam and Berlin |
| 5 | [EEA Monthly Validation](05_eea_monthly_validation.ipynb) | Cross-validate CAMS reanalysis against EEA station measurements |
| 6 | [Proptech Air Score](06_proptech_air_score.ipynb) | Rank properties by air quality for real-estate listings |
| 7 | [Urban Planning Analysis](07_urban_planning.ipynb) | Spatial NO₂ trend analysis for city planning use cases |
| 8 | [ESG Reporting](08_esg_reporting.ipynb) | ESRS E2 air quality section for CSRD statutory reports |
| 9 | [ESG Satellite Validation](09_esg_satellite_validation.ipynb) | Cross-validate CAMS air quality against stock performance and E-PRTR emissions |

## Setup

### 1 — Get an API key

Sign up at [jiskta.com](https://jiskta.com) and copy your key from the [dashboard](https://jiskta.com/dashboard).

### 2 — Install dependencies

From the repo root:

```bash
pip install -r requirements.txt
```

Or directly:

```bash
pip install "jiskta[pandas]>=0.5.0" matplotlib seaborn numpy jupyterlab
```

### 3 — Set your API key

```bash
export JISKTA_API_KEY=sk_live_YOUR_API_KEY
```

Or paste it directly into the first cell of each notebook.

### 4 — Launch

```bash
jupyter lab notebooks/
```

## Data sources

- **Copernicus CAMS** — ECMWF. Contains modified Copernicus Atmosphere Monitoring Service information.
- **ERA5** — ECMWF ERA5 reanalysis. Contains modified Copernicus Climate Change Service information.
- **E-PRTR** — European Environment Agency. Licence: CC BY 4.0.
- **ODIAC** — Oda & Maksyutov (2011), NIES. DOI: [10.17595/20170411.001](https://doi.org/10.17595/20170411.001)

## License

MIT. Data from the Jiskta API is subject to the [Jiskta Terms of Service](https://jiskta.com/terms).
