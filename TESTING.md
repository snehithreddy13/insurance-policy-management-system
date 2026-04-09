<<<<<<< HEAD
# 🧪 Testing Guide

## Frontend Testing Checklist

### User Authentication
- [ ] Login form displays correctly
- [ ] Email field validation works
- [ ] Password field is masked
- [ ] Login button is functional
- [ ] Error messages display on invalid login
- [ ] Successful login redirects to dashboard
- [ ] Token is stored in localStorage
- [ ] Logout clears token and returns to login

### Dashboard Features
- [ ] Dashboard displays after login
- [ ] Welcome message shows correct user name
- [ ] Status badge displays (Gold/Silver/etc.)
- [ ] Notification bell shows (with badge count)
- [ ] Profile dropdown menu appears on hover
- [ ] Logout button works in dropdown

### Statistics Section
- [ ] 4 stat cards display correctly
- [ ] "My Policies" count is accurate
- [ ] "Premium Due" amount calculates correctly
- [ ] "Pay Now" button opens payment modal
- [ ] "Active Policies" count is correct

### Policies Section
- [ ] All user policies display as cards
- [ ] Policy name, sum assured, premium visible
- [ ] Due date displays in correct format
- [ ] Status badge shows with correct color
- [ ] "View Details" button opens modal
- [ ] "Renew" button shows appropriate message
- [ ] Cards are responsive on mobile
- [ ] No policies message shows when empty

### Policy Details Modal
- [ ] Modal opens when viewing details
- [ ] All policy information displays
- [ ] Close button (X) works
- [ ] "Buy Add-on" button shows message
- [ ] Modal closes on outside click

### Payment Features
- [ ] "Pay Now" button opens payment modal
- [ ] Policy dropdown populates from user policies
- [ ] Amount field auto-fills on policy selection
- [ ] Card number formats with spaces (XXXX XXXX XXXX XXXX)
- [ ] Expiry field formats as MM/YY
- [ ] CVV accepts only 3 digits
- [ ] Submit button processes payment
- [ ] Success message displays
- [ ] Payment history loads correctly

### Payment History Modal
- [ ] Opens from "History" section or nav
- [ ] All payments display in list
- [ ] Payment date formats correctly
- [ ] Amounts display correctly
- [ ] No history message shows when empty
- [ ] Close button works

### Quick Actions Section
- [ ] All 4 action cards display
- [ ] Icons appear correctly
- [ ] Buttons are clickable
- [ ] "Download" shows appropriate message
- [ ] "Calculate" opens calculator prompt
- [ ] "Contact" shows contact information
- [ ] "History" opens payment history modal

### Bottom Navigation
- [ ] All 4 nav items display
- [ ] Active item is highlighted
- [ ] "Home" shows main dashboard
- [ ] "Services" shows message
- [ ] "History" opens payment history
- [ ] "Help" shows help information
- [ ] Navigation switches active state

### Responsive Design
#### Desktop (1200px+)
- [ ] All elements display properly
- [ ] 4 stat cards in one row
- [ ] Policy cards in 2-3 columns
- [ ] Action cards in 4 columns
- [ ] No overflow or wrapping issues

#### Tablet (768px - 1199px)
- [ ] Layout reorganizes
- [ ] 2 stat cards per row
- [ ] Policy cards stack appropriately
- [ ] Action cards in 2 columns
- [ ] No horizontal scroll

#### Mobile (480px - 767px)
- [ ] 1 stat card per row
- [ ] Policy cards single column
- [ ] Action cards in 2 columns
- [ ] Bottom nav visible and usable
- [ ] Text readable without zoom

#### Small Mobile (< 480px)
- [ ] Layout remains usable
- [ ] All buttons clickable
- [ ] No content cutoff
- [ ] Text scales appropriately

### Form Validation
- [ ] Email field requires @ symbol
- [ ] Password field is required
- [ ] Card number validates (16 digits)
- [ ] Expiry date validates (MM/YY)
- [ ] CVV validates (3 digits)
- [ ] Amount field requires positive number
- [ ] No form submission with empty required fields

