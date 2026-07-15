# Installation notes

These are the steps I use when setting this project up on a local machine.

## What you need

- Node.js and npm
- A running MySQL server
- A terminal and a browser

## 1. Clone or open the project

```bash
cd budget-tracker
```

## 2. Install dependencies

Install the frontend packages from the project root:

```bash
npm install
```

Install the backend packages in the backend folder:

```bash
cd backend
npm install
```

## 3. Create the database

Run the SQL schema once against your local MySQL server:

```bash
mysql -u root -p < backend/sql/schema.sql
```

If you prefer, you can also open the file in MySQL Workbench and run it there.

## 4. Configure the backend environment

Create a local environment file in the backend folder:

```bash
cp .env.example .env
```

Then update the values to match your machine:

```dotenv
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=budget_db
DB_PORT=3306
PORT=4000
```

## 5. Start the backend

```bash
cd backend
npm run dev
```

If the database connection works, the server should start and report the health endpoint at http://localhost:4000/health.

## 6. Start the frontend

Open a second terminal from the project root:

```bash
npm run start
```

The Angular app should be available at http://localhost:4200.

## 7. Verify the setup

Check these in the browser or terminal:

- http://localhost:4200
- http://localhost:4000/health
- http://localhost:4000/health/db

If everything is working, you should see the app load and the API should return a healthy status for both the server and the database.

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
