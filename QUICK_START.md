# Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Setup Database (2 minutes)

1. Open MySQL command line or MySQL Workbench
2. Copy the contents of `database/schema.sql`
3. Execute it to create the database and tables:
   ```sql
   SOURCE /path/to/database/schema.sql;
   ```

### Step 2: Setup Backend (2 minutes)

1. Open terminal and navigate to `backend` folder
   ```bash
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Update `.env` with your MySQL password

4. Start the server
   ```bash
   npm start
   ```

   You should see: `Insurance Policy Management API running on http://localhost:3000`

### Step 3: Open Frontend (1 minute)

1. Open `frontend/index.html` in your web browser
2. Or run a local server:
   ```bash
   cd frontend
   python -m http.server 8000
   ```
3. Navigate to `http://localhost:8000`

### Step 4: Login

Use these test credentials:
- Email: `john@example.com`
- Password: `password`

**Note:** For the sample user to work, you need to update the password hash in the database. See Password Hash section below.

## 🔑 Creating Valid Test Credentials

The sample data uses placeholder password hashes. To create a working user:

### Option 1: Using Node.js

```javascript
const bcrypt = require('bcryptjs');

// Run this in Node console
const password = 'password123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Then update the users table:
```sql
UPDATE users SET password = 'GENERATED_HASH_HERE' WHERE email = 'john@example.com';
```

### Option 2: Using MySQL CLI

```sql
-- Create new user with hashed password
INSERT INTO users (name, email, password, customer_id, status) 
VALUES ('Test User', 'test@example.com', '$2a$10$6xYQ3Yr5EB6hYP.Yk8V3K.m7UPDcEo4eI5.zN6z5E5E5E5E5E5', 'CUST999', 'Gold');
```

## 📊 Testing the API

### Using Postman

1. **Login Request:**
   ```
   POST http://localhost:3000/api/users/login
   Content-Type: application/json
   
   {
     "email": "john@example.com",
     "password": "password"
   }
   ```

2. **Copy the token** from response

3. **Get Policies:**
   ```
   GET http://localhost:3000/api/policies
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

### Using curl

```bash
# Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Get policies (replace TOKEN)
curl -X GET http://localhost:3000/api/policies \
  -H "Authorization: Bearer TOKEN"
```

## 🛠️ Frontend Features Walkthrough

1. **Login Page**
   - Clean login form with email/password
   - Form validation

2. **Dashboard**
   - Welcome card with user greeting
   - 4 quick stat cards showing policies, premium, etc.
   - Policy cards grid
   - Quick action buttons

3. **Policy Management**
   - View policy details in modal
   - See all policy information
   - Button to renew or add-on

4. **Payments**
   - Select policy and amount
   - Enter card details
   - Secure payment processing
   - Payment history view

5. **Bottom Navigation**
   - Home, Services, History, Help
   - Active state indication

## 📱 Testing on Mobile

1. Open browser DevTools (F12)
2. Click device icon for mobile view
3. Test on different screen sizes
4. All features should work on mobile

## 🔧 Customization

### Change Colors
Edit `frontend/styles.css`:
```css
:root {
    --primary-color: #2563eb;          /* Change this */
    --primary-dark: #1e40af;            /* Change this */
    --secondary-color: #10b981;         /* Change this */
}
```

### Change Company Name
1. `frontend/index.html` - Change "InsureHub" in logo
2. `frontend/script.js` - Update API_URL if needed

### Change Database Name
Update `backend/.env`:
```
DB_NAME=your_database_name
```

## ✅ Checklist

- [ ] MySQL installed and running
- [ ] Database created from schema.sql
- [ ] Backend dependencies installed
- [ ] .env file configured
- [ ] Backend server running on :3000
- [ ] Frontend opened in browser
- [ ] Successful login with test user
- [ ] Dashboard displaying policies
- [ ] Payment form working
- [ ] Payment history loading

## 🚀 Next Steps

After basic setup:

1. **Create real users** - Register new users through the frontend
2. **Add policies** - Use the API to add policies
3. **Make payments** - Test the payment system
4. **Customize UI** - Update colors, fonts, branding
5. **Deploy** - Push to production server

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `API_DOCUMENTATION.md` - API endpoints
- Backend console - Error messages
- Browser console (F12) - Frontend errors

## 🎉 You're All Set!

The application is now running. Start creating and managing insurance policies!
