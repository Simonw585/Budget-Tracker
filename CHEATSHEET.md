# Budget Tracker cheat sheet

This is a quick map of the project so it is easier to move around when you are working on it.

## Main pieces

- The Angular app lives in src/app.
- The API lives in backend.
- The database schema is in backend/sql/schema.sql.

## Frontend layout

- src/app/app.routes.ts defines the main routes.
- src/app/app.config.ts holds the basic app config values.
- src/app/features/dashboard contains the dashboard screen.
- src/app/features/income contains the income page.
- src/app/features/expenses contains the expenses page.
- src/app/features/analytics contains the charts page.
- src/app/layout contains the shared navbar and sidebar.

## Backend layout

- backend/server.js starts the Express app.
- backend/src/db.js handles the MySQL connection pool.
- backend/src/routes contains the API routes.
- backend/src/controllers contains the request handlers.

## Where to change things

- Change the seed data in src/app/core/services/budget.service.ts.
- Add a new screen by creating a feature component under src/app/features.
- Add a new API route under backend/src/routes and its controller under backend/src/controllers.

## Local URLs

- Frontend: http://localhost:4200
- Backend: http://localhost:4000
- Health check: http://localhost:4000/health
- Database health: http://localhost:4000/health/db

This file is meant to be a practical reference while working on the project, not a formal spec.
