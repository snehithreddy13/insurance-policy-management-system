const express = require('express');
const policyController = require('../controllers/policyController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// All policy routes require authentication
router.get('/', verifyToken, policyController.getAllPolicies);
router.post('/', verifyToken, policyController.createPolicy);
router.get('/stats', verifyToken, policyController.getPolicyStats);
router.get('/:id', verifyToken, policyController.getPolicyById);
router.put('/:id', verifyToken, policyController.updatePolicy);
router.delete('/:id', verifyToken, policyController.deletePolicy);

module.exports = router;
