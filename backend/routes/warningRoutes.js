const express = require('express');
const router = express.Router();
const { createWarning, getPatientWarnings, createEmployeeWarning, getEmployeeWarnings } = require('../controllers/WarningController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createWarning);
router.get('/patient', authMiddleware, getPatientWarnings);
router.post('/employee', authMiddleware, createEmployeeWarning);
router.get('/employee', authMiddleware, getEmployeeWarnings);

module.exports = router;
