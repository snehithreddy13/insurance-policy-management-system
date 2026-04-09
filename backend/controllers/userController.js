const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// User Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        connection.release();

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).json({
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                customer_id: user.customer_id,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Profile
exports.getProfile = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            `SELECT id, name, email, phone, date_of_birth, age, gender, aadhar_number, pan_number, customer_id, status, kyc_status, nominee_name, nominee_relationship, verification_status, last_login 
             FROM users WHERE id = ?`, 
            [req.userId]
        );
        connection.release();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Validation Helper Functions
const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
};

const validateAadhar = (aadhar) => {
    const aadharRegex = /^[2-9]\d{11}$/;
    return aadharRegex.test(aadhar.replace(/\D/g, ''));
};

const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
};

const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Create User (Registration)
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, date_of_birth, gender, aadhar_number, pan_number, nominee_name, nominee_relationship, status } = req.body;

        // Required field validation
        if (!name || !email || !password || !phone || !date_of_birth || !gender || !aadhar_number || !pan_number) {
            return res.status(400).json({ 
                message: 'All required fields must be provided: name, email, password, phone, date_of_birth, gender, aadhar_number, pan_number' 
            });
        }

        // Phone number validation (India - 10 digits starting with 6-9)
        if (!validatePhone(phone)) {
            return res.status(400).json({ message: 'Invalid phone number. Must be a valid 10-digit Indian mobile number.' });
        }

        // DOB validation
        const birthDate = new Date(date_of_birth);
        const today = new Date();
        if (isNaN(birthDate) || birthDate > today) {
            return res.status(400).json({ message: 'Invalid date of birth. Must be a past date.' });
        }

        // Age calculation and eligibility
        const age = calculateAge(date_of_birth);
        if (age < 18) {
            return res.status(400).json({ message: 'Must be at least 18 years old to register for insurance.' });
        }
        if (age > 65) {
            return res.status(400).json({ message: 'Insurance registration closed for age above 65 years. Please contact support.' });
        }

        // Aadhar validation (12 digits)
        if (!validateAadhar(aadhar_number)) {
            return res.status(400).json({ message: 'Invalid Aadhar number. Must be a valid 12-digit Aadhar.' });
        }

        // PAN validation (10 characters)
        if (!validatePAN(pan_number)) {
            return res.status(400).json({ message: 'Invalid PAN. Must follow format: 5 letters, 4 numbers, 1 letter (e.g., ABCDE1234F)' });
        }

        // Gender validation
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({ message: 'Invalid gender. Must be Male, Female, or Other.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const customer_id = 'CUST' + Date.now();

        const connection = await pool.getConnection();
        
        // Check if email already exists
        const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'Email already registered. Please use a different email.' });
        }

        // Check if Aadhar already exists
        const [aadharExists] = await connection.query('SELECT id FROM users WHERE aadhar_number = ?', [aadhar_number]);
        if (aadharExists.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'Aadhar number already registered.' });
        }

        // Check if PAN already exists
        const [panExists] = await connection.query('SELECT id FROM users WHERE pan_number = ?', [pan_number]);
        if (panExists.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'PAN already registered.' });
        }

        // Check if phone already exists
        const [phoneExists] = await connection.query('SELECT id FROM users WHERE phone = ?', [phone]);
        if (phoneExists.length > 0) {
            connection.release();
            return res.status(400).json({ message: 'Phone number already registered.' });
        }

        const [result] = await connection.query(
            `INSERT INTO users (name, email, password, phone, date_of_birth, age, gender, aadhar_number, pan_number, customer_id, status, kyc_status, nominee_name, nominee_relationship) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, date_of_birth, age, gender, aadhar_number, pan_number, customer_id, status || 'Silver', 'Pending', nominee_name || null, nominee_relationship || null]
        );
        connection.release();

        res.status(201).json({
            message: 'User registered successfully. Please complete KYC verification to activate all features.',
            user: {
                id: result.insertId,
                name: name,
                email: email,
                phone: phone,
                date_of_birth: date_of_birth,
                age: age,
                gender: gender,
                customer_id: customer_id,
                status: status || 'Silver',
                kyc_status: 'Pending'
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, status } = req.body;
        const userId = req.userId;

        if (!name && !status) {
            return res.status(400).json({ message: 'At least one field is required to update' });
        }

        const connection = await pool.getConnection();
        
        if (name && status) {
            await connection.query('UPDATE users SET name = ?, status = ? WHERE id = ?', [name, status, userId]);
        } else if (name) {
            await connection.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
        } else {
            await connection.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
        }

        const [updatedUser] = await connection.query('SELECT id, name, email, customer_id, status FROM users WHERE id = ?', [userId]);
        connection.release();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