### UI/UX Elements
- [ ] Hover effects work on buttons
- [ ] Smooth transitions between pages
- [ ] Loading states (if implemented)
- [ ] Error messages are clear
- [ ] Success messages are clear
- [ ] Modal overlays are visible
- [ ] Dropdowns close properly

---

## Backend Testing Checklist

### Server Setup
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Port 3000 is accessible
- [ ] Environment variables load correctly

### Database Connection
- [ ] MySQL connection establishes
- [ ] Connection pool works
- [ ] Queries execute successfully
- [ ] Connection errors are handled

### User Endpoints

#### POST /users/login
- [ ] Valid credentials return token
- [ ] Invalid email returns 401
- [ ] Invalid password returns 401
- [ ] Missing fields return 400
- [ ] Token is JWT format
- [ ] Token contains user info

#### POST /users/register
- [ ] New user can register
- [ ] Passwords are hashed
- [ ] Duplicate email returns error
- [ ] Customer ID is unique
- [ ] Default status is "Silver"
- [ ] All fields are required

#### GET /users/profile
- [ ] Returns user profile with valid token
- [ ] Returns 401 without token
- [ ] Returns 401 with invalid token
- [ ] Returns correct user data

#### PUT /users/profile
- [ ] Updates name successfully
- [ ] Updates status successfully
- [ ] Updates both fields
- [ ] Returns updated data
- [ ] Requires authentication

### Policy Endpoints

#### GET /policies
- [ ] Returns all user policies
- [ ] Returns empty array if no policies
- [ ] Does not return other users' policies
- [ ] Returns correct data structure
- [ ] Requires authentication

#### POST /policies
- [ ] Creates new policy
- [ ] Associates with current user
- [ ] Returns 400 if missing fields
- [ ] Returns created policy data
- [ ] Requires authentication

#### GET /policies/:id
- [ ] Returns specific policy
- [ ] Returns 404 if policy not found
- [ ] Returns 404 for other users' policies
- [ ] Returns correct data
- [ ] Requires authentication

#### PUT /policies/:id
- [ ] Updates policy fields
- [ ] Returns updated data
- [ ] Returns 404 if policy not found
- [ ] Requires authentication

#### DELETE /policies/:id
- [ ] Deletes policy successfully
- [ ] Returns 404 if not found
- [ ] Prevents deletion of other users' policies
- [ ] Requires authentication

#### GET /policies/stats
- [ ] Returns correct total count
- [ ] Returns correct active count
- [ ] Calculates total premium
- [ ] Returns all statistics

### Payment Endpoints

#### POST /payments
- [ ] Creates payment record
- [ ] Generates transaction ID
- [ ] Validates card details
- [ ] Associates with policy
- [ ] Prevents payment for other users' policies
- [ ] Returns 400 for invalid card
- [ ] Sets status to "Success"
- [ ] Requires authentication

#### GET /payments
- [ ] Returns all user payments
- [ ] Does not return other users' payments
- [ ] Returns empty array if none
- [ ] Requires authentication

#### GET /payments/:id
- [ ] Returns specific payment
- [ ] Returns 404 if not found
- [ ] Prevents access to other users' payments
- [ ] Requires authentication

#### PUT /payments/:id
- [ ] Updates payment status
- [ ] Returns updated payment
- [ ] Returns 404 if not found
- [ ] Requires authentication

#### GET /payments/stats
- [ ] Returns total payments count
- [ ] Returns successful payments count
- [ ] Returns pending payments count
- [ ] Calculates total amount paid
- [ ] Requires authentication

### Error Handling
- [ ] 400 errors for bad requests
- [ ] 401 errors for authentication failures
- [ ] 404 errors for not found
- [ ] 500 errors for server issues
- [ ] Error messages are meaningful
- [ ] Stack traces not exposed in production

### Security
- [ ] Passwords are hashed (bcrypt)
- [ ] Tokens expire after 7 days
- [ ] CORS is enabled
- [ ] SQL injection is prevented
- [ ] User data is isolated
- [ ] Invalid tokens are rejected

---

## Database Testing Checklist

