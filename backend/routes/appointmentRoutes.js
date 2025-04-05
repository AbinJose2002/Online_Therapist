const express = require('express');
const router = express.Router();
const { 
  createAppointment, 
  getPatientAppointments,
  getEmployeeAppointments,
  acceptAppointment,
  getBookedSlots,
  getTherapistBookings,
  getAllEmployeeAppointments // Add this
} = require('../controllers/AppointmentController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Update route paths to match frontend requests
router.get('/booked-slots', authMiddleware, asyncHandler(getBookedSlots));
router.post('/', authMiddleware, asyncHandler(createAppointment));
router.get('/patient', authMiddleware, asyncHandler(getPatientAppointments));
router.get('/employee', authMiddleware, asyncHandler(getEmployeeAppointments));
router.put('/accept/:appointmentId', authMiddleware, asyncHandler(acceptAppointment));
router.get('/therapist-bookings', authMiddleware, asyncHandler(getTherapistBookings)); // Add new route for therapist bookings
router.get('/employee/all', authMiddleware, asyncHandler(getAllEmployeeAppointments)); // Add a new route to get all appointments for an employee

module.exports = router;
