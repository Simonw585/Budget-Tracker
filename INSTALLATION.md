# 📖 Installation Guide - Budget Tracker

Complete step-by-step guide to install and run the Budget Tracker application.

## 📋 Requirements

Before starting, ensure you have installed:

1. **Node.js & npm**
   - Download from: https://nodejs.org
   - Minimum version: Node 14, npm 6
   - Verify: `node --version` and `npm --version`

2. **MySQL Database**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or MariaDB: https://mariadb.org/download/
   - Minimum version: MySQL 5.7 or MariaDB 10.3
   - Verify: `mysql --version`

3. **Text Editor / IDE**
   - VS Code (Recommended): https://code.visualstudio.com
   - WebStorm, Sublime, or any editor supporting TypeScript

## 🚀 Installation Steps

### Step 1: Download/Clone the Project

```bash
# If you have git
git clone https://github.com/yourusername/budget-tracker.git
cd budget-tracker

# Or extract the ZIP file
cd budget-tracker
```

### Step 2: Verify Prerequisites

```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version (should be 6+)
npm --version

# Check MySQL version (should be 5.7+)
mysql --version
```

### Step 3: Setup MySQL Database

#### Option A: Using Command Line (Recommended)

```bash
# Start MySQL CLI
mysql -u root -p

# Enter your MySQL password when prompted
# Then run the schema script to exit MySQL
exit

# Run the schema file
mysql -u root -p budget_db < backend/sql/schema.sql
```

#### Option B: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script
4. Navigate to `backend/sql/schema.sql`
5. Click Execute (or Ctrl+Enter)
6. Verify database and tables created

#### Option C: Using PhpMyAdmin (if available)

1. Go to `http://localhost/phpmyadmin`
2. Create new database: `budget_db`
3. Import file: `backend/sql/schema.sql`
4. Click Import

### Step 4: Configure Backend Environment

```bash
# Navigate to backend folder
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# Recommendation: Use VS Code to edit
```

**Edit `backend/.env` file:**

```dotenv
# Server Configuration
NODE_ENV=development
PORT=4000

# MySQL Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=         # Leave empty if no password, or add your password
DB_NAME=budget_db

# CORS Configuration
CORS_ORIGIN=*        # Allow all origins in development
```

**Save the file.**

### Step 5: Install Backend Dependencies

```bash
# Verify you're in the backend folder
cd backend

# Install npm packages
npm install

# Verify installation
npm list --depth=0
```

**Expected output should show:**
- express
- cors
- dotenv
- mysql2
- nodemon

### Step 6: Test Backend Connection

```bash
# Start backend server
npm run dev

# Expected output:
# ✅ Database connection pool initialized successfully
# 
# ╔════════════════════════════════════════════════════════════╗
# ║          🚀 Budget Tracker API Server Running 🚀           ║
# ╚════════════════════════════════════════════════════════════╝
# 📍 Server running on: http://localhost:4000
```

**If you see errors:**
1. Check MySQL is running
2. Verify .env credentials
3. Check port 4000 is available
4. See Troubleshooting section below

**Leave the backend running and open a new terminal for the next step.**

### Step 7: Install Frontend Dependencies

```bash
# Navigate to project root (not backend folder)
cd ..

# Verify you're in the right folder
ls          # Should see 'backend', 'src', 'angular.json'

# Install npm packages
npm install

# This may take 2-3 minutes
```

**Expected: Should complete without errors.**

### Step 8: Start Frontend Development Server

```bash
# In a new terminal, from project root
npm run start

# Expected output:
# ✔ Compiled successfully.
# ** Angular Live Development Server is listening on localhost:4200 **
# ** open your browser on http://localhost:4200 **
```

### Step 9: Access the Application

1. **Open your browser**
   - Go to: http://localhost:4200
   
2. **You should see:**
   - Dashboard with charts
   - Sidebar with navigation
   - Navbar with title

3. **If you see an error:**
   - Check backend is still running
   - Check browser console (F12) for errors
   - See Troubleshooting section

## ✅ Verification Checklist

After installation, verify everything works:

