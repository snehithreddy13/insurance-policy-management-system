const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, 'insurance.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
function initializeDatabase() {
    const sql = `
        DROP TABLE IF EXISTS documents;
        DROP TABLE IF EXISTS payments;
        DROP TABLE IF EXISTS policies;
        DROP TABLE IF EXISTS beneficiaries;
        DROP TABLE IF EXISTS users;

        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            date_of_birth DATE NOT NULL,
            age INTEGER,
            gender TEXT,
            aadhar_number TEXT UNIQUE,
            pan_number TEXT UNIQUE,
            customer_id TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'Silver',
            verification_status TEXT DEFAULT 'Pending',
            kyc_status TEXT DEFAULT 'Pending',
            nominee_name TEXT,
            nominee_age INTEGER,
            nominee_relationship TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
        );

        CREATE TABLE policies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            policy_name TEXT NOT NULL,
            policy_type TEXT NOT NULL,
            sum_assured DECIMAL(15, 2) NOT NULL,
            premium DECIMAL(10, 2) NOT NULL,
            due_date DATE NOT NULL,
            status TEXT DEFAULT 'Active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            policy_id INTEGER NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'Pending',
            transaction_id TEXT UNIQUE,
            payment_method TEXT DEFAULT 'card',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
        );

        CREATE TABLE documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            policy_id INTEGER,
            document_type TEXT NOT NULL,
            document_url TEXT,
            verification_status TEXT DEFAULT 'Pending',
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            verified_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE
        );

        INSERT INTO users (name, email, password, phone, date_of_birth, age, gender, aadhar_number, pan_number, customer_id, status, verification_status, kyc_status, nominee_name, nominee_relationship) VALUES
        ('John Doe', 'john@example.com', '$2a$10$K8xXkSOvTryN6TQQ0G1g6ezRLqB6Wq2X.5Y5X5Y5X5Y5X5Y5X', '9876543210', '1990-05-15', 34, 'Male', '123456789012', 'ABCD1234E', 'CUST001', 'Gold', 'Verified', 'Approved', 'Sarah Doe', 'Spouse'),
        ('Jane Smith', 'jane@example.com', '$2a$10$K8xXkSOvTryN6TQQ0G1g6ezRLqB6Wq2X.5Y5X5Y5X5Y5X5Y5X', '9876543211', '1992-08-22', 32, 'Female', '123456789013', 'BCDE2345F', 'CUST002', 'Silver', 'Verified', 'Approved', 'John Smith', 'Spouse'),
        ('Mike Johnson', 'mike@example.com', '$2a$10$K8xXkSOvTryN6TQQ0G1g6ezRLqB6Wq2X.5Y5X5Y5X5Y5X5Y5X', '9876543212', '1988-03-10', 36, 'Male', '123456789014', 'CDEF3456G', 'CUST003', 'Gold', 'Verified', 'Approved', 'Emma Johnson', 'Daughter');

        INSERT INTO policies (user_id, policy_name, policy_type, sum_assured, premium, due_date, status) VALUES
        (1, 'Health Insurance Premium', 'Health', 5000000.00, 15000.00, '2024-12-31', 'Active'),
        (1, 'Life Insurance Plus', 'Life', 10000000.00, 25000.00, '2025-01-15', 'Active'),
        (1, 'Car Insurance Comprehensive', 'Car', 1500000.00, 8000.00, '2024-11-30', 'Active'),
        (1, 'Home Insurance Premium', 'Home', 20000000.00, 35000.00, '2025-03-15', 'Pending'),
        (1, 'Two Wheeler Insurance', 'Bike', 500000.00, 3500.00, '2024-10-20', 'Active'),
        (2, 'Health Insurance Basic', 'Health', 3000000.00, 12000.00, '2024-12-15', 'Active'),
        (2, 'Home Insurance Standard', 'Home', 15000000.00, 25000.00, '2025-02-28', 'Active'),
        (2, 'Car Insurance Standard', 'Car', 1000000.00, 6500.00, '2025-01-10', 'Active'),
        (3, 'Travel Insurance Annual', 'Travel', 1000000.00, 5000.00, '2024-10-31', 'Active'),
        (3, 'Bike Insurance Comprehensive', 'Bike', 800000.00, 4500.00, '2025-02-14', 'Active'),
        (3, 'Life Insurance Standard', 'Life', 5000000.00, 12000.00, '2025-04-01', 'Pending');

        INSERT INTO payments (policy_id, amount, payment_date, status, transaction_id, payment_method) VALUES
        (1, 15000.00, '2024-11-01', 'Success', 'TXN1001', 'card'),
        (2, 25000.00, '2024-10-15', 'Success', 'TXN1002', 'card'),
        (3, 8000.00, '2024-11-05', 'Success', 'TXN1003', 'bank_transfer'),
        (4, 35000.00, '2024-09-20', 'Pending', 'TXN1004', 'card'),
        (6, 12000.00, '2024-11-10', 'Success', 'TXN1005', 'upi'),
        (7, 25000.00, '2024-10-05', 'Success', 'TXN1006', 'card');

        INSERT INTO documents (user_id, policy_id, document_type, verification_status) VALUES
        (1, 1, 'Aadhar Card', 'Verified'),
        (1, 1, 'Medical Report', 'Verified'),
        (1, 3, 'Driving License', 'Verified'),
        (1, 4, 'Property Papers', 'Pending'),
        (2, 6, 'Aadhar Card', 'Verified'),
        (2, 7, 'Property Proof', 'Pending'),
        (3, 9, 'Aadhar Card', 'Verified'),
        (3, 10, 'RC Book', 'Verified');
    `;

    db.exec(sql, (err) => {
        if (err) {
            console.error('Error initializing database:', err.message);
        } else {
            console.log('Database initialized successfully.');
        }
    });
}

// Promisify database operations for consistency with existing code
const pool = {
    getConnection: () => Promise.resolve({
        query: (sql, params) => new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve([rows]);
            });
        }),
        release: () => {} // No-op for SQLite
    })
};

module.exports = pool;
