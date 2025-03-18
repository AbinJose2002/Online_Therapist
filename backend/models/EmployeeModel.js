const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true },
  serviceType: { type: String, enum: ["Therapist", "Home Nurse"], required: true },
  description: { type: String, required: true },
  experience: { type: Number, required: true },
  location: { type: String, required: true },
  fee: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
