# Budget Tracker — Information Sheet

**What this project is**
- A full-stack personal finance web application called Budget Tracker.
- Frontend: An Angular single-page application (SPA) providing UI for tracking income, expenses, budgets, and analytics.
- Backend: A Node.js + Express API that serves the frontend in production and exposes JSON endpoints for CRUD operations backed by MySQL.

**What it's used for**
- Track and categorize income and expenses in GBP.
- Maintain budgets and view summaries (total income, total expenses, balance).
- Visualize trends and category breakdowns with charts.
- Provide a simple user profile page to store personal preferences.

**Who should use it**
- Beginner to intermediate developers learning full-stack web development.
- Users who want a self-hosted budgeting tool or an example app to modify for learning.

**Core parts and why they exist**
- `src/app/features/*` (Angular features): UI modules for `income`, `expenses`, `dashboard`, `analytics`, `profile`. Each feature contains a `.ts` (component logic) and `.html` (view). They keep UI code modular and testable.
- `src/app/core/services/budget.service.ts`: Frontend service that reads/writes financial data via HTTP to the backend. Centralizes API calls.
- `backend/server.js`: Express server — sets routes, middleware, health checks, static file serving for production, and starts the HTTP server.
- `backend/src/db.js`: Database pool configuration. Uses environment variables to connect to MySQL and exposes query helpers.
- `backend/src/routes` + `backend/src/controllers`: Map HTTP requests to database operations — where API behavior lives.
- `backend/sql/schema.sql`: Database schema — defines tables and columns the app uses.

**How the data flows (simple)**
1. User interacts with the UI (e.g., adds an expense).
2. Component calls `BudgetService` which sends an HTTP request to `/api/expenses`.
3. Backend controller receives the request, runs a SQL query, and updates the MySQL DB.
4. Backend returns JSON; frontend updates state and UI.

**How to run locally (quick)**
1. Install dependencies (once):
```powershell
cd backend
npm install
cd ..
npm install
```
2. Start both dev servers (runs backend with `nodemon` and Angular dev server):
```powershell
npm run dev
```
3. Open the frontend: `http://localhost:4200`
4. Backend health checks: `http://localhost:4000/health` and `http://localhost:4000/health/db`

**Important configuration**
- Environment variables (create `backend/.env`):
  - `PORT` — backend server port (default 4000)
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` — MySQL connection
  - `NODE_ENV`, `CORS_ORIGIN` — runtime behavior

**Common tasks and where to change them**
- Change UI layout or copy: edit `.html` files in `src/app/features/*`.
- Modify data models: edit `src/app/core/models/budget.model.ts` and backend SQL schema.
- Add an API endpoint: add a route in `backend/src/routes`, write controller logic in `backend/src/controllers`, and add corresponding frontend service method in `budget.service.ts`.

**Quick debugging tips**
- Backend logs: check the terminal running `npm run dev` for request logs and DB errors.
- DB connection issues: visit `/health/db` to test connectivity and check `backend/.env` values.
- Port conflicts: stop other Node processes or change ports (frontend `--port`, backend `PORT` env).

**Why this structure matters (short)**
- Separation of concerns: UI, service layer, API, and DB are isolated so you can work on one part without breaking others.
- Modularity: Feature folders let you add new sections (e.g., `reports`) with minimal changes.
- Reusability: `BudgetService` centralizes API calls so components stay simple.

If you want, I can produce a one-page printable PDF, add a short onboarding `README.md`, or annotate specific files inline for teaching purposes.