const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getPatientProfile, 
  updatePatientProfile,
  getAppointments,
  getEmployeePatients,
  getReview,
  getRemarks,
  addRemark,
  getMyTherapists,
  getAllPatients
} = require('../controllers/PatientController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Auth routes with proper callbacks
router.post('/register', (req, res) => register(req, res));
router.post('/login', (req, res) => login(req, res));

// Protected routes with proper callbacks
router.get('/profile', authMiddleware, (req, res) => getPatientProfile(req, res));
router.put('/profile', authMiddleware, (req, res) => updatePatientProfile(req, res));
router.get('/appointments', authMiddleware, (req, res) => getAppointments(req, res));

// Employee-patients route
router.get('/employee-patients', authMiddleware, getEmployeePatients);

// Review routes
router.get('/reviews/:employeeId', authMiddleware, getReview);
router.post('/remarks', authMiddleware, addRemark);
router.get('/remarks/:patientId', authMiddleware, getRemarks);

// Add my-therapists route
router.get('/my-therapists', authMiddleware, getMyTherapists);

// Admin route to get all patients
router.get('/all', authMiddleware, getAllPatients);

module.exports = router;