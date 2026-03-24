# 🔧 Troubleshooting Guide

## Database Issues

### MySQL Connection Error
**Error**: `connect ECONNREFUSED 127.0.0.1:3306`

**Solutions**:
1. Check MySQL is running
   ```bash
   # Windows
   mysql -u root -p
   
   # If error, start MySQL
   net start MySQL80  # or MySQL57 depending on version
   ```

2. Verify .env credentials
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_actual_password
   ```

3. Test connection
   ```bash
   mysql -h localhost -u root -p -e "SELECT 1;"
   ```

---

### Database Not Found
**Error**: `Error: ER_BAD_DB_ERROR: Unknown database 'insurance_db'`

**Solutions**:
1. Create database from schema
   ```bash
   cd database
   mysql -u root -p < schema.sql
   ```

2. Verify database exists
   ```sql
   SHOW DATABASES;
   USE insurance_db;
   SHOW TABLES;
   ```

3. Check schema.sql executed completely
   - No errors when running the file
   - All 3 tables exist (users, policies, payments)

---

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::3000`

**Solutions**:
1. Find and kill process using port 3000
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <process_id> /F
   
   # Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   ```

2. Change port in .env
   ```
   PORT=3001
   ```

3. Update frontend API URL in script.js (if port changed)

---

## Backend Issues

### npm Dependencies Error
**Error**: `npm ERR! code ERESOLVE`

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Or update npm
npm install -g npm@latest
```

---

### Missing .env File
**Error**: `Cannot find module '.env'` or environment variables undefined

**Solutions**:
1. Create .env file in backend directory
   ```bash
   cd backend
   copy .env  (or create blank file)
   ```

2. Add required variables
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=insurance_db
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

3. Save and restart server

---

### JWT Secret Not Set
**Error**: `Error: Server error` when logging in

**Solutions**:
1. Check .env has JWT_SECRET
   ```bash
   # Not this:
   JWT_SECRET=
   
   # Use this:
   JWT_SECRET=your_super_secret_key_at_least_32_chars
   ```

2. Generate secure secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Paste into .env and restart

---

### Server Crashes on Startup
**Error**: `Cannot read property '...' of undefined`

**Solutions**:
1. Check all environment variables are set
   ```bash
   node -e "require('dotenv').config(); console.log(process.env)"
   ```

2. Verify database connection
   ```bash
   mysql -u root -p insurance_db -e "SHOW TABLES;"
   ```

3. Check file paths are correct
   - All require() paths match actual files

4. Look at error stack trace for exact issue

---

## Frontend Issues

### Blank White Page
**Possible Causes**:
1. JavaScript error
   - Open DevTools (F12)
   - Check Console tab for errors

2. CSS not loading
   - Check Network tab
   - Verify styles.css file exists
   - Check file path in index.html

3. HTML structure broken
   - View page source (Ctrl+U)
   - Check for missing closing tags

---

### API Not Responding (CORS Error)
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:
1. Ensure backend is running
   ```bash
   # Test in browser
   http://localhost:3000/api/health
   ```

2. CORS already enabled in server.js
   - If error persists, check Express app.use(cors()) is first

3. Check API URL in script.js
   ```javascript
   const API_URL = 'http://localhost:3000/api';
   ```

4. If backend on different server, update CORS
   ```javascript
   app.use(cors({
       origin: 'your-frontend-url'
   }));
   ```

---

### Login Not Working
**Error**: `401 Unauthorized` or `Invalid email or password`

**Solutions**:
1. Verify user exists in database
   ```sql
   SELECT * FROM users WHERE email = 'john@example.com';
   ```

2. For sample data, password hash is invalid
   - Either create new user via register endpoint
   - Or hash a password with bcrypt and update database

3. Clear browser data
   - Open DevTools
   - Application > Clear Storage > Clear All
   - Reload page

4. Check server logs for error message

---

### Policies Not Loading
**Error**: `No policies found` or blank screen

**Solutions**:
1. Check user is logged in
   - Check localStorage has 'authToken'
   - verify token is valid

2. Verify policies exist for user
   ```sql
   SELECT * FROM policies WHERE user_id = 1;
   ```

3. Check browser console for API errors
   - F12 > Console tab
   - Look for failed fetch requests

4. Check token is being sent
   - Network tab > Find /api/policies request
   - Check Authorization header includes token

---

### Payment Not Processing
**Error**: `Payment failed` or no success message

**Solutions**:
1. Check payment form validation
   - Card number: 16 digits
   - Expiry: MM/YY format
   - CVV: 3 digits

2. Verify policy is selected
   - dropdown shouldn't be empty

3. Check amount is entered and > 0

4. Look at network request
   - F12 > Network
   - Find /api/payments POST request
   - Check request body and response

---

### Modal Not Opening
**Error**: Click button but nothing happens

**Solutions**:
1. Check JavaScript is loaded
   - F12 > Console
   - Type: `typeof openPaymentModal`
   - Should return 'function'

2. Check console for errors
   - Any red errors?
   - Fix syntax errors in script.js

3. Verify modal HTML exists in index.html
   - Search for `<div id="paymentModal"`
   - Should be present

4. Reload page (Ctrl+F5) to clear cache

---

## Mobile Testing Issues

### Responsive Design Not Working
**Solutions**:
1. Ensure viewport meta tag exists
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. Test with DevTools device simulator
   - F12 > Device icon (top left)
   - Select different devices

3. Check CSS media queries
   - Should have breakpoints at 768px and 480px

4. Clear browser cache
   - F12 > Network tab > Disable cache checkbox

---

### Touch Events Not Working
**Solutions**:
1. Check buttons have click handlers
   ```html
   <button onclick="functionName()">Click</button>
   ```

2. Verify mobile CSS doesn't hide elements
   - Check display: none on mobile breakpoints

3. Test with actual mobile device
   - Use same network as development machine
   - Access: http://your-ip-address:8000

---

## Performance Issues

### Page Loading Slowly
**Solutions**:
1. Check network tab
   - Large images? Compress them
   - Many requests? Combine files

2. Check script size
   - script.js or styles.css very large?
   - Remove unused code

3. Database query optimization
   - Check for N+1 queries
   - Verify indexes exist

4. Use browser DevTools Performance tab
   - Record page load
   - Identify slow operations

---

### High Memory Usage
**Solutions**:
1. Check for memory leaks
   - DevTools > Memory tab > Take heap snapshot
   - Look for detached DOM nodes

2. Monitor Node.js memory
   ```bash
   # In task manager (Windows)
   # Or: ps aux | grep node (Linux)
   ```

3. Check for infinite loops
   - Review JavaScript timers
   - Check for recursive functions

---

## Security Issues

### Token Expiring Too Quickly
**Solutions**:
1. Extend token expiration
   ```javascript
   // In userController.js
   jwt.sign({...}, secret, { expiresIn: '30d' })
   ```

2. Implement token refresh
   - Add refresh token logic

---

### Password Hash Not Working
**Solutions**:
1. Verify bcryptjs installed
   ```bash
   npm list bcryptjs
   ```

2. Test hashing
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = bcrypt.hashSync('password', 10);
   console.log(hash);
   ```