```bash
# Test 1: Backend Health
curl http://localhost:4000/health
# Should return: {"status":"healthy",...}

# Test 2: Database Health
curl http://localhost:4000/health/db
# Should return: {"status":"healthy","database":"connected",...}

# Test 3: API Endpoints
curl http://localhost:4000/api/income
# Should return: []

# Test 4: Frontend Loads
# Visit http://localhost:4200 in browser
# Should display dashboard without errors
```

## 🔧 Running the Application

### Development Mode (Both Frontend & Backend)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run start
```

**Then open:** http://localhost:4200

### Quick Start (Combined)

```bash
# From project root
npm run dev
```

This starts both frontend and backend together.

### Production Mode

```bash
# Build frontend
npm run build

# Start backend in production
cd backend
NODE_ENV=production npm start
```

## 📂 Project Structure After Installation

```
budget-tracker/
├── backend/
│   ├── node_modules/           # Installed dependencies
│   ├── server.js               # Main server file
│   ├── package.json
│   ├── .env                    # Your configuration
│   ├── .env.example
│   ├── src/
│   │   ├── db.js
│   │   ├── controllers/
│   │   └── routes/
│   └── sql/
│       └── schema.sql
│
├── src/                        # Frontend source
│   ├── app/
│   ├── environments/
│   └── styles/
│
├── node_modules/               # Frontend dependencies
├── angular.json
├── package.json
├── README.md
└── TESTING.md
```

## 🐛 Troubleshooting

### MySQL Not Starting

**Windows:**
1. Open Services (services.msc)
2. Find MySQL service
3. Right-click → Start
4. Or restart computer

**Linux:**
```bash
sudo systemctl start mysql
```

**Mac:**
```bash
brew services start mysql
```

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
1. Verify MySQL is running
2. Check .env credentials are correct
3. Check port 3306 is not in use
4. Recreate database: `mysql -u root -p < backend/sql/schema.sql`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution - Kill Process:**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess | Stop-Process

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

**Or change port in backend/.env:**
```
PORT=5000
```

### npm Install Fails

```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Use legacy peer dependencies flag
npm install --legacy-peer-deps

# Or clear npm cache
npm cache clean --force
npm install
```

### Frontend Not Loading

```
Cannot GET /
```

**Solution:**
1. Check backend is running
2. Verify http://localhost:4000/health works
3. Check proxy.conf.json is correct
4. Check browser console for errors

### Blank Page in Browser

**Solution:**
1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - look for red requests
4. Restart both servers
5. Clear browser cache (Ctrl+Shift+Delete)

### CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify backend .env has: `CORS_ORIGIN=*`
2. Restart backend server
3. Clear browser cache
4. In production, set specific origin:
   ```
   CORS_ORIGIN=https://yourdomain.com
   ```

### Out of Memory Error

```
JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node memory
node --max-old-space-size=4096 backend/server.js
```

### Wrong Node Version

```
Error: The requested version of Node.js is not compatible
```

**Solution:**
1. Check version: `node --version`
2. Install correct version from nodejs.org
3. Verify: `node --version` again

## 🚢 Next Steps After Installation

1. **Explore the Application**
   - Add some test income and expenses
   - Check the analytics dashboard
   - Review the budget features

2. **Customize**
   - Change colors in src/styles/
   - Modify database categories
   - Add new features

3. **Deploy**
   - Follow deployment instructions in README.md
   - Set up production database
   - Configure domain

4. **Backup**
   - Export database regularly
   - Version control with git
   - Backup source code

## 📚 Additional Resources

- **Angular Documentation**: https://angular.io/docs
- **Express.js Documentation**: https://expressjs.com
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/

## 💬 Getting Help

If you encounter issues:

1. **Check Error Message** - Usually indicates the problem
2. **Read TESTING.md** - Provides common solutions
3. **Check Terminal Output** - Backend logs are helpful
4. **Check Browser Console** - Frontend errors shown there
5. **Check .env Configuration** - Most issues are config related

## ✨ Congratulations!

If you've reached here without issues, you have successfully installed Budget Tracker! 🎉

**Start managing your budget now:** http://localhost:4200

---

**Need help? Refer to README.md or TESTING.md for more information.**
