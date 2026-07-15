# Budget Tracker - Backend API

A robust Node.js/Express REST API for managing budgets, income, and expenses using MySQL database.

## Features

- ✅ **Full REST API** with CRUD operations
- ✅ **Express.js** - Fast and minimalist web framework
- ✅ **MySQL** - Reliable relational database with proper schema
- ✅ **Error Handling** - Comprehensive error handling and validation
- ✅ **CORS Support** - Cross-Origin Resource Sharing enabled
- ✅ **Async/Await** - Modern promise-based database operations
- ✅ **Environment Configuration** - Flexible configuration using .env
- ✅ **Health Checks** - Server and database health endpoints
- ✅ **Request Logging** - Built-in request logging for debugging

## Prerequisites

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher
- **MySQL** v5.7 or higher

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials.

### 3. Create Database

```bash
mysql -u root -p < sql/schema.sql
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on: `http://localhost:4000`

## API Endpoints

### Health Check
```
GET  /health              # Server health check
GET  /health/db           # Database health check
```

### Income Management
```
GET    /api/income              # List all income
POST   /api/income              # Create income
GET    /api/income/:id          # Get income
PUT    /api/income/:id          # Update income
DELETE /api/income/:id          # Delete income
GET    /api/income/sources      # Income sources summary
GET    /api/income/summary      # Income statistics
```

### Expenses Management
```
GET    /api/expenses            # List all expenses
POST   /api/expenses            # Create expense
GET    /api/expenses/:id        # Get expense
PUT    /api/expenses/:id        # Update expense
DELETE /api/expenses/:id        # Delete expense
GET    /api/expenses/categories # Expense categories summary
GET    /api/expenses/summary    # Expense statistics
```

### Budgets Management
```
GET    /api/budgets             # List all budgets
POST   /api/budgets             # Create budget
GET    /api/budgets/:id         # Get budget
PUT    /api/budgets/:id         # Update budget
DELETE /api/budgets/:id         # Delete budget
GET    /api/budgets/categories  # Budget categories
GET    /api/budgets/summary     # Budget statistics
```

## Example Requests

### Create Income
```bash
curl -X POST http://localhost:4000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Salary",
    "amount": 5000,
    "date": "2024-01-15"
  }'
```

### Create Expense
```bash
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food & Dining",
    "description": "Grocery",
    "amount": 150,
    "date": "2024-01-15"
  }'
```

### Filter Expenses
```bash
curl "http://localhost:4000/api/expenses?startDate=2024-01-01&endDate=2024-01-31"
```

## Database Schema

- **users** - User profiles
- **budget_categories** - Predefined categories
- **budgets** - Budget records with tracking
- **income** - Income records
- **expenses** - Expense records
- **transaction_history** - Audit trail

## Project Structure

```
backend/
├── server.js              # Express server
├── package.json           # Dependencies
├── .env.example          # Environment template
├── sql/schema.sql        # Database schema
└── src/
    ├── db.js             # Database connection
    ├── controllers/      # Route handlers
    └── routes/           # API routes
```

## Development Commands

```bash
npm run dev      # Start with auto-reload
npm start        # Production mode
```

## Deployment

```bash
# Production
NODE_ENV=production npm start

# Docker
docker build -t budget-api .
docker run -p 4000:4000 budget-api
```

## License

MIT
