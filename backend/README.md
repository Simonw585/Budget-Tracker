# Budget Tracker Backend

Node.js + Express backend for the Budget Tracker application using MySQL.

Setup

1. Copy `.env.example` to `.env` and fill credentials.

2. Install deps:

```bash
cd backend
npm install
```

3. Create database and tables:

```bash
# Using mysql CLI
mysql -u root -p < sql/schema.sql
```

4. Run server:

```bash
npm run dev
```

API

- `GET /health` - health check
- `GET /api/income` - list income
- `POST /api/income` - create income
- `GET /api/expenses` - list expenses
- `POST /api/expenses` - create expense
- `GET /api/budgets` - list budgets
- `POST /api/budgets` - create budget
