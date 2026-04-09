const pool = require('../config/database');

// Get All Documents for User
exports.getAllDocuments = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [documents] = await connection.query(
            'SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC',
            [req.userId]
        );
        connection.release();

        res.status(200).json(documents);
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Documents by Policy ID
exports.getDocumentsByPolicy = async (req, res) => {
    try {
        const { policyId } = req.params;
        const connection = await pool.getConnection();
        const [documents] = await connection.query(
            `SELECT d.* FROM documents d
             WHERE d.policy_id = ? AND d.user_id = ?
             ORDER BY d.uploaded_at DESC`,
            [policyId, req.userId]
        );
        connection.release();

        res.status(200).json(documents);
    } catch (error) {
        console.error('Get policy documents error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create/Upload Document
exports.uploadDocument = async (req, res) => {
    try {
        const { documentType, policyId } = req.body;
        const userId = req.userId;

        if (!documentType) {
            return res.status(400).json({ message: 'Document type is required' });
        }

        const connection = await pool.getConnection();
        const documentUrl = `document_${Date.now()}.pdf`;

        const [result] = await connection.query(
            `INSERT INTO documents (user_id, policy_id, document_type, document_url, verification_status)
             VALUES (?, ?, ?, ?, 'Pending')`,
            [userId, policyId || null, documentType, documentUrl]
        );
        connection.release();

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: {
                id: result.insertId,
                document_type: documentType,
                document_url: documentUrl,
                verification_status: 'Pending'
            }
        });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Document Verification Status (Admin)
exports.verifyDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { verificationStatus } = req.body;

        if (!verificationStatus) {
            return res.status(400).json({ message: 'Verification status is required' });
        }

        const connection = await pool.getConnection();
        
        const verifyDate = verificationStatus === 'Verified' ? new Date().toISOString() : null;
        
        await connection.query(
            'UPDATE documents SET verification_status = ?, verified_at = ? WHERE id = ?',
            [verificationStatus, verifyDate, id]
        );

        const [document] = await connection.query('SELECT * FROM documents WHERE id = ?', [id]);
        connection.release();

        res.status(200).json({
            message: 'Document verification updated',
            document: document[0]
        });
    } catch (error) {
        console.error('Verify document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete Document
exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();

        await connection.query('DELETE FROM documents WHERE id = ? AND user_id = ?', [id, req.userId]);
        connection.release();

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get User Verification Status
exports.getUserVerificationStatus = async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const [user] = await connection.query(
            'SELECT id, name, email, verification_status FROM users WHERE id = ?',
            [req.userId]
        );

        const [documents] = await connection.query(
            `SELECT document_type, verification_status, uploaded_at 
             FROM documents WHERE user_id = ? 
             ORDER BY uploaded_at DESC`,
            [req.userId]
        );

        connection.release();

        res.status(200).json({
            user: user[0],
            documents: documents,
            overall_status: user[0]?.verification_status || 'Pending'
        });
    } catch (error) {
        console.error('Get verification status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
