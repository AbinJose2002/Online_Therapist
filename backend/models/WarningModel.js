const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  actionTaken: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Warning", warningSchema);
