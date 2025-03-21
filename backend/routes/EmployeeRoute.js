const express = require('express');
const userRouter = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { 
  login, 
  register, 
  getEmployees, 
  getLocalities, 
  getServiceTypes, 
  getEmployeeProfile, 
  updateEmployeeProfile, 
  getEmployeeReviews 
} = require('../controllers/EmployeeController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes - directly use controller functions
userRouter.get('/localities', getLocalities);
userRouter.get('/servicetypes', getServiceTypes);

// Public routes - wrap in async handler
userRouter.get('/fetch', async (req, res) => {
  try {
    await getEmployees(req, res);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ message: "Route error" });
  }
});

// Auth routes
userRouter.post('/register', upload.single('image'), register);
userRouter.post('/login', login);

// Protected routes
userRouter.get('/profile', authMiddleware, getEmployeeProfile);
userRouter.put('/profile', authMiddleware, updateEmployeeProfile);
userRouter.get('/reviews', authMiddleware, getEmployeeReviews);

module.exports = userRouter;