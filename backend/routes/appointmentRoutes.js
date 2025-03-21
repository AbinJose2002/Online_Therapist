const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getPatientAppointments,
  getEmployeeAppointments,
  acceptAppointment,
  getBookedSlots 
} = require('../controllers/AppointmentController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/booked-slots', authMiddleware, asyncHandler(getBookedSlots));
router.post('/', authMiddleware, asyncHandler(createAppointment));
router.get('/patient', authMiddleware, asyncHandler(getPatientAppointments));
router.get('/employee', authMiddleware, asyncHandler(getEmployeeAppointments));
router.put('/accept/:appointmentId', authMiddleware, asyncHandler(acceptAppointment));

module.exports = router;
