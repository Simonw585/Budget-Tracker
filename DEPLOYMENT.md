# Deployment notes

This project is simple enough to deploy in a few steps, but the backend still needs a working MySQL connection and a production-safe environment file.

## Before deploying

Make sure you have:

- a server or host that can run Node.js
- access to a MySQL database
- a production-ready environment file for the backend

## 1. Build the frontend

From the project root:

```bash
npm run build
```

That creates the Angular output in the dist folder.

## 2. Prepare the backend environment

In the backend folder, create or update the environment file with production values:

```dotenv
NODE_ENV=production
PORT=4000
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=budget_db
CORS_ORIGIN=https://your-domain.example
```

## 3. Load the database schema

Run the schema file against the production MySQL database:

```bash
mysql -u your-db-user -p < backend/sql/schema.sql
```

## 4. Upload the app

You will need to copy over the backend folder, the built frontend files, and the dependency files needed to run the Node server.

## 5. Start the backend

On the server:

```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

If you want the process to stay up after a reboot, a process manager such as PM2 is worth using.

## 6. Serve the frontend

The Angular build is static, so it can be served by any standard web server or by the backend in production if you choose to wire that up.

## Good deployment checklist

- MySQL is reachable from the server
- The backend can connect to the database
- The production environment values are correct
- The app can still reach the API over the expected host and port

This is enough for a small deployment, and it keeps the setup straightforward.

```

### Option 4: AWS Deployment

#### Prerequisites
- AWS account
- EC2 instance (t2.micro free tier)
- RDS for MySQL

#### Step 1: Launch EC2 Instance

1. Go to AWS Console
2. EC2 → Instances → Launch Instance
3. Choose Ubuntu Server 20.04 LTS
4. Select t2.micro (free tier eligible)
5. Configure security group (allow ports 80, 443, 4000)
6. Launch instance

#### Step 2: Connect to Instance

```bash
# SSH into instance
ssh -i "your-key.pem" ubuntu@ec2-instance-ip

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git
```

#### Step 3: Setup RDS Database

1. Go to AWS RDS Console
2. Create MySQL database
3. Get endpoint and credentials
4. Create database using schema.sql

#### Step 4: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/budget-tracker.git
cd budget-tracker

# Build frontend
npm run build

# Setup backend
cd backend
cp .env.example .env

# Edit .env with RDS credentials
nano .env

# Install dependencies
npm install --production

# Start with PM2
npm install -g pm2
pm2 start server.js --name "budget-tracker"
pm2 startup
pm2 save
```

#### Step 5: Setup Web Server

```bash
# Install Nginx as reverse proxy
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/default

# Add this configuration:
```

```nginx
server {
    listen 80 default_server;
    server_name _;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Restart Nginx
sudo systemctl restart nginx

# Enable HTTPS with Let's Encrypt (optional)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 🔒 Production Security

### 1. Environment Variables

```bash
# Never commit .env to git
echo ".env" >> .gitignore

# Use strong passwords
DB_PASSWORD=$(openssl rand -base64 32)

# Use HTTPS only
CORS_ORIGIN=https://yourdomain.com
```

### 2. Database Security

```sql
-- Create non-root user
CREATE USER 'budget_app'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON budget_db.* TO 'budget_app'@'localhost';
FLUSH PRIVILEGES;

-- Remove anonymous users
DELETE FROM mysql.user WHERE User='';

-- Secure MySQL
mysql -u root -p < /usr/share/mysql/mysql_system_tables.sql
```

### 3. Node.js Security

```bash
# Update all packages
npm audit
npm update

# Run security audit
npm audit fix

# Use helmet for Express security
npm install helmet
```

### 4. SSL/TLS Certificate

```bash
# Using Let's Encrypt (free)
certbot certonly --standalone -d yourdomain.com

# Or purchase SSL certificate from:
# - DigiCert
# - GlobalSign
# - Let's Encrypt
```

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2
npm install -g pm2

# Monitor application
pm2 monit

# Setup log rotation
pm2 install pm2-logrotate

# View logs
pm2 logs budget-tracker

# Save configuration
pm2 save
```

### Application Logging

```javascript
// In server.js
const fs = require('fs');
const logStream = fs.createWriteStream('logs/app.log', { flags: 'a' });

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const log = `[${timestamp}] ${req.method} ${req.path}`;
  logStream.write(log + '\n');
  console.log(log);
  next();
});
```

### Database Backups

```bash
# Manual backup
mysqldump -u user -p database_name > backup_$(date +%Y%m%d).sql

# Automated backup (cron job)
crontab -e

# Add line for daily backup at 2 AM:
0 2 * * * mysqldump -u user -p database_name > /backups/backup_$(date +\%Y\%m\%d).sql
```

## 🚀 Performance Optimization

### 1. Enable Gzip Compression

```javascript
// In server.js
const compression = require('compression');
app.use(compression());
```

### 2. Database Query Optimization

```sql
-- Add indexes
CREATE INDEX idx_date ON expenses(date);
CREATE INDEX idx_category ON expenses(category);
CREATE INDEX idx_user_id ON expenses(user_id);
```

### 3. Frontend Optimization

```bash
# Enable production mode
ng build --configuration production

# Enable lazy loading
# Already configured in app.routes.ts
```

### 4. Caching Headers

```javascript
// In server.js
app.use(express.static('dist', {
  maxAge: '1d',
  etag: false
}));
```

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Build
      run: |
        npm install
        npm run build
    
    - name: Deploy
      run: |
        # Deploy commands
        git push production main
```

## 📈 Scaling Strategies

### 1. Load Balancing

```bash
# Using Nginx
upstream backend {
  server localhost:4000;
  server localhost:4001;
  server localhost:4002;
}

server {
  location / {
    proxy_pass http://backend;
  }
}
```

### 2. Horizontal Scaling

```bash
# Run multiple instances
pm2 start server.js -i 4  # 4 instances

# Or use clustering in Node.js
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }
} else {
  app.listen(PORT);
}
```

### 3. CDN for Static Files

```javascript
// Serve static files from CloudFlare/AWS CloudFront
// Update frontend to use CDN URLs
```

## 🎯 Post-Deployment

1. **Health Checks**
   - Monitor http://yourdomain.com/health
   - Monitor http://yourdomain.com/health/db

2. **Performance Testing**
   - Test with load tools (Apache Bench, wrk)
   - Monitor response times

3. **Security Scanning**
   - Run security audit: `npm audit`
   - Use OWASP ZAP for penetration testing

4. **Backups**
   - Setup daily database backups
   - Test restore process

5. **Updates**
   - Schedule regular package updates
   - Test updates in staging first

## 🆘 Troubleshooting Production

### Application Won't Start

```bash
# Check logs
pm2 logs budget-tracker

# Check port in use
netstat -tlnp | grep 4000

# Check database connection
mysql -u user -p -h host -D database_name
```

### High Memory Usage

```bash
# Monitor memory
pm2 monit

# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Check for memory leaks
npm install clinic
clinic doctor -- npm start
```

### Database Performance

```sql
-- Check slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow query log
SHOW VARIABLES LIKE 'slow_query_log_file';
```

## 📚 Resources

- **AWS Deployment**: https://aws.amazon.com/getting-started/
- **Heroku**: https://devcenter.heroku.com/
- **Docker**: https://docs.docker.com/
- **PM2**: https://pm2.keymetrics.io/
- **SSL Certificates**: https://letsencrypt.org/

---

**Your Budget Tracker is now production-ready! 🎉**

**Monitor regularly and keep your application updated for security and performance.**

