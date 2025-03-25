const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/PatientModel.js");
const Appointment = require("../models/AppointmentModel.js");
const Remark = require("../models/RemarkModel.js");
const Review = require('../models/ReviewModel.js');

const generateToken = (id, email, expiresIn = "1d") => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn });
};

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, number, location } = req.body;

        // Check if the user already exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new patient
        const newPatient = new Patient({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            number,
            location,
        });

        await newPatient.save();

        // Generate JWT Token
        const token = generateToken(newPatient._id, newPatient.email);
        console.log(token)
        res.status(201).json({
            message: "User registered successfully",
            user: { id: newPatient._id, firstName, lastName, email, number, location },
            token,
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await Patient.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if user is banned
        if (user.isDisabled) {
            const now = new Date();
            const disabledUntil = new Date(user.disabledUntil);
            
            if (now < disabledUntil) {
                const daysLeft = Math.ceil((disabledUntil - now) / (1000 * 60 * 60 * 24));
                return res.status(403).json({ 
                    message: `Your account has been temporarily disabled. ${daysLeft} days remaining before reactivation.`,
                    isDisabled: true,
                    disabledUntil: user.disabledUntil
                });
            } else {
                // If ban period is over, automatically enable the account
                user.isDisabled = false;
                user.disabledUntil = null;
                await user.save();
            }
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user._id, user.email);
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getEmployeePatients = async (req, res) => {
  try {
    const employeeId = req.user.id;
    console.log('Fetching patients for employee:', employeeId);

    const appointments = await Appointment.find({
      employeeId,
      status: { $in: ['confirmed', 'pending'] }
    }).populate({
      path: 'patientId',
      select: 'firstName lastName email number location'
    });

    const patientsMap = new Map();

    appointments.forEach(appointment => {
      if (!appointment.patientId) return;
      
      const patient = appointment.patientId;
      const patientKey = patient._id.toString();

      if (!patientsMap.has(patientKey)) {
        patientsMap.set(patientKey, {
          _id: patient._id,
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.email,
          number: patient.number,
          location: patient.location,
          appointmentCount: 1,
          lastVisit: appointment.startDate
        });
      } else {
        const existing = patientsMap.get(patientKey);
        existing.appointmentCount += 1;
        if (new Date(appointment.startDate) > new Date(existing.lastVisit)) {
          existing.lastVisit = appointment.startDate;
        }
      }
    });

    const patientsList = Array.from(patientsMap.values());
    console.log(`Found ${patientsList.length} patients`);

    res.status(200).json(patientsList);
  } catch (error) {
    console.error('Error in getEmployeePatients:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch patients",
      error: error.message 
    });
  }
};

const addRemark = async (req, res) => {
  try {
    const { patientId, remark } = req.body;
    const employeeId = req.user.id;

    const newRemark = new Remark({
      patientId,
      employeeId,
      remark
    });

    await newRemark.save();
    res.status(201).json(newRemark);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getRemarks = async (req, res) => {
  try {
    const { patientId } = req.params;
    const remarks = await Remark.find({ patientId })
      .sort({ date: -1 });
    res.status(200).json(remarks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyTherapists = async (req, res) => {
  try {
    const patientId = req.user.id;
    console.log('Fetching therapists for patient:', patientId);

    const appointments = await Appointment.find({
      patientId,
      status: { $in: ['confirmed', 'completed', 'pending'] }
    }).populate('employeeId', 'firstName lastName serviceType location fee image');

    const therapistsMap = new Map();

    appointments.forEach(apt => {
      if (!apt.employeeId) return;
      
      const therapist = apt.employeeId;
      const therapistId = therapist._id.toString();

      if (!therapistsMap.has(therapistId)) {
        therapistsMap.set(therapistId, {
          ...therapist.toObject(),
          lastVisit: apt.startDate,
          appointmentCount: 1
        });
      } else {
        const existing = therapistsMap.get(therapistId);
        existing.appointmentCount += 1;
        if (new Date(apt.startDate) > new Date(existing.lastVisit)) {
          existing.lastVisit = apt.startDate;
        }
      }
    });

    const therapists = Array.from(therapistsMap.values());
    console.log(`Found ${therapists.length} therapists`);

    res.status(200).json(therapists);
  } catch (error) {
    console.error('Error in getMyTherapists:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch therapists",
      error: error.message 
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { employeeId, rating, comment } = req.body;
    const patientId = req.user.id;

    console.log('Adding review:', {
      patientId,
      employeeId,
      rating,
      comment
    });

    // Check if review already exists
    const existingReview = await Review.findOne({ patientId, employeeId });
    if (existingReview) {
      return res.status(400).json({ 
        success: false,
        message: "You have already reviewed this professional" 
      });
    }

    const review = new Review({
      patientId,
      employeeId,
      rating,
      comment,
      date: new Date()
    });

    const savedReview = await review.save();
    console.log('Review saved:', savedReview._id);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: savedReview
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Failed to submit review'
    });
  }
};

const getReview = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const patientId = req.user.id;

    const review = await Review.findOne({ 
      patientId, 
      employeeId 
    }).sort({ date: -1 });

    if (!review) {
      return res.status(404).json({ 
        message: "No review found" 
      });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ 
      message: "Failed to fetch review",
      error: error.message 
    });
  }
};

const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password');
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatePatientProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllPatients = async (req, res) => {
  try {
    console.log('Fetching all patients');
    const patients = await Patient.find()
      .select('-password')
      .sort({ createdAt: -1 });

    console.log(`Found ${patients.length} patients`);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch patients",
      error: error.message 
    });
  }
};

module.exports = { 
  register, 
  login, 
  getEmployeePatients,
  addRemark,
  getRemarks,
  getMyTherapists,
  addReview,
  getReview,
  getPatientProfile,
  updatePatientProfile,
  getAllPatients
};