### Schema
- [ ] All tables created successfully
- [ ] All columns have correct types
- [ ] Primary keys are set
- [ ] Foreign keys are enforced
- [ ] Indexes are created
- [ ] Default values work

### Users Table
- [ ] Can insert new user
- [ ] Email is unique
- [ ] Customer ID is unique
- [ ] Status defaults to "Silver"
- [ ] Timestamps update automatically
- [ ] Password is hashed

### Policies Table
- [ ] Can insert new policy
- [ ] Foreign key constraint works
- [ ] Status defaults to "Active"
- [ ] Cascade delete works (user deletion removes policies)
- [ ] Timestamps work
- [ ] Decimal fields store correctly

### Payments Table
- [ ] Can insert new payment
- [ ] Foreign key constraint works
- [ ] Status defaults to "Pending"
- [ ] Transaction ID is unique
- [ ] Payment date defaults to now
- [ ] Cascade delete works (policy deletion removes payments)

### Sample Data
- [ ] Sample users exist
- [ ] Sample policies exist
- [ ] Sample payments exist
- [ ] Relationships are correct

### Views
- [ ] user_policy_summary view works
- [ ] payment_summary view works
- [ ] Aggregations are correct

---

## API Testing with Curl

### 1. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Take the token from response
TOKEN="your_token_here"
```

### 2. Get Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get All Policies
```bash
curl -X GET http://localhost:3000/api/policies \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get Policy Stats
```bash
curl -X GET http://localhost:3000/api/policies/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Create Policy
```bash
curl -X POST http://localhost:3000/api/policies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "policy_name": "Test Policy",
    "sum_assured": 500000,
    "premium": 5000,
    "due_date": "2025-12-31",
    "status": "Active"
  }'
```

### 6. Create Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "policy_id": 1,
    "amount": 5000,
    "payment_method": "card",
    "card_name": "John Doe",
    "card_number": "1234567890123456",
    "expiry": "12/26",
    "cvv": "123"
  }'
```

### 7. Get All Payments
```bash
curl -X GET http://localhost:3000/api/payments \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get Payment Stats
```bash
curl -X GET http://localhost:3000/api/payments/stats \
  -H "Authorization: Bearer $TOKEN"
```

---

## Performance Testing

### Load Testing
```bash
# Using Apache Bench (if installed)
ab -n 1000 -c 10 http://localhost:3000/api/health

# Using wrk (if installed)
wrk -t12 -c400 -d30s http://localhost:3000/api/policies
```

### Database Query Performance
```sql
-- Check query execution time
EXPLAIN ANALYZE SELECT * FROM policies WHERE user_id = 1;

-- Check indexes are being used
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Check slow queries
SELECT * FROM mysql.slow_log;
```

### Memory Usage
```bash
# Check Node.js memory
ps aux | grep node

