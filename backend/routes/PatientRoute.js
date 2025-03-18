const express = require('express');
const patientRouter = express.Router();
const { login, register } = require('../controllers/PatientController.js');

patientRouter.post('/register', register);
patientRouter.post('/login', login);

module.exports = patientRouter;