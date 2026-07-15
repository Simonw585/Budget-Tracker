# Testing Guide for Budget Tracker

This guide helps you verify that the Budget Tracker application is working correctly.

## Prerequisites

1. **MySQL Running**
   ```bash
   # Check MySQL service is running
   # Windows: Services > MySQL
   # Linux: sudo systemctl status mysql
   # Mac: brew services list
   ```

2. **Database Created**
   ```bash
   mysql -u root -p < backend/sql/schema.sql
   ```

## Step 1: Backend Testing

### Start Backend Server

```bash
cd backend
npm install
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════════════════════════╗
║          🚀 Budget Tracker API Server Running 🚀           ║
╚════════════════════════════════════════════════════════════╝
📍 Server running on: http://localhost:4000
🌍 Environment: development
📊 API Base URL: http://localhost:4000/api
```

### Test Health Endpoints

```bash
# Test 1: Server Health
curl http://localhost:4000/health

# Expected Response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "environment": "development"
# }

# Test 2: Database Health
curl http://localhost:4000/health/db

# Expected Response:
# {
#   "status": "healthy",
#   "database": "connected",
#   "timestamp": "2024-01-15T10:30:00.000Z"
# }
```

### Test API Endpoints

```bash
# Test 3: Get Income List (should be empty initially)
curl http://localhost:4000/api/income

# Expected Response: []

# Test 4: Create Income
curl -X POST http://localhost:4000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Salary",
    "amount": 5000,
    "date": "2024-01-15"
  }'

# Expected Response:
# {
#   "id": 1,
#   "message": "Income created successfully"
# }

# Test 5: Create Expense
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food & Dining",
    "description": "Grocery shopping",
    "amount": 150.50,
    "date": "2024-01-15"
  }'

# Expected Response:
# {
#   "id": 1,
#   "message": "Expense created successfully"
# }

# Test 6: Create Budget
curl -X POST http://localhost:4000/api/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Groceries",
    "amount": 500,
    "period": "monthly"
  }'

# Expected Response:
# {
#   "id": 1,
#   "message": "Budget created successfully"
# }

# Test 7: Get All Income
curl http://localhost:4000/api/income

# Expected Response (with created income):
# [
#   {
#     "id": 1,
#     "source": "Salary",
#     "amount": 5000,
#     "date": "2024-01-15",
#     ...
#   }
# ]

# Test 8: Get Expense Summary
curl http://localhost:4000/api/expenses/summary

# Expected Response:
# {
#   "total_expenses": 1,
#   "total_amount": 150.5
# }

# Test 9: Update Income
curl -X PUT http://localhost:4000/api/income/1 \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Salary",
    "amount": 5500,
    "date": "2024-01-15"
  }'

# Expected Response:
# {
#   "updated": true,
#   "message": "Income updated successfully"
# }

# Test 10: Delete Expense
curl -X DELETE http://localhost:4000/api/expenses/1

# Expected Response:
# {
#   "deleted": true,
#   "message": "Expense deleted successfully"
# }
```

## Step 2: Frontend Testing

### Start Frontend Server

**Terminal 2:**
```bash
npm install
npm run start
```

**Expected Output:**
```
✔ Compiled successfully.
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

### Test in Browser

1. **Open Application**
   - Navigate to: http://localhost:4200
   - Application should load without errors

2. **Check Console**
   - Open DevTools (F12)
   - Console tab should not have red errors
   - You should see successful API calls in the Network tab

3. **Test Dashboard**
   - Income should show total: $5,500 (from our test)
   - Expenses should show total: $0 (we deleted it)
   - Balance should be positive

4. **Test Add Expense**
   - Navigate to Expenses section
   - Add new expense: "Lunch" for $25
   - Should see confirmation message
   - Expense should appear in list

5. **Test Add Income**
   - Navigate to Income section
   - Add new income: "Freelance" for $500
   - Should see confirmation message
   - Income should appear in list

6. **Test Charts**
   - Navigate to Analytics
   - Charts should display with your data
   - No "undefined" errors

## Step 3: Data Persistence Testing

1. **Close Application**
   - Close browser and refresh
   - Or restart both frontend and backend

2. **Verify Data**
   - Data should persist
   - Income and expenses should still be there
   - This confirms MySQL is working

## Common Issues & Solutions

### Issue: Database Connection Error
```
❌ Failed to connect to database
```
**Solution:**
1. Check MySQL is running
2. Verify credentials in `backend/.env`
3. Create database: `mysql -u root -p < backend/sql/schema.sql`

### Issue: API Returns 404
```
Error: ECONNREFUSED
```
**Solution:**
1. Start backend server: `npm run dev` in backend folder
2. Check port 4000 is not in use
3. Verify proxy.conf.json points to localhost:4000

### Issue: CORS Error in Browser
```
Access to XMLHttpRequest at 'http://localhost:4000/api/income' from origin 'http://localhost:4200' has been blocked by CORS policy
```
**Solution:**
1. Backend is not running
2. Check `backend/.env` has `CORS_ORIGIN=*`
3. Restart backend server

### Issue: Validation Errors on Create
```
{
  "errors": ["Category is required"]
}
```
**Solution:**
1. Ensure all required fields are provided
2. Check data types (amount must be number)
3. Date must be in YYYY-MM-DD format

### Issue: Port Already in Use
```
Port 4000 already in use
```
**Solution:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

Then change `backend/.env`:
```
PORT=5000
```

## Performance Testing

### Load Test API

```bash
# Test: Get 100 expenses
for i in {1..100}; do
  curl -X POST http://localhost:4000/api/expenses \
    -H "Content-Type: application/json" \
    -d "{\"category\":\"Test\",\"description\":\"Test $i\",\"amount\":$((RANDOM % 1000)),\"date\":\"2024-01-15\"}"
done

# Then fetch and time it
time curl http://localhost:4000/api/expenses
```

## Database Verification

### Check Database Directly

```bash
# Connect to MySQL
mysql -u root -p budget_db

# Check income records
SELECT COUNT(*) as total_income FROM income;

# Check expense records
SELECT COUNT(*) as total_expenses FROM expenses;

# Check budget records
SELECT COUNT(*) as total_budgets FROM budgets;

# Check categories
SELECT * FROM budget_categories;

# Exit
EXIT;
```

## Production Build Testing

### Build Frontend

```bash
npm run build
```

Expected output: `dist/budget-tracker-pro/` folder created

### Test Production Mode

```bash
cd backend
NODE_ENV=production npm start
```

Then open: http://localhost:4000

The backend should serve the Angular build directly.

## Summary Checklist

- ✅ Backend starts without errors
- ✅ Database health check passes
- ✅ Can create income, expenses, budgets
- ✅ Data persists after refresh
- ✅ Frontend loads without errors
- ✅ Charts display correctly
- ✅ All CRUD operations work
- ✅ Filtering works
- ✅ No console errors
- ✅ Mobile responsive

## Support

If you encounter issues:

1. **Check the error message** - Usually indicates the problem
2. **Check terminal output** - Backend logs are helpful
3. **Check browser console** - Frontend errors shown there
4. **Review .env configuration** - Most issues are config related
5. **Verify MySQL is running** - Essential for backend

## Next Steps

After verification:
1. Deploy to production (see README.md)
2. Add more test data
3. Test on different browsers
4. Check mobile responsiveness
5. Consider adding more features

---

**All tests passing? Congratulations! Your Budget Tracker is fully functional! 🎉**
