# Airtel Telecom KPI System - AI Coding Instructions

## Project Overview

This is a **full-stack KPI monitoring dashboard** for telecom metrics. It features:

- **Backend**: FastAPI (Python) serving real-time KPI data via REST API
- **Frontend**: React with Chart.js for real-time visualization and GitHub Pages deployment
- **Data**: Dynamic time-series generation with static KPI template configuration

## Architecture & Key Data Flows

### Backend (`backend/`)

**Entry point**: `main.py`

- **FastAPI server** with CORS enabled (allows frontend on any origin)
- **Static KPI template** loaded from `kpi_data.json` on startup:
  - Defines KPI metadata (name, unit, min/max values) used for data generation
  - Keys: `throughput`, `latency`, `packet_loss`, `cpu_util`
- **Dynamic data generation**: `/kpis` endpoint generates 120 time-series points (5-min intervals) with random values between configured min/max bounds
- **Server runs on port 8000** (convention: `http://localhost:8000`)

### Frontend (`frontend/`)

**Entry point**: `src/App.js`

- **React + Chart.js** visualization with 2-column grid layout
- **Two-part UI**:
  1. **Sidebar** (left, fixed): Shows latest values + timestamps for each KPI
  2. **Main area** (right, scrollable): 2-column grid of line charts
- **Data fetching strategy**:
  - Attempts to fetch from backend (`http://localhost:8000/kpis`) with 2-second timeout
  - Falls back to mock data (hardcoded arrays) on failure → enables GitHub Pages static hosting
  - **Polls every 5 seconds** to refresh all KPIs
  - Uses axios for HTTP requests

### Integration Point

The frontend expects backend JSON structure:

```javascript
{
  "kpi_key": {
    "kpi_name": "Display Name",
    "unit": "measurement",
    "values": [{ "time": "HH:MM", "value": number }, ...]
  }
}
```

## Development Workflows

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn main.py --reload  # Auto-reload on code changes, port 8000
```

### Frontend Development

```bash
cd frontend
npm install
npm start  # Development server, port 3000, auto-reload on code changes
```

### Building & Deployment

- **Frontend build**: `npm run build` → generates `build/` folder for static hosting
- **GitHub Pages deploy**: `npm run deploy` → pushes `build/` to `gh-pages` branch
- **Homepage URL** in package.json points to GitHub Pages: `https://divyansh01192693629.github.io/Airtel_Telecom_Kpi_System`

## Project-Specific Patterns & Conventions

### 1. Mock Data Fallback Pattern

Frontend gracefully degrades when backend is unavailable (GitHub Pages scenario). Any modifications to backend response format must also update the mock data structure in `App.js` (lines ~25-50) to maintain consistency.

### 2. KPI Configuration via JSON

Adding new KPIs requires **two changes**:

- Update `backend/kpi_data.json` with new entry (key, kpi_name, unit, min, max)
- Update `frontend/src/App.js` mockKpis array with matching structure for offline support

### 3. Time-Series Generation

Backend uses `generate_time_series()` function to create synthetic data:

- 120 data points by default
- 5-minute intervals
- Random values within configured bounds
- Used for all KPIs with same structure

### 4. React Hooks Pattern

- State: `useState` for kpis array
- Side effects: `useEffect` with cleanup (interval clearing) for polling
- ESLint disable comment used for dependency array: `// eslint-disable-next-line react-hooks/exhaustive-deps`

### 5. Styling Convention

Inline styles used throughout (no CSS modules). Key properties:

- Colors: `#1d3557` (dark sidebar), `#457b9d` (accent)
- Layout: flexbox for sidebar, CSS grid for chart layout
- Typography: h1-h4 for headings, consistent padding (15-30px)

## External Dependencies & Integration

### Backend

- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **python-multipart**: Form data parsing (implicit FastAPI dependency)

### Frontend

- **react**, **react-dom**: UI framework
- **axios**: HTTP requests (timeout default 2s for backend check)
- **chart.js**, **react-chartjs-2**: Line chart rendering
- **react-scripts**: Create React App build tooling
- **gh-pages**: GitHub Pages deployment

## Critical Commands for AI Agents

| Task                   | Command                           | Location    |
| ---------------------- | --------------------------------- | ----------- |
| Start backend server   | `uvicorn main.py --reload`        | `backend/`  |
| Start frontend dev     | `npm start`                       | `frontend/` |
| Build frontend         | `npm run build`                   | `frontend/` |
| Deploy to GitHub Pages | `npm run deploy`                  | `frontend/` |
| Install dependencies   | `pip install -r requirements.txt` | `backend/`  |
| Install dependencies   | `npm install`                     | `frontend/` |

## Common Modification Scenarios

**Add new KPI**:

1. Add entry to `backend/kpi_data.json` with name, unit, min/max
2. Add matching object to `frontend/src/App.js` mockKpis array
3. Frontend charts auto-render from API response

**Change polling frequency**:

1. Modify interval duration in `App.js` useEffect (currently 5000ms)

**Change chart layout**:

1. Modify `gridTemplateColumns` style in main content div (currently 2 columns)

**Adjust data generation bounds**:

1. Update min/max values in `kpi_data.json`

## File Structure Reference

- `backend/main.py` - FastAPI routes, CORS, data generation
- `backend/kpi_data.json` - KPI metadata template
- `frontend/src/App.js` - React component with UI + data fetching
- `frontend/package.json` - Dependencies, deployment config (homepage URL)
- `frontend/src/index.js` - React DOM mount point
