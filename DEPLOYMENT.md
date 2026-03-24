# Deployment & Configuration Guide

## Production Deployment Checklist

### 1. Security Configuration

#### Environment Variables (.env)
```
PORT=3000
DB_HOST=your-production-db-host
DB_USER=production_user
DB_PASSWORD=STRONG_SECURE_PASSWORD
DB_NAME=insurance_db_prod
JWT_SECRET=VERY_LONG_RANDOM_STRING_AT_LEAST_32_CHARS
NODE_ENV=production

# Optional for production
CORS_ORIGIN=https://yourdomain.com
SESSION_SECRET=ANOTHER_RANDOM_STRING
LOG_LEVEL=info
```

#### Password Generation (Node.js)
```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

### 2. Database Setup

#### Create Production Database User
```sql
-- Create new user for production
CREATE USER 'insurance_prod'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';

-- Grant specific permissions (principle of least privilege)
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX ON insurance_db.* 
TO 'insurance_prod'@'localhost';

FLUSH PRIVILEGES;
```

#### Database Optimization
```sql
-- Enable query caching
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 256 * 1024 * 1024;

-- Increase max connections
SET GLOBAL max_connections = 1000;

-- Configure slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### 3. Node.js Application Setup

#### Update package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "NODE_ENV=production pm2 start server.js --name insurance-api",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

#### Install PM2 for Process Management
```bash
npm install -g pm2

# Start application
pm2 start server.js --name "insurance-api"

# Save PM2 configuration
pm2 save

# Enable startup on reboot
pm2 startup
```

### 4. Frontend Deployment

#### Build for Production
```bash
# Minify CSS and JS (optional, if using build tools)
# For now, files are production-ready

# Copy frontend files to web server
cp -r frontend/* /var/www/html/insurance-app/
```

#### Web Server Configuration (Nginx)

**Create `/etc/nginx/sites-available/insurance-app`:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (using Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    root /var/www/html/insurance-app;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|icon|woff|woff2|ttf|svg)$ {
        expires 31536000s;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/insurance-app /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 5. SSL/HTTPS Setup

#### Using Let's Encrypt
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 6. Logging and Monitoring

#### Application Logging
```javascript
// Add to server.js
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Log to file
const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });

app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}\n`;
    logFile.write(log);
    next();
});
```

#### Monitoring with PM2
```bash
# Monitoring dashboard
pm2 monit

# Log viewing
pm2 logs insurance-api

# Save logs to file
pm2 save
pm2 log insurance-api > /var/log/insurance-api.log
```

### 7. Database Backup

#### Automated Backup Script
Create `/opt/scripts/backup-db.sh`:
```bash
#!/bin/bash

BACKUP_DIR="/backups/insurance-db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="insurance_db"
DB_USER="insurance_prod"

mkdir -p $BACKUP_DIR

# Full backup
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP.sql.gz"
```

#### Schedule Cron Job
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /opt/scripts/backup-db.sh
```

### 8. Performance Optimization

#### Database Indexing
Already included in schema.sql, but verify:
```sql
SHOW INDEXES FROM users;
SHOW INDEXES FROM policies;
SHOW INDEXES FROM payments;
```

#### Connection Pooling
Already configured in `config/database.js`:
```javascript
const pool = mysql.createPool({
    connectionLimit: 10,  // Increase for high traffic
    queueLimit: 0,
    waitForConnections: true
});
```

#### Rate Limiting (Add to server.js)
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/', limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts
    skipSuccessfulRequests: true,
});

app.use('/api/users/login', authLimiter);
```

### 9. Email Configuration (Optional)

#### For Notifications
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send payment confirmation
async function sendPaymentEmail(userEmail, transactionId) {
    await transporter.sendMail({
        from: 'noreply@insurehub.com',
        to: userEmail,
        subject: 'Payment Confirmation',
        html: `<p>Your payment has been processed. Transaction ID: ${transactionId}</p>`
    });
}
```

### 10. Monitoring and Alerts

#### Health Check Script
```bash
#!/bin/bash

# Check API health
curl -f http://localhost:3000/api/health || {
    echo "API is down!" | mail -s "Alert: Insurance API Down" admin@yourdomain.com
    pm2 restart insurance-api
}

# Check database connection
mysql -u insurance_prod -p$DB_PASSWORD -e "SELECT 1;" insurance_db || {
    echo "Database is down!" | mail -s "Alert: Database Down" admin@yourdomain.com
}
```

Add to crontab for every 5 minutes:
```bash
*/5 * * * * /opt/scripts/health-check.sh
```

### 11. Deployment Steps

```bash
# 1. Build/prepare code
git clone <repo>
cd sepm_insure/backend
npm install --production

# 2. Setup environment
cp .env.example .env
# Edit .env with production values

# 3. Database
mysql -u root -p < ../database/schema.sql

# 4. Start application
pm2 start server.js --name "insurance-api"

# 5. Setup frontend
cp -r ../frontend /var/www/html/insurance-app

# 6. Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/insurance-app
sudo systemctl restart nginx

# 7. SSL/HTTPS
sudo certbot certonly --nginx -d yourdomain.com
```

### 12. Rollback Procedure

```bash
# If deployment fails, rollback to previous version
git revert HEAD^
npm install
pm2 restart insurance-api

# Rollback database (if schema changed)
mysql -u root -p insurance_db < backups/backup_before_deployment.sql
```

## Production Performance Tips

1. **Use CDN** for static assets
2. **Enable gzip compression** in Nginx
3. **Implement caching** (Redis for sessions)
4. **Use load balancer** for multiple instances
5. **Monitor CPU and memory** usage
6. **Set up alerts** for high resource usage
7. **Regular database maintenance** (OPTIMIZE TABLE)
8. **Keep dependencies updated** monthly
9. **Use environment-specific configs**
10. **Implement API documentation** (Swagger/OpenAPI)

## Security Hardening

1. ✅ Use HTTPS/SSL
2. ✅ Validate all inputs
3. ✅ Use parameterized queries
4. ✅ Hash passwords with bcrypt
5. ✅ Implement CSRF protection
6. ✅ Set secure headers
7. ✅ Rate limiting
8. ✅ Regular security updates
9. ✅ SQL injection prevention
10. ✅ XSS protection

---

**Last Updated:** March 2024
**Version:** 1.0.0
