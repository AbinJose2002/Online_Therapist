const express = require('express');
const router = express.Router();
const { register, login, getAnalytics } = require('../controllers/AdminController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Debug middleware
router.use((req, res, next) => {
  console.log('Admin Route:', req.method, req.path);
  next();
});

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
