# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Endpoints

### 1. User Login (Public)
**POST** `/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "customer_id": "CUST001",
    "status": "Gold"
  }
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials

---

### 2. User Registration (Public)
**POST** `/users/register`

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "securepassword123",
  "status": "Silver"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 4,
    "name": "New User",
    "email": "newuser@example.com",
    "customer_id": "CUST1701000000000",
    "status": "Silver"
  }
}
```

**Error Responses:**
- `400` - Missing required fields or email already exists
- `500` - Server error

---

### 3. Get User Profile (Protected)
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "customer_id": "CUST001",
  "status": "Gold"
}
```

**Error Responses:**
- `401` - Unauthorized (invalid or missing token)
- `404` - User not found
- `500` - Server error

---

### 4. Update User Profile (Protected)
**PUT** `/users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Updated",
  "status": "Platinum"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "customer_id": "CUST001",
    "status": "Platinum"
  }
}
```

**Error Responses:**
- `400` - No fields to update
- `401` - Unauthorized
- `500` - Server error

---

## Policy Endpoints

### 1. Get All Policies (Protected)
**GET** `/policies`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- None (returns all user policies)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "policy_name": "Health Insurance Premium",
    "sum_assured": 500000.00,
    "premium": 5000.00,
    "due_date": "2024-12-31",
    "status": "Active",
    "created_at": "2024-03-01T10:30:00.000Z",
    "updated_at": "2024-03-01T10:30:00.000Z"
  },
  {
    "id": 2,
    "user_id": 1,
    "policy_name": "Life Insurance Plus",
    "sum_assured": 1000000.00,
    "premium": 8000.00,
    "due_date": "2025-01-15",
    "status": "Active",
    "created_at": "2024-03-01T10:30:00.000Z",
    "updated_at": "2024-03-01T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

### 2. Get Single Policy (Protected)
**GET** `/policies/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "policy_name": "Health Insurance Premium",
  "sum_assured": 500000.00,
  "premium": 5000.00,
  "due_date": "2024-12-31",
  "status": "Active",
  "created_at": "2024-03-01T10:30:00.000Z",
  "updated_at": "2024-03-01T10:30:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Policy not found
- `500` - Server error

---

