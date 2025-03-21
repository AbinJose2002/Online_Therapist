const Appointment = require("../models/AppointmentModel.js");
const Employee = require("../models/EmployeeModel.js");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createAppointment = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, timeSlot, paymentIntentId } = req.body;
    const patientId = req.user.id;

    console.log('Creating appointment:', {
      patientId,
      employeeId,
      startDate,
      endDate,
      timeSlot,
      paymentIntentId
    });

    const newAppointment = new Appointment({
      patientId,
      employeeId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : new Date(startDate),
      timeSlot,
      paymentId: paymentIntentId,
      status: 'pending'
    });

    const savedAppointment = await newAppointment.save();
    console.log('Saved appointment:', savedAppointment._id);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      appointment: savedAppointment
    });
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const { serviceType } = req.query;
    const query = serviceType ? { serviceType } : {};
    const employees = await Employee.find(query).select('-password');
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('employeeId', 'firstName lastName serviceType')
      .sort({ startDate: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployeeAppointments = async (req, res) => {
  try {
    const employeeId = req.user.id;
    
    // Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      employeeId,
      startDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .populate('patientId', 'firstName lastName email number')
    .sort({ timeSlot: 1 }); // Sort by time slot

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const employeeId = req.user.id;

    const appointment = await Appointment.findOneAndUpdate(
      { 
        _id: appointmentId,
        employeeId,
        status: 'pending' // Only update if status is pending
      },
      { status: 'confirmed' },
      { new: true } // Return updated document
    ).populate('patientId', 'firstName lastName email number');

    if (!appointment) {
      return res.status(404).json({ 
        message: "Appointment not found or already processed" 
      });
    }

    res.status(200).json({ 
      message: "Appointment confirmed successfully", 
      appointment 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getBookedSlots = async (req, res) => {
  try {
    const { employeeId, date } = req.query;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all appointments that are weekly and current date falls within their range
    const weeklyAppointments = await Appointment.find({
      employeeId,
      startDate: { $lte: endOfDay },
      endDate: { $gte: startOfDay },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Find single day appointments for the specific date
    const dailyAppointments = await Appointment.find({
      employeeId,
      startDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      endDate: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Combine all booked time slots
    const bookedSlots = [...weeklyAppointments, ...dailyAppointments].map(apt => apt.timeSlot);
    
    res.status(200).json([...new Set(bookedSlots)]); // Remove duplicates
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  createAppointment, 
  getEmployees, 
  getPatientAppointments,
  getEmployeeAppointments,
  acceptAppointment,
  getBookedSlots 
};
