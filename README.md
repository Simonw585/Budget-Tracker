# 💰 Budget Tracker

A professional, full-stack budget tracking application built with **Angular 21**, **Express.js**, and **MySQL**. Manage your income, expenses, and budgets with beautiful visualizations and analytics.

## 🎯 Features

- 📊 **Dashboard** - Overview of income, expenses, and balance
- 💸 **Income Tracking** - Manage multiple income sources
- 💳 **Expense Management** - Categorize and track expenses
- 📈 **Budget Planning** - Create and monitor budgets
- 📉 **Analytics** - Charts and statistics
- 🏷️ **Categories** - Predefined categories for expenses
- 🔍 **Filtering** - Filter by date range, category, and more
- 💾 **MySQL Database** - Reliable data persistence
- 🔐 **CORS Enabled** - Secure cross-origin requests
- 📱 **Responsive UI** - Works on desktop and mobile

## 🛠️ Tech Stack

### Frontend
- **Angular 21** - Modern frontend framework
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **Chart.js** - Data visualization
- **Angular CDK** - Component Dev Kit

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL 8** - Relational database
- **mysql2** - MySQL driver with promise support

## 📋 Prerequisites

- **Node.js** v14.0.0 or higher
- **npm** v6.0.0 or higher
- **MySQL** v5.7 or higher (MariaDB 10.3+ compatible)

## 🚀 Quick Start

### 1. Clone or Extract Project

```bash
cd budget-tracker
```

### 2. Setup MySQL Database

```bash
# Option A: Using MySQL CLI
mysql -u root -p < backend/sql/schema.sql

# Option B: Using MySQL Workbench
# Open backend/sql/schema.sql and execute
```

### 3. Setup Backend

```bash
cd backend
npm install
cp .env.example .env

# Edit .env with your MySQL credentials
# Then start the backend
npm run dev
```

Backend runs on: **http://localhost:4000**

### 4. Setup Frontend

```bash
# From project root
npm install
npm run start
```

Frontend runs on: **http://localhost:4200**

### 5. Access the Application

Open your browser to: **http://localhost:4200**

## 📡 API Endpoints

### Health Checks
```
GET /health              # Server status
GET /health/db           # Database status
```

### Income API
```
GET    /api/income              # List income
POST   /api/income              # Create income
GET    /api/income/:id          # Get income
PUT    /api/income/:id          # Update income
DELETE /api/income/:id          # Delete income
GET    /api/income/sources      # Income summary
```

### Expenses API
```
GET    /api/expenses            # List expenses
POST   /api/expenses            # Create expense
GET    /api/expenses/:id        # Get expense
PUT    /api/expenses/:id        # Update expense
DELETE /api/expenses/:id        # Delete expense
GET    /api/expenses/categories # Expense summary
```

### Budgets API
```
GET    /api/budgets             # List budgets
POST   /api/budgets             # Create budget
GET    /api/budgets/:id         # Get budget
PUT    /api/budgets/:id         # Update budget
DELETE /api/budgets/:id         # Delete budget
GET    /api/budgets/categories  # Budget categories
```

## 📁 Project Structure

```
budget-tracker/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── core/          # Services, models, guards
│   │   ├── features/      # Feature modules
│   │   ├── shared/        # Shared components
│   │   ├── layout/        # Navbar, sidebar, footer
│   │   ├── app.routes.ts  # Routes
│   │   └── app.config.ts  # Configuration
│   ├── environments/      # Environment config
│   └── styles/           # Styles
│
├── backend/               # Express API
│   ├── server.js         # Main server
│   ├── src/
│   │   ├── db.js         # Database
│   │   ├── controllers/  # Handlers
│   │   └── routes/       # Routes
│   ├── sql/schema.sql    # Database schema
│   └── .env.example      # Environment template
│
├── angular.json
├── tsconfig.json
├── package.json
└── proxy.conf.json
```

## 🔧 Development

### Frontend + Backend (Full Stack)

Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

Terminal 2 - Frontend:
```bash
npm install
npm run start
```

Or run both together:
```bash
npm run dev
```

### Frontend Only
```bash
npm install
npm run start
```

### Build for Production

```bash
# Build Angular
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
```

## 🧪 Testing

```bash
npm run test
npm run lint
```

## 📊 Database Schema

### Main Tables
- **users** - User accounts
- **budget_categories** - Expense categories
- **budgets** - Budget records
- **income** - Income transactions
- **expenses** - Expense transactions
- **transaction_history** - Audit trail

### Features
- Foreign key relationships
- Performance indexes
- Soft delete support
- Timestamps on all records
- Recurring transaction support

## 🐛 Troubleshooting

### Database Connection Failed
1. Verify MySQL is running: `mysql -u root -p`
2. Check `.env` credentials match your setup
3. Verify database exists: `mysql -u root -p budget_db`

### Port 4000 Already in Use (Backend)
```powershell
# Windows
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

Change port in `backend/.env`: `PORT=5000`

### Port 4200 Already in Use (Frontend)
```bash
npm run start -- --port 4300
```

### CORS Errors
Update `backend/.env`:
```
CORS_ORIGIN=http://localhost:4200
```

## 📦 Key Dependencies

**Frontend:**
- `@angular/core` - Angular framework
- `chart.js` & `ng2-charts` - Charting
- `rxjs` - Reactive extensions

**Backend:**
- `express` - Web framework
- `mysql2` - Database driver
- `cors` - CORS middleware
- `dotenv` - Config management

## 🚢 Deployment

### Traditional Hosting
```bash
npm install
npm run build
cd backend
NODE_ENV=production npm start
```

### Docker
```bash
docker build -t budget-tracker .
docker run -p 4000:4000 budget-tracker
```

## 📝 License

MIT License

## 🎉 Roadmap

- [ ] User authentication
- [ ] Multi-user support
- [ ] Budget notifications
- [ ] PDF/CSV export
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] Bank API integration

---

**Start tracking your budget today! 💰**

