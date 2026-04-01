# Jiskta Examples

Practical examples for the [Jiskta Climate Data API](https://jiskta.com) — historical air quality, meteorology, and emissions data via a fast REST API.

[![PyPI](https://img.shields.io/pypi/v/jiskta?label=Python+SDK&color=3b82f6)](https://pypi.org/project/jiskta/)
[![npm](https://img.shields.io/npm/v/jiskta?label=Node.js+SDK&color=3b82f6)](https://www.npmjs.com/package/jiskta)

## What's in this repo

| Folder | Language | What it is |
|--------|----------|------------|
| [`notebooks/`](notebooks/) | Python | 9 Jupyter notebooks — air quality analysis, ESG reporting, WHO exceedance, proptech scoring and more |
| [`nodejs-map-explorer/`](nodejs-map-explorer/) | Node.js | Interactive web app — click anywhere on a map to instantly plot 6 years of NO₂, PM2.5 and temperature |

## Quick start

### Python notebooks

```bash
git clone https://github.com/jiskta/jiskta-examples.git
cd jiskta-examples

pip install -r requirements.txt
export JISKTA_API_KEY=sk_live_YOUR_API_KEY
jupyter lab notebooks/
```

→ See [`notebooks/README.md`](notebooks/README.md) for the full notebook list and setup guide.

### Node.js map explorer

```bash
cd nodejs-map-explorer
npm install
JISKTA_API_KEY=sk_live_YOUR_API_KEY node server.js
# → open http://localhost:3000
```

→ See [`nodejs-map-explorer/README.md`](nodejs-map-explorer/README.md) for configuration and credits info.

## SDKs

| SDK | Install | Source |
|-----|---------|--------|
| Python | `pip install "jiskta[pandas]"` | [github.com/jiskta/jiskta-python](https://github.com/jiskta/jiskta-python) |
| Node.js | `npm install jiskta` | [github.com/jiskta/jiskta-node](https://github.com/jiskta/jiskta-node) |

Full API reference: [jiskta.com/docs](https://jiskta.com/docs)

## Get an API key

Sign up at [jiskta.com](https://jiskta.com) — free credits included.

## License

MIT. Data from the Jiskta API is subject to the [Jiskta Terms of Service](https://jiskta.com/terms).
