const pool = require('../config/database');

// Get All Payments for User
exports.getAllPayments = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [payments] = await connection.query(
            `SELECT p.* FROM payments p
             INNER JOIN policies pol ON p.policy_id = pol.id
             WHERE pol.user_id = ?
             ORDER BY p.payment_date DESC`,
            [req.userId]
        );
        connection.release();

        res.status(200).json(payments);
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Single Payment
exports.getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        
        const [payments] = await connection.query(
            `SELECT p.* FROM payments p
             INNER JOIN policies pol ON p.policy_id = pol.id
             WHERE p.id = ? AND pol.user_id = ?`,
            [id, req.userId]
        );
        connection.release();

        if (payments.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json(payments[0]);
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Payment
exports.createPayment = async (req, res) => {
    try {
        const { policy_id, amount, payment_method, card_name, card_number, expiry, cvv } = req.body;
        const user_id = req.userId;

        if (!policy_id || !amount) {
            return res.status(400).json({ message: 'Policy ID and amount are required' });
        }

        const connection = await pool.getConnection();

        // Verify policy belongs to user
        const [policies] = await connection.query(
            'SELECT * FROM policies WHERE id = ? AND user_id = ?',
            [policy_id, user_id]
        );

        if (policies.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Policy not found' });
        }

        // Validate card details (in production, use a payment gateway)
        if (payment_method === 'card') {
            if (!card_name || !card_number || !expiry || !cvv) {
                connection.release();
                return res.status(400).json({ message: 'Card details are required' });
            }

            // Simple validation
            if (card_number.length !== 16 || cvv.length !== 3) {
                connection.release();
                return res.status(400).json({ message: 'Invalid card details' });
            }
        }

        // Create transaction ID
        const transactionId = 'TXN' + Date.now();

        const [result] = await connection.query(
            'INSERT INTO payments (policy_id, amount, payment_date, status, transaction_id) VALUES (?, ?, NOW(), ?, ?)',
            [policy_id, amount, 'Success', transactionId]
        );

        connection.release();

        res.status(201).json({
            message: 'Payment processed successfully',
            transaction_id: transactionId,
            payment: {
                id: result.insertId,
                policy_id: policy_id,
                amount: amount,
                payment_date: new Date(),
                status: 'Success',
                transaction_id: transactionId
            }
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const connection = await pool.getConnection();

        // Verify payment belongs to user
        const [payments] = await connection.query(
            `SELECT p.* FROM payments p
             INNER JOIN policies pol ON p.policy_id = pol.id
             WHERE p.id = ? AND pol.user_id = ?`,
            [id, req.userId]
        );

        if (payments.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Payment not found' });
        }

        await connection.query('UPDATE payments SET status = ? WHERE id = ?', [status, id]);

        const [updatedPayment] = await connection.query('SELECT * FROM payments WHERE id = ?', [id]);
        connection.release();

        res.status(200).json({
            message: 'Payment status updated successfully',
            payment: updatedPayment[0]
        });
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Payment Statistics
exports.getPaymentStats = async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [stats] = await connection.query(
            `SELECT 
                COUNT(*) as totalPayments,
                SUM(CASE WHEN status = 'Success' THEN 1 ELSE 0 END) as successfulPayments,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingPayments,
                SUM(amount) as totalAmountPaid
             FROM payments p
             INNER JOIN policies pol ON p.policy_id = pol.id
             WHERE pol.user_id = ?`,
            [req.userId]
        );
        connection.release();

        res.status(200).json(stats[0]);
    } catch (error) {
        console.error('Get payment stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