# Monitor in real-time
pm2 monit
```

---

## Manual Testing Flows

### Complete User Journey

1. **Registration**
   - Open login page
   - Click "Sign up"
   - Fill registration form
   - Submit
   - Verify account created

2. **Login**
   - Enter email and password
   - Click login
   - Verify dashboard appears
   - Check user name displays

3. **View Policies**
   - Dashboard should show policies
   - Click "View Details" on a policy
   - Modal should show full details
   - Close modal

4. **Make Payment**
   - Click "Pay Now" button
   - Select policy
   - Enter amount
   - Fill card details
   - Submit payment
   - Verify success message
   - Check payment history

5. **Logout**
   - Click profile menu
   - Click logout
   - Verify return to login page

### Error Scenarios

1. **Invalid Login**
   - Enter wrong password
   - Verify error message
   - Try with non-existent email
   - Verify error message

2. **Invalid Payment**
   - Try with invalid card
   - Try with invalid CVV
   - Try with amount 0
   - Verify validation messages

3. **Missing Data**
   - Try submitting empty form
   - Verify required field validation

---

## Browser Compatibility Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Checklist Summary

- **Frontend Tests**: 60+ checks
- **Backend Tests**: 40+ checks
- **Database Tests**: 25+ checks
- **Total Test Cases**: 125+

**All tests should pass before production deployment!**

---

**Last Updated**: March 2024
=======
# 🧪 Testing Guide

## Frontend Testing Checklist

### User Authentication
- [ ] Login form displays correctly
- [ ] Email field validation works
- [ ] Password field is masked
- [ ] Login button is functional
- [ ] Error messages display on invalid login
- [ ] Successful login redirects to dashboard
- [ ] Token is stored in localStorage
- [ ] Logout clears token and returns to login

### Dashboard Features
- [ ] Dashboard displays after login
- [ ] Welcome message shows correct user name
- [ ] Status badge displays (Gold/Silver/etc.)
- [ ] Notification bell shows (with badge count)
- [ ] Profile dropdown menu appears on hover
- [ ] Logout button works in dropdown

### Statistics Section
- [ ] 4 stat cards display correctly
- [ ] "My Policies" count is accurate
- [ ] "Premium Due" amount calculates correctly
- [ ] "Pay Now" button opens payment modal
- [ ] "Active Policies" count is correct

### Policies Section
- [ ] All user policies display as cards
- [ ] Policy name, sum assured, premium visible
- [ ] Due date displays in correct format
- [ ] Status badge shows with correct color
- [ ] "View Details" button opens modal
- [ ] "Renew" button shows appropriate message
- [ ] Cards are responsive on mobile
- [ ] No policies message shows when empty

### Policy Details Modal
- [ ] Modal opens when viewing details
- [ ] All policy information displays
- [ ] Close button (X) works
- [ ] "Buy Add-on" button shows message
- [ ] Modal closes on outside click

### Payment Features
- [ ] "Pay Now" button opens payment modal
- [ ] Policy dropdown populates from user policies
- [ ] Amount field auto-fills on policy selection
- [ ] Card number formats with spaces (XXXX XXXX XXXX XXXX)
- [ ] Expiry field formats as MM/YY
- [ ] CVV accepts only 3 digits
- [ ] Submit button processes payment
- [ ] Success message displays
- [ ] Payment history loads correctly

### Payment History Modal
- [ ] Opens from "History" section or nav
- [ ] All payments display in list
- [ ] Payment date formats correctly
- [ ] Amounts display correctly
- [ ] No history message shows when empty
- [ ] Close button works

### Quick Actions Section
- [ ] All 4 action cards display
- [ ] Icons appear correctly
- [ ] Buttons are clickable
- [ ] "Download" shows appropriate message
- [ ] "Calculate" opens calculator prompt
- [ ] "Contact" shows contact information
- [ ] "History" opens payment history modal

### Bottom Navigation
- [ ] All 4 nav items display
- [ ] Active item is highlighted
- [ ] "Home" shows main dashboard
- [ ] "Services" shows message
- [ ] "History" opens payment history
- [ ] "Help" shows help information
- [ ] Navigation switches active state

### Responsive Design
#### Desktop (1200px+)
- [ ] All elements display properly
- [ ] 4 stat cards in one row
- [ ] Policy cards in 2-3 columns
- [ ] Action cards in 4 columns
- [ ] No overflow or wrapping issues

#### Tablet (768px - 1199px)
- [ ] Layout reorganizes
- [ ] 2 stat cards per row
- [ ] Policy cards stack appropriately
- [ ] Action cards in 2 columns
- [ ] No horizontal scroll

#### Mobile (480px - 767px)
- [ ] 1 stat card per row
- [ ] Policy cards single column
- [ ] Action cards in 2 columns
- [ ] Bottom nav visible and usable
- [ ] Text readable without zoom

#### Small Mobile (< 480px)
- [ ] Layout remains usable
- [ ] All buttons clickable
- [ ] No content cutoff
- [ ] Text scales appropriately

### Form Validation
- [ ] Email field requires @ symbol
- [ ] Password field is required
- [ ] Card number validates (16 digits)
- [ ] Expiry date validates (MM/YY)
- [ ] CVV validates (3 digits)
- [ ] Amount field requires positive number
- [ ] No form submission with empty required fields

### UI/UX Elements
- [ ] Hover effects work on buttons
- [ ] Smooth transitions between pages
- [ ] Loading states (if implemented)
- [ ] Error messages are clear
- [ ] Success messages are clear
- [ ] Modal overlays are visible
- [ ] Dropdowns close properly

---

## Backend Testing Checklist

### Server Setup
- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Port 3000 is accessible
- [ ] Environment variables load correctly

### Database Connection
- [ ] MySQL connection establishes
- [ ] Connection pool works
- [ ] Queries execute successfully
- [ ] Connection errors are handled

### User Endpoints

#### POST /users/login
- [ ] Valid credentials return token
- [ ] Invalid email returns 401
- [ ] Invalid password returns 401
- [ ] Missing fields return 400
- [ ] Token is JWT format
- [ ] Token contains user info

#### POST /users/register
- [ ] New user can register
- [ ] Passwords are hashed
- [ ] Duplicate email returns error
- [ ] Customer ID is unique
- [ ] Default status is "Silver"
- [ ] All fields are required

#### GET /users/profile
- [ ] Returns user profile with valid token
- [ ] Returns 401 without token
- [ ] Returns 401 with invalid token
- [ ] Returns correct user data

#### PUT /users/profile
- [ ] Updates name successfully
- [ ] Updates status successfully
- [ ] Updates both fields
- [ ] Returns updated data
- [ ] Requires authentication

### Policy Endpoints

#### GET /policies
- [ ] Returns all user policies
- [ ] Returns empty array if no policies
- [ ] Does not return other users' policies
- [ ] Returns correct data structure
- [ ] Requires authentication

#### POST /policies
- [ ] Creates new policy
- [ ] Associates with current user
- [ ] Returns 400 if missing fields
- [ ] Returns created policy data
- [ ] Requires authentication

#### GET /policies/:id
- [ ] Returns specific policy
- [ ] Returns 404 if policy not found
- [ ] Returns 404 for other users' policies
- [ ] Returns correct data
- [ ] Requires authentication

#### PUT /policies/:id
- [ ] Updates policy fields
- [ ] Returns updated data
- [ ] Returns 404 if policy not found
- [ ] Requires authentication

#### DELETE /policies/:id
- [ ] Deletes policy successfully
- [ ] Returns 404 if not found
- [ ] Prevents deletion of other users' policies
- [ ] Requires authentication

#### GET /policies/stats
- [ ] Returns correct total count
- [ ] Returns correct active count
- [ ] Calculates total premium
- [ ] Returns all statistics

### Payment Endpoints

#### POST /payments
- [ ] Creates payment record
- [ ] Generates transaction ID
- [ ] Validates card details
- [ ] Associates with policy
- [ ] Prevents payment for other users' policies
- [ ] Returns 400 for invalid card
- [ ] Sets status to "Success"
- [ ] Requires authentication

#### GET /payments
- [ ] Returns all user payments
- [ ] Does not return other users' payments
- [ ] Returns empty array if none
- [ ] Requires authentication

#### GET /payments/:id
- [ ] Returns specific payment
- [ ] Returns 404 if not found
- [ ] Prevents access to other users' payments
- [ ] Requires authentication

#### PUT /payments/:id
- [ ] Updates payment status
- [ ] Returns updated payment
- [ ] Returns 404 if not found
- [ ] Requires authentication

#### GET /payments/stats
- [ ] Returns total payments count
- [ ] Returns successful payments count
- [ ] Returns pending payments count
- [ ] Calculates total amount paid
- [ ] Requires authentication

### Error Handling
- [ ] 400 errors for bad requests
- [ ] 401 errors for authentication failures
- [ ] 404 errors for not found
- [ ] 500 errors for server issues
- [ ] Error messages are meaningful
- [ ] Stack traces not exposed in production

### Security
- [ ] Passwords are hashed (bcrypt)
- [ ] Tokens expire after 7 days
- [ ] CORS is enabled
- [ ] SQL injection is prevented
- [ ] User data is isolated
- [ ] Invalid tokens are rejected

---

## Database Testing Checklist

### Schema
- [ ] All tables created successfully
- [ ] All columns have correct types
- [ ] Primary keys are set
- [ ] Foreign keys are enforced
- [ ] Indexes are created
- [ ] Default values work

### Users Table
- [ ] Can insert new user
- [ ] Email is unique
- [ ] Customer ID is unique
- [ ] Status defaults to "Silver"
- [ ] Timestamps update automatically
- [ ] Password is hashed

### Policies Table
- [ ] Can insert new policy
- [ ] Foreign key constraint works
- [ ] Status defaults to "Active"
- [ ] Cascade delete works (user deletion removes policies)
- [ ] Timestamps work
- [ ] Decimal fields store correctly

### Payments Table
- [ ] Can insert new payment
- [ ] Foreign key constraint works
- [ ] Status defaults to "Pending"
- [ ] Transaction ID is unique
- [ ] Payment date defaults to now
- [ ] Cascade delete works (policy deletion removes payments)

### Sample Data
- [ ] Sample users exist
- [ ] Sample policies exist
- [ ] Sample payments exist
- [ ] Relationships are correct

### Views
- [ ] user_policy_summary view works
- [ ] payment_summary view works
- [ ] Aggregations are correct

---

## API Testing with Curl

### 1. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'

# Take the token from response
TOKEN="your_token_here"
```