3. Update database with valid hash
   ```sql
   UPDATE users SET password = '$2a$10$...' WHERE id = 1;
   ```

---

## Deployment Issues

### 502 Bad Gateway
**Solutions**:
1. Check backend is running
   ```bash
   pm2 status
   ```

2. Check logs
   ```bash
   pm2 logs
   ```

3. Verify port is listening
   ```bash
   netstat -tlnp | grep 3000
   ```

---

### SSL Certificate Error
**Solutions**:
1. Install valid certificate
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com
   ```

2. Configure in Nginx
   ```nginx
   ssl_certificate /path/to/cert.pem;
   ssl_certificate_key /path/to/key.pem;
   ```

---

### Database Connection Timeout in Production
**Solutions**:
1. Increase connection pool
   ```javascript
   connectionLimit: 20  // increase from default
   ```

2. Set appropriate timeouts
   ```javascript
   waitForConnections: true,
   queueLimit: 0
   ```

3. Use connection pooling library
   ```bash
   npm install mysql2/promise
   ```

---

## Getting Help

### Debug Information to Gather
1. **Browser Console (F12)**
   - Copy all error messages
   - Check Network tab

2. **Server Console**
   - What errors or messages appear?
   - At what point does it fail?

3. **Database Status**
   ```sql
   SELECT VERSION();
   SHOW TABLES;
   DESC users;
   ```

4. **System Info**
   - Node version: `node --version`
   - npm version: `npm --version`
   - MySQL version: `mysql --version`

### Create Minimal Reproducible Example
1. Narrow down the issue
2. What exactly fails?
3. What steps lead to failure?
4. Can you recreate it consistently?

### Search for Solutions
1. Check error message in documentation
2. Search Reddit/Stack Overflow
3. Check Node.js/Express docs
4. Review MySQL docs

---

## Quick Fixes (Copy & Paste)

### Restart Everything
```bash
# Stop backend
Ctrl+C

# Stop MySQL
net stop MySQL80

# Start MySQL
net start MySQL80

# Start backend
npm start
```

### Reset Database
```bash
mysql -u root -p insurance_db < database/schema.sql
```

### Clear Browser Cache
- DevTools (F12) > Application > Clear Storage > Clear All
- Or: Ctrl+Shift+Delete

### Regenerate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

**Last Updated**: March 2024
**Version**: 1.0.0
