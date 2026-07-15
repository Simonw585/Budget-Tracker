# Testing notes

Use this when you want to confirm the app is still working after a change.

## Before you start

Make sure:

- MySQL is running locally
- The database schema has been loaded
- The backend and frontend are both installed

## 1. Check the backend

Start the API:

```bash
cd backend
npm run dev
```

Then verify the health endpoints:

```bash
curl http://localhost:4000/health
curl http://localhost:4000/health/db
```

You should get a healthy response from both.

## 2. Try a real API flow

Create a test income entry:

```bash
curl -X POST http://localhost:4000/api/income \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Test income",
    "amount": 250,
    "date": "2026-07-15",
    "description": "Manual API check"
  }'
```

Then read it back:

```bash
curl http://localhost:4000/api/income
```

If the write and read both work, the MySQL connection is behaving normally.

## 3. Check the frontend

In another terminal from the project root:

```bash
npm run start
```

Open http://localhost:4200 and make sure the app loads without obvious errors.

## 4. Common problems

### MySQL connection error

Check that:

- the MySQL service is running
- the credentials in backend/.env are correct
- the database exists

### API not reachable

Check that:

- the backend is still running
- port 4000 is not being used by something else
- the proxy config points to the backend correctly

### Browser shows a CORS error

This usually means the backend is not running or the backend environment is not allowing the frontend origin.

A short test pass is usually enough to confirm that the app, API, and database are all connected properly.

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
