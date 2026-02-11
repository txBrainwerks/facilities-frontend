# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a multi-project workspace for a **Facilities Management System** — a full-stack web application for managing assets, work orders, technicians, and maintenance schedules.

## Architecture

**Three-tier architecture**: React SPA frontend → FastAPI REST backend → PostgreSQL database (Docker).

- **Backend API** (`facilities-management/backend/`): Python FastAPI with SQLAlchemy ORM, Pydantic validation, Uvicorn server
- **Frontend** (`hello/facilities-frontend/`): React 19 + Vite 7.3.1 SPA with React Router, CSS Modules
- **Database**: PostgreSQL via Docker container (`facilities-db`), connection string `postgresql://postgres:devpass@localhost:5432/facilities`
- **Dev launcher** (`dev setup/start-dev.bat`): Starts PostgreSQL container, activates Python venv, launches Vite dev server

The `facilities-management/frontend/` directory is empty — the actual frontend lives at `hello/facilities-frontend/`.

## Backend Structure

```
facilities-management/backend/
├── main.py                    # FastAPI app, CORS config, router registration
├── database/connection.py     # SQLAlchemy engine, session factory, get_db() dependency
├── models/models.py           # All ORM models (Asset, Technician, WorkOrder, MaintenanceSchedule)
├── routers/
│   ├── assets.py              # /api/assets - CRUD
│   ├── work_orders.py         # /api/work-orders - CRUD with status/priority filtering
│   ├── technicians.py         # /api/technicians - CRUD
│   └── maintenance_schedules.py  # /api/maintenance-schedules - CRUD with is_active filtering
└── requirements.txt
```

CORS is configured for `http://localhost:5173`. API docs at `http://localhost:8000/docs`.

## Frontend Structure

```
hello/facilities-frontend/src/
├── main.jsx                          # App entry, BrowserRouter wrapper
├── index.css                         # CSS custom properties, dark-mode-first theme
├── App.jsx                           # Route definitions nested under Layout
├── services/
│   └── api.js                        # Fetch wrapper: get/post/put/del via /api proxy
├── hooks/
│   └── useApi.js                     # Data-fetching hook: { data, loading, error, refetch }
├── components/
│   ├── Layout/Layout.jsx             # Sidebar + <Outlet/> content area
│   ├── Sidebar/Sidebar.jsx           # NavLink navigation to all 5 pages
│   ├── DataTable/DataTable.jsx       # Reusable table with column config, Edit/Delete actions
│   ├── Modal/Modal.jsx               # Portal-based modal with Escape-to-close
│   └── StatusBadge/StatusBadge.jsx   # Colored pill for status/priority enum values
└── pages/
    ├── Dashboard/Dashboard.jsx       # Summary cards, asset status breakdown, urgent work orders
    ├── Assets/Assets.jsx + AssetForm.jsx
    ├── WorkOrders/WorkOrders.jsx + WorkOrderForm.jsx  # Includes status/priority filter bar
    ├── Technicians/Technicians.jsx + TechnicianForm.jsx
    └── Schedules/Schedules.jsx + ScheduleForm.jsx     # Includes is_active filter
```

All CSS uses CSS Modules (`.module.css` files co-located with components).

Vite proxy: `/api` requests are forwarded to `http://localhost:8000` (configured in `vite.config.js`).

### Frontend Patterns

- **CRUD pages**: Each entity page manages modal state (`null | 'create' | 'edit' | 'delete'`) and a selected record
- **Forms**: Accept optional `initial` prop for edit mode; handle both create and edit
- **Foreign key display**: WorkOrders and Schedules fetch assets/technicians lists to build `id→name` lookup maps for table columns and form dropdowns
- **Date fields**: `<input type="date">` with ISO strings sliced to `YYYY-MM-DD`
- **useApi hook**: Uses a tick-based refetch pattern to satisfy React Hooks lint rules (no setState in effects)

### Data Model Relationships

- Asset → many WorkOrders, many MaintenanceSchedules
- Technician → many WorkOrders, many MaintenanceSchedules (via assigned_technician_id)
- WorkOrder belongs to one Asset and one Technician

Key enums: Asset status (OPERATIONAL/DOWN/MAINTENANCE/RETIRED), WorkOrder status (OPEN/IN_PROGRESS/COMPLETED/CLOSED), WorkOrder priority (LOW/MEDIUM/HIGH/URGENT).

## Commands

### Start Full Dev Environment
```
"D:\projects\dev setup\start-dev.bat"
```
This starts PostgreSQL Docker container, opens Python venv, and starts Vite dev server.

### Backend
```bash
cd D:\projects\facilities-management\backend
..\venv\Scripts\activate          # activate virtual environment
pip install -r requirements.txt   # install dependencies
python -m uvicorn main:app --reload   # start API server on localhost:8000
```

### Frontend
```bash
cd D:\projects\hello\facilities-frontend
npm install       # install dependencies
npm run dev       # Vite dev server on localhost:5173
npm run build     # production build to dist/
npm run lint      # ESLint (v9 flat config, React Hooks + React Refresh rules)
npm run preview   # preview production build
```

## Dependencies

### Backend (requirements.txt)
- FastAPI, Uvicorn, SQLAlchemy, psycopg2-binary, pydantic[email], python-dotenv

### Frontend (package.json)
- react, react-dom, react-router-dom
- Dev: vite, eslint (v9 flat config), @vitejs/plugin-react

## Resolved Issues

- `email-validator` added to requirements.txt (required by Pydantic's `EmailStr` in technician routes)
- CORS origin fixed to `localhost:5173` to match Vite dev server
- `pyvenv.cfg` path updated to reflect current project location on D: drive
- Maintenance schedules router added (model existed but had no API endpoints)
- Frontend UI built: sidebar navigation, Dashboard, Assets, Work Orders, Technicians, and Schedules pages with full CRUD
- `useApi` hook restructured to use tick-based refetch (avoids `react-hooks/set-state-in-effect` lint error)