### 2. Get Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get All Policies
```bash
curl -X GET http://localhost:3000/api/policies \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Get Policy Stats
```bash
curl -X GET http://localhost:3000/api/policies/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Create Policy
```bash
curl -X POST http://localhost:3000/api/policies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "policy_name": "Test Policy",
    "sum_assured": 500000,
    "premium": 5000,
    "due_date": "2025-12-31",
    "status": "Active"
  }'
```

### 6. Create Payment
```bash
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "policy_id": 1,
    "amount": 5000,
    "payment_method": "card",
    "card_name": "John Doe",
    "card_number": "1234567890123456",
    "expiry": "12/26",
    "cvv": "123"
  }'
```

### 7. Get All Payments
```bash
curl -X GET http://localhost:3000/api/payments \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get Payment Stats
```bash
curl -X GET http://localhost:3000/api/payments/stats \
  -H "Authorization: Bearer $TOKEN"
```

---

## Performance Testing

### Load Testing
```bash
# Using Apache Bench (if installed)
ab -n 1000 -c 10 http://localhost:3000/api/health

# Using wrk (if installed)
wrk -t12 -c400 -d30s http://localhost:3000/api/policies
```

### Database Query Performance
```sql
-- Check query execution time
EXPLAIN ANALYZE SELECT * FROM policies WHERE user_id = 1;

