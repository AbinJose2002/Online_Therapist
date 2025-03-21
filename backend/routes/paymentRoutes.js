const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/PaymentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-payment-intent', authMiddleware, (req, res) => {
  createPaymentIntent(req, res);
});

module.exports = router;
