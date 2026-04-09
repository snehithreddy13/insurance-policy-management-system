-- Database Schema for Insurance Policy Management System
-- Execute this file in MySQL to create the database and tables

CREATE DATABASE IF NOT EXISTS insurance_db;
USE insurance_db;

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'Silver' COMMENT 'Silver, Gold, Platinum, Verified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Policies Table
CREATE TABLE policies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    policy_name VARCHAR(255) NOT NULL,
    sum_assured DECIMAL(15, 2) NOT NULL,
    premium DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active' COMMENT 'Active, Inactive, Pending, Expired',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    policy_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending' COMMENT 'Pending, Success, Failed, Cancelled',
    transaction_id VARCHAR(100) UNIQUE,
    payment_method VARCHAR(50) DEFAULT 'card' COMMENT 'card, bank_transfer, cheque',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(id) ON DELETE CASCADE,
    INDEX idx_policy_id (policy_id),
    INDEX idx_status (status),
    INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Data (Optional - for testing)
-- Insert sample users
INSERT INTO users (name, email, password, customer_id, status) VALUES
('John Doe', 'john@example.com', '$2a$10$K8xXkSOvTryN6TQQ0G1g6ezRLqB6Wq2X.5Y5X5Y5X5Y5X5Y5X', 'CUST001', 'Gold'),
('Jane Smith', 'jane@example.com', '$2a$10$K8xXkSOvTryN6TQQ0G1g6ezRLqB6Wq2X.5Y5X5Y5X5Y5X5Y5X', 'CUST002', 'Silver'),
('Mike Johnson', 'mike@example.com', '$2a$10$K8xXkSOvTryN6TQQ0G1g6ezRLqB6Wq2X.5Y5X5Y5X5Y5X5Y5X', 'CUST003', 'Gold');

-- Insert sample policies
INSERT INTO policies (user_id, policy_name, sum_assured, premium, due_date, status) VALUES
(1, 'Health Insurance Premium', 500000.00, 5000.00, '2024-12-31', 'Active'),
(1, 'Life Insurance Plus', 1000000.00, 8000.00, '2025-01-15', 'Active'),
(1, 'Auto Insurance Comprehensive', 150000.00, 2500.00, '2024-11-30', 'Pending'),
(2, 'Health Insurance Basic', 300000.00, 3000.00, '2024-12-15', 'Active'),
(2, 'Home Insurance', 2000000.00, 6000.00, '2025-02-28', 'Active'),
(3, 'Travel Insurance Annual', 100000.00, 1500.00, '2024-10-31', 'Inactive');

-- Insert sample payments
INSERT INTO payments (policy_id, amount, payment_date, status, transaction_id, payment_method) VALUES
(1, 5000.00, '2024-11-01', 'Success', 'TXN1001', 'card'),
(2, 8000.00, '2024-10-15', 'Success', 'TXN1002', 'card'),
(4, 3000.00, '2024-11-05', 'Success', 'TXN1003', 'bank_transfer'),
(5, 6000.00, '2024-09-20', 'Success', 'TXN1004', 'card');

-- Create Indexes for better query performance
CREATE INDEX idx_policies_user_status ON policies(user_id, status);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_policy_date ON payments(policy_id, payment_date);

-- View for user's policy summary
CREATE VIEW user_policy_summary AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(p.id) as total_policies,
    SUM(CASE WHEN p.status = 'Active' THEN 1 ELSE 0 END) as active_policies,
    SUM(p.premium) as total_premium,
    SUM(p.sum_assured) as total_sum_assured
FROM users u
LEFT JOIN policies p ON u.id = p.user_id
GROUP BY u.id, u.name, u.email;

-- View for payment history
CREATE VIEW payment_summary AS
SELECT 
    p.policy_id,
    COUNT(pay.id) as total_payments,
    SUM(pay.amount) as total_paid,
    MAX(pay.payment_date) as last_payment_date
FROM policies p
LEFT JOIN payments pay ON p.id = pay.policy_id
GROUP BY p.policy_id;

COMMIT;