-- Check indexes are being used
EXPLAIN SELECT * FROM users WHERE email = 'john@example.com';

-- Check slow queries
SELECT * FROM mysql.slow_log;
```

### Memory Usage
```bash
# Check Node.js memory
ps aux | grep node

# Monitor in real-time
pm2 monit
```

---

## Manual Testing Flows

### Complete User Journey

1. **Registration**
   - Open login page
   - Click "Sign up"
   - Fill registration form
   - Submit
   - Verify account created

2. **Login**
   - Enter email and password
   - Click login
   - Verify dashboard appears
   - Check user name displays

3. **View Policies**
   - Dashboard should show policies
   - Click "View Details" on a policy
   - Modal should show full details
   - Close modal

4. **Make Payment**
   - Click "Pay Now" button
   - Select policy
   - Enter amount
   - Fill card details
   - Submit payment
   - Verify success message
   - Check payment history

5. **Logout**
   - Click profile menu
   - Click logout
   - Verify return to login page

### Error Scenarios

1. **Invalid Login**
   - Enter wrong password
   - Verify error message
   - Try with non-existent email
   - Verify error message

2. **Invalid Payment**
   - Try with invalid card
   - Try with invalid CVV
   - Try with amount 0
   - Verify validation messages

3. **Missing Data**
   - Try submitting empty form
   - Verify required field validation

---

## Browser Compatibility Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Checklist Summary

- **Frontend Tests**: 60+ checks
- **Backend Tests**: 40+ checks
- **Database Tests**: 25+ checks
- **Total Test Cases**: 125+

**All tests should pass before production deployment!**

---

**Last Updated**: March 2024
>>>>>>> d9c3d0f (Updated new details in project)
