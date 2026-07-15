# Backend notes

This folder contains the Express API for the budget tracker. It talks to MySQL and serves the data used by the Angular frontend.

## What the backend does

- exposes health endpoints for the server and the database
- serves CRUD routes for income, expenses, and budgets
- validates input before writing to MySQL
- returns JSON for the frontend to consume

## Run it locally

```bash
cd backend
npm install
npm run dev
```

The API should be available at http://localhost:4000.

## Main files

- server.js starts the Express app
- src/db.js manages the MySQL connection pool
- src/routes contains the API route definitions
- src/controllers contains the request handlers
- sql/schema.sql creates the database tables

## Main API routes

- GET /health
- GET /health/db
- GET /api/income
- POST /api/income
- GET /api/expenses
- POST /api/expenses
- GET /api/budgets
- POST /api/budgets

If you are debugging the app, the route and controller files are the best place to start.

