# Budget Tracker

This project is a small budget tracker built with Angular on the frontend and a Node.js/Express API on the backend. It stores income, expenses, and budgets in MySQL and shows the main numbers in a simple dashboard.

## What the app does

- The dashboard gives a quick view of income, expenses, and balance.
- The income page lets you add, edit, and remove income entries.
- The expenses page does the same for spending.
- The analytics page shows basic charts based on the stored data.
- The backend exposes REST endpoints for the UI and for future integrations.

## Tech stack

- Frontend: Angular, TypeScript, RxJS, Chart.js
- Backend: Node.js, Express, MySQL, mysql2

## Requirements

- Node.js 18 or newer
- npm
- MySQL 8 or a local MySQL-compatible server

## Run locally

### 1. Create the database

Run the schema file once against your local MySQL server:

```bash
mysql -u root -p < backend/sql/schema.sql
```

### 2. Configure the backend

Create a local environment file in the backend folder:

```bash
cd backend
cp .env.example .env
```

Then edit the file so it points to your local MySQL instance.

Example:

```dotenv
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=budget_db
DB_PORT=3306
PORT=4000
```

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

The API should be available at http://localhost:4000.

### 4. Start the frontend

In a second terminal from the project root:

```bash
npm install
npm run start
```

Open http://localhost:4200 in the browser.

## Project layout

- src/app contains the Angular UI
- backend/src contains the Express routes and controllers
- backend/sql/schema.sql contains the database schema

## Useful commands

```bash
npm run build
npm run dev
```

If you are changing the app, the main places to look are the Angular feature components under src/app and the API handlers under backend/src.

## License

MIT License

