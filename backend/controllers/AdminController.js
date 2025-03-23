const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminModel.js');
const Appointment = require('../models/AppointmentModel.js');
const Employee = require('../models/EmployeeModel.js');
const Patient = require('../models/PatientModel.js');
const Review = require('../models/ReviewModel.js');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      console.log('Admin not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET
    );

    console.log('Login successful:', admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    console.log('Fetching analytics...');
    
    // Get total counts
    const totalAppointments = await Appointment.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalPatients = await Patient.countDocuments();

    // Get monthly appointments for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyAppointments = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Get service type distribution
    const serviceDistribution = await Employee.aggregate([
      {
        $group: {
          _id: "$serviceType",
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('Analytics data:', {
      monthlyAppointments,
      serviceDistribution,
      totalCounts: { totalAppointments, totalEmployees, totalPatients }
    });

    res.status(200).json({
      success: true,
      data: {
        monthlyAppointments,
        serviceDistribution,
        totalCounts: {
          appointments: totalAppointments,
          employees: totalEmployees,
          patients: totalPatients
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      totalPatients,
      totalAppointments,
      averageRating
    ] = await Promise.all([
      Employee.countDocuments(),
      Patient.countDocuments(),
      Appointment.countDocuments(),
      Review.aggregate([
        { $group: { 
          _id: null, 
          averageRating: { $avg: "$rating" } 
        }}
      ])
    ]);

    res.status(200).json({
      totalEmployees,
      totalPatients,
      totalAppointments,
      averageRating: averageRating[0]?.averageRating || 0
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard statistics' 
    });
  }
};

module.exports = { register, login, getAnalytics, getDashboardStats };