### 3. Create Policy (Protected)
**POST** `/policies`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "policy_name": "Travel Insurance Annual",
  "sum_assured": 100000,
  "premium": 1500,
  "due_date": "2025-12-31",
  "status": "Active"
}
```

**Response (201 Created):**
```json
{
  "message": "Policy created successfully",
  "policy": {
    "id": 7,
    "user_id": 1,
    "policy_name": "Travel Insurance Annual",
    "sum_assured": 100000,
    "premium": 1500,
    "due_date": "2025-12-31",
    "status": "Active"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Server error

---

### 4. Update Policy (Protected)
**PUT** `/policies/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "premium": 1600,
  "status": "Inactive"
}
```

**Response (200 OK):**
```json
{
  "message": "Policy updated successfully",
  "policy": {
    "id": 7,
    "user_id": 1,
    "policy_name": "Travel Insurance Annual",
    "sum_assured": 100000,
    "premium": 1600,
    "due_date": "2025-12-31",
    "status": "Inactive",
    "created_at": "2024-03-01T10:30:00.000Z",
    "updated_at": "2024-03-01T11:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - No fields to update
- `401` - Unauthorized
- `404` - Policy not found
- `500` - Server error

---

### 5. Delete Policy (Protected)
**DELETE** `/policies/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Policy deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Policy not found
- `500` - Server error

---

### 6. Get Policy Statistics (Protected)
**GET** `/policies/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "totalPolicies": 6,
  "activePolicies": 5,
  "totalPremium": 26500.00
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

## Payment Endpoints

### 1. Get All Payments (Protected)
**GET** `/payments`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "policy_id": 1,
    "amount": 5000.00,
    "payment_date": "2024-11-01T00:00:00.000Z",
    "status": "Success",
    "transaction_id": "TXN1001",
    "payment_method": "card",
    "created_at": "2024-11-01T10:30:00.000Z",
    "updated_at": "2024-11-01T10:30:00.000Z"
  },
  {
    "id": 2,
    "policy_id": 2,
    "amount": 8000.00,
    "payment_date": "2024-10-15T00:00:00.000Z",
    "status": "Success",
    "transaction_id": "TXN1002",
    "payment_method": "card",
    "created_at": "2024-10-15T10:30:00.000Z",
    "updated_at": "2024-10-15T10:30:00.000Z"
  }
]
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

### 2. Get Single Payment (Protected)
**GET** `/payments/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "policy_id": 1,
  "amount": 5000.00,
  "payment_date": "2024-11-01T00:00:00.000Z",
  "status": "Success",
  "transaction_id": "TXN1001",
  "payment_method": "card",
  "created_at": "2024-11-01T10:30:00.000Z",
  "updated_at": "2024-11-01T10:30:00.000Z"
}
```

**Error Responses:**
- `401` - Unauthorized
- `404` - Payment not found
- `500` - Server error

---

### 3. Create Payment (Protected)
**POST** `/payments`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "policy_id": 1,
  "amount": 5000.00,
  "payment_method": "card",
  "card_name": "John Doe",
  "card_number": "1234567890123456",
  "expiry": "12/26",
  "cvv": "123"
}
```

**Response (201 Created):**
```json
{
  "message": "Payment processed successfully",
  "transaction_id": "TXN1701000000123",
  "payment": {
    "id": 5,
    "policy_id": 1,
    "amount": 5000.00,
    "payment_date": "2024-11-28T13:25:30.000Z",
    "status": "Success",
    "transaction_id": "TXN1701000000123"
  }
}
```

**Error Responses:**
- `400` - Invalid payment details
- `401` - Unauthorized
- `404` - Policy not found
- `500` - Server error

**Validation Rules:**
- Card number: 16 digits
- Expiry: MM/YY format
- CVV: 3 digits
- Amount: > 0

---

### 4. Update Payment Status (Protected)
**PUT** `/payments/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "Failed"
}
```

**Response (200 OK):**
```json
{
  "message": "Payment status updated successfully",
  "payment": {
    "id": 5,
    "policy_id": 1,
    "amount": 5000.00,
    "payment_date": "2024-11-28T13:25:30.000Z",
    "status": "Failed",
    "transaction_id": "TXN1701000000123",
    "payment_method": "card",
    "created_at": "2024-11-28T13:25:30.000Z",
    "updated_at": "2024-11-28T13:25:30.000Z"
  }
}
```

**Error Responses:**
- `400` - Status not provided
- `401` - Unauthorized
- `404` - Payment not found
- `500` - Server error

**Valid Status Values:**
- `Pending`
- `Success`
- `Failed`
- `Cancelled`

---

### 5. Get Payment Statistics (Protected)
**GET** `/payments/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "totalPayments": 4,
  "successfulPayments": 4,
  "pendingPayments": 0,
  "totalAmountPaid": 22000.00
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

## Health Check Endpoint

### API Health Check (Public)
**GET** `/health`

**Response (200 OK):**
```json
{
  "message": "API is running"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication Flow

1. **Register/Login** to get a token
2. **Store the token** (localStorage or session storage)
3. **Include token** in Authorization header for protected requests
4. **Token expires** after 7 days (reconfigure in JWT settings)
5. **Logout** by removing the token

---

## Pagination (Future Implementation)

Future versions may include:
```
/policies?page=1&limit=10
/payments?skip=0&take=20
```

---

## Filtering (Future Implementation)

Future versions may include:
```
/policies?status=Active
/policies?due_date_from=2024-01-01&due_date_to=2024-12-31
/payments?status=Success
```

---

## Rate Limiting (Recommended)

For production, implement rate limiting:
- 100 requests per minute per user
- 10 failed login attempts = 15 minute lockout

---

## CORS Headers

The API includes the following CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Example API Calls

### Complete Login and Get Policies Flow

```bash
# 1. Login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password"
  }'

# Response includes token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Get all policies
curl -X GET http://localhost:3000/api/policies \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Get policy stats
curl -X GET http://localhost:3000/api/policies/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 4. Create a payment
curl -X POST http://localhost:3000/api/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "policy_id": 1,
    "amount": 5000.00,
    "payment_method": "card",
    "card_name": "John Doe",
    "card_number": "1234567890123456",
    "expiry": "12/26",
    "cvv": "123"
  }'
```

---

## Support

For API issues:
1. Check HTTP status code
2. Review error message
3. Verify token is valid
4. Check database connection
5. Review server logs

---

**API Version:** 1.0.0
**Last Updated:** March 2024
