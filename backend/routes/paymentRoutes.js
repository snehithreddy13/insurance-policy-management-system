const express = require('express');
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// All payment routes require authentication
router.get('/', verifyToken, paymentController.getAllPayments);
router.post('/', verifyToken, paymentController.createPayment);
router.get('/stats', verifyToken, paymentController.getPaymentStats);
router.get('/:id', verifyToken, paymentController.getPaymentById);
router.put('/:id', verifyToken, paymentController.updatePaymentStatus);

module.exports = router;
