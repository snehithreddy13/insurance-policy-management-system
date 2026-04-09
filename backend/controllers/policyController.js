const pool = require('../config/database');

// Get All Policies for User
exports.getAllPolicies = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [policies] = await connection.query(
            'SELECT * FROM policies WHERE user_id = ? ORDER BY created_at DESC',
            [req.userId]
        );
        connection.release();

        res.status(200).json(policies);
    } catch (error) {
        console.error('Get policies error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Single Policy
exports.getPolicyById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        const [policies] = await connection.query(
            'SELECT * FROM policies WHERE id = ? AND user_id = ?',
            [id, req.userId]
        );
        connection.release();

        if (policies.length === 0) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        res.status(200).json(policies[0]);
    } catch (error) {
        console.error('Get policy error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Policy
exports.createPolicy = async (req, res) => {
    try {
        const { policy_name, sum_assured, premium, due_date, status } = req.body;
        const user_id = req.userId;

        if (!policy_name || !sum_assured || !premium || !due_date) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const connection = await pool.getConnection();
        const [result] = await connection.query(
            'INSERT INTO policies (user_id, policy_name, sum_assured, premium, due_date, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, policy_name, sum_assured, premium, due_date, status || 'Active']
        );
        connection.release();

        res.status(201).json({
            message: 'Policy created successfully',
            policy: {
                id: result.insertId,
                user_id: user_id,
                policy_name: policy_name,
                sum_assured: sum_assured,
                premium: premium,
                due_date: due_date,
                status: status || 'Active'
            }
        });
    } catch (error) {
        console.error('Create policy error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Policy
exports.updatePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const { policy_name, sum_assured, premium, due_date, status } = req.body;

        const connection = await pool.getConnection();
        
        // Check if policy belongs to user
        const [policies] = await connection.query(
            'SELECT * FROM policies WHERE id = ? AND user_id = ?',
            [id, req.userId]
        );

        if (policies.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Policy not found' });
        }

        let updateQuery = 'UPDATE policies SET ';
        let updateValues = [];
        const fields = [];

        if (policy_name !== undefined) {
            fields.push('policy_name = ?');
            updateValues.push(policy_name);
        }
        if (sum_assured !== undefined) {
            fields.push('sum_assured = ?');
            updateValues.push(sum_assured);
        }
        if (premium !== undefined) {
            fields.push('premium = ?');
            updateValues.push(premium);
        }
        if (due_date !== undefined) {
            fields.push('due_date = ?');
            updateValues.push(due_date);
        }
        if (status !== undefined) {
            fields.push('status = ?');
            updateValues.push(status);
        }

        if (fields.length === 0) {
            connection.release();
            return res.status(400).json({ message: 'At least one field is required to update' });
        }

        updateQuery += fields.join(', ') + ' WHERE id = ?';
        updateValues.push(id);

        await connection.query(updateQuery, updateValues);

        const [updatedPolicy] = await connection.query('SELECT * FROM policies WHERE id = ?', [id]);
        connection.release();

        res.status(200).json({
            message: 'Policy updated successfully',
            policy: updatedPolicy[0]
        });
    } catch (error) {
        console.error('Update policy error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Policy
exports.deletePolicy = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        // Check if policy belongs to user
        const [policies] = await connection.query(
            'SELECT * FROM policies WHERE id = ? AND user_id = ?',
            [id, req.userId]
        );

        if (policies.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Policy not found' });
        }

        await connection.query('DELETE FROM policies WHERE id = ?', [id]);
        connection.release();

        res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error) {
        console.error('Delete policy error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Policy Statistics
exports.getPolicyStats = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const [stats] = await connection.query(
            'SELECT COUNT(*) as totalPolicies, SUM(CASE WHEN status = "Active" THEN 1 ELSE 0 END) as activePolicies, SUM(premium) as totalPremium FROM policies WHERE user_id = ?',
            [req.userId]
        );
        connection.release();

        res.status(200).json(stats[0]);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
