const express = require('express');
const documentController = require('../controllers/documentController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// All document routes require authentication
router.get('/', verifyToken, documentController.getAllDocuments);
router.post('/', verifyToken, documentController.uploadDocument);
router.get('/policy/:policyId', verifyToken, documentController.getDocumentsByPolicy);
router.put('/:id', verifyToken, documentController.verifyDocument);
router.delete('/:id', verifyToken, documentController.deleteDocument);
router.get('/verification/status', verifyToken, documentController.getUserVerificationStatus);

module.exports = router;
