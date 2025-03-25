const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getAnalytics, 
  getDashboardStats, 
  getPatientWarnings, 
  getEmployeeWarnings,
  toggleEmployeeStatus 
} = require('../controllers/AdminController.js');
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
router.get('/dashboard-stats', authMiddleware, getDashboardStats);
router.get('/patient-warnings', authMiddleware, getPatientWarnings);
router.get('/employee-warnings', authMiddleware, getEmployeeWarnings);
router.put('/employees/:employeeId/toggle-status', authMiddleware, toggleEmployeeStatus);

module.exports = router;
