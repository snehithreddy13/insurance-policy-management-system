# Insurance Policy Management Web Application

A modern, responsive web application for managing insurance policies with a clean dashboard UI, built with Node.js, Express, and MySQL.

## 📋 Features

### User Management
- User login and authentication system
- JWT-based token authentication
- User profiles with membership status (Silver, Gold, Platinum, Verified)
- Secure password hashing with bcryptjs

### Dashboard
- Welcome section with user greeting
- Quick statistics cards (My Policies, Premium Due, Online Payment, Active Policies)
- User profile section with status badges
- Notification icon with badge

### Policy Management
- View all active and inactive policies
- Detailed policy information (Policy name, Sum Assured, Premium, Due Date, Status)
- Create new policies
- Update policy information
- Delete policies
- Policy filtering and sorting

### Payment Module
- Online premium payment
- Payment history tracking
- Multiple payment methods support
- Transaction ID generation
- Payment status tracking (Pending, Success, Failed)

### Quick Actions
- Download policy statements
- Premium calculator
- Contact agent
- View payment history

### User Experience
- Modern gradient header (Blue theme)
- Card-based layout with icons
- Rounded corners and soft shadows
- Mobile responsive design
- Bottom navigation bar
- Smooth transitions and animations

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (Grid, Flexbox, Gradients, Animations)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MySQL 5.7+
- JSON Web Tokens (JWT)
- bcryptjs for password hashing

### Database
- MySQL relational database
- Prepared statements for security
- Views for complex queries

## 📁 Project Structure

```
sepm insure/
├── frontend/
│   ├── index.html         # Main HTML file with modals
│   ├── styles.css         # Complete styling with responsive design
│   └── script.js          # Frontend logic and API integration
├── backend/
│   ├── server.js          # Express server entry point
│   ├── package.json       # Node dependencies
│   ├── .env               # Environment variables
│   ├── config/
│   │   └── database.js    # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js        # JWT authentication middleware
│   ├── controllers/
│   │   ├── userController.js      # User operations
│   │   ├── policyController.js    # Policy operations
│   │   └── paymentController.js   # Payment operations
│   └── routes/
│       ├── userRoutes.js          # User endpoints
│       ├── policyRoutes.js        # Policy endpoints
│       └── paymentRoutes.js       # Payment endpoints
└── database/
    └── schema.sql         # MySQL database schema and sample data
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Edit `.env` file with your database credentials:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=insurance_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   NODE_ENV=development
   ```

4. **Create database and tables:**
   ```bash
   mysql -u root -p < ../database/schema.sql
   ```
   When prompted, enter your MySQL password.

5. **Start the backend server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The API should now be running at `http://localhost:3000`

### Frontend Setup

1. **Open the frontend in a browser:**
   - Simply open `frontend/index.html` in your web browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js
     npx http-server frontend
     ```

2. **Access the application:**
   Navigate to `http://localhost:8000` (or your configured port)

## 🔐 Default Test Credentials

After running the schema.sql, you can login with:

**User 1:**
- Email: `john@example.com`
- Password: `password` (Note: Update hash in database for proper testing)

**User 2:**
- Email: `jane@example.com`
- Password: `password`

**User 3:**
- Email: `mike@example.com`
- Password: `password`

*Note: The sample data uses hashed passwords. Replace the hash with actual bcryptjs hashed passwords for real usage.*

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `name`: User full name
- `email`: User email (unique)
- `password`: Hashed password
- `customer_id`: Unique customer ID
- `status`: Membership status (Silver, Gold, Platinum, Verified)
- `created_at`, `updated_at`: Timestamps

### Policies Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `policy_name`: Name of the policy
- `sum_assured`: Coverage amount
- `premium`: Premium amount
- `due_date`: Premium due date
- `status`: Policy status (Active, Inactive, Pending, Expired)
- Timestamps and indexes for optimization

### Payments Table
- `id`: Primary key
- `policy_id`: Foreign key to policies
- `amount`: Payment amount
- `payment_date`: Date of payment
- `status`: Payment status (Pending, Success, Failed, Cancelled)
- `transaction_id`: Unique transaction identifier
- `payment_method`: Payment method (card, bank_transfer, cheque)
- Timestamps and indexes

## 🔌 API Endpoints

### User Endpoints
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Policy Endpoints
- `GET /api/policies` - Get all user policies (requires auth)
- `POST /api/policies` - Create new policy (requires auth)
- `GET /api/policies/:id` - Get specific policy (requires auth)
- `PUT /api/policies/:id` - Update policy (requires auth)
- `DELETE /api/policies/:id` - Delete policy (requires auth)
- `GET /api/policies/stats` - Get policy statistics (requires auth)

### Payment Endpoints
- `GET /api/payments` - Get all payments (requires auth)
- `POST /api/payments` - Create payment (requires auth)
- `GET /api/payments/:id` - Get specific payment (requires auth)
- `PUT /api/payments/:id` - Update payment status (requires auth)
- `GET /api/payments/stats` - Get payment statistics (requires auth)

## 🔒 Security Features

- JWT authentication for protected routes
- Password hashing with bcryptjs
- CORS enabled for frontend communication
- Prepared statements to prevent SQL injection
- Input validation on both frontend and backend
- HTTP-only cookies for token storage (can be implemented)
- Environment variables for sensitive data

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Desktop (1200px and above)
- Tablet (768px - 1199px)
- Mobile (480px - 767px)
- Small Mobile (below 480px)

## 🎨 Design Features

- **Color Scheme**: Modern blue gradient (#2563eb to #1e40af)
- **Typography**: Segoe UI, clean and readable
- **Spacing**: Consistent 20px base unit
- **Shadows**: Soft shadows for depth
- **Animations**: Smooth transitions on hover and interactions
- **Icons**: Font Awesome icons for visual appeal
- **Layout**: Grid and Flexbox for modern layouts

## 🚨 Error Handling

- Custom error messages for all endpoints
- Validation on both frontend and backend
- Proper HTTP status codes
- User-friendly error notifications

## 📝 Notes for Production

Before deploying to production:

1. Change JWT_SECRET in `.env`
2. Use strong database passwords
3. Enable HTTPS
4. Set NODE_ENV=production
5. Implement rate limiting
6. Add logging and monitoring
7. Use environment-specific configurations
8. Implement proper payment gateway integration
9. Add email verification for users
10. Implement password reset functionality
11. Add two-factor authentication
12. Use database backups
13. Implement proper error logging
14. Add API request validation with libraries like joi

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify database name matches

### API Not Responding
- Check if backend server is running
- Verify port 3000 is not in use
- Check console for errors

### CORS Error
- Ensure CORS is enabled in Express
- Check frontend and backend URLs match

### Login Issues
- Verify user exists in database
- Check password hashing matches
- Clear browser cache and localStorage

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements.

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For support, please contact:
- Email: support@insurehub.com
- Phone: 1-800-INSURE-1

---

**Created:** March 2024
**Version:** 1.0.0
