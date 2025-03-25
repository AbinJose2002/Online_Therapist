const Warning = require('../models/WarningModel');

const createWarning = async (req, res) => {
  try {
    const { employeeId, reason, description } = req.body;
    const patientId = req.user.id;

    const warning = new Warning({
      patientId,
      employeeId,
      reason,
      description
    });

    await warning.save();

    res.status(201).json({
      success: true,
      message: 'Warning submitted successfully',
      warning
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit warning',
      error: error.message
    });
  }
};

const getPatientWarnings = async (req, res) => {
  try {
    const warnings = await Warning.find({ patientId: req.user.id })
      .populate('employeeId', 'firstName lastName')
      .sort('-createdAt');

    res.status(200).json(warnings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch warnings',
      error: error.message
    });
  }
};

const createEmployeeWarning = async (req, res) => {
  try {
    const { patientId, reason, description } = req.body;
    const employeeId = req.user.id;

    const warning = new Warning({
      employeeId,
      patientId,
      reason,
      description,
      reportedBy: 'employee'
    });

    await warning.save();

    res.status(201).json({
      success: true,
      message: 'Warning submitted successfully',
      warning
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit warning',
      error: error.message
    });
  }
};

const getEmployeeWarnings = async (req, res) => {
  try {
    const warnings = await Warning.find({ employeeId: req.user.id })
      .populate('patientId', 'firstName lastName')
      .sort('-createdAt');

    res.status(200).json(warnings);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch warnings',
      error: error.message
    });
  }
};

module.exports = { 
  createWarning, 
  getPatientWarnings,
  createEmployeeWarning,
  getEmployeeWarnings
};
