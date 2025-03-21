const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/EmployeeModel.js")
const Review = require('../models/ReviewModel.js');

const register = async (req, res) => {
  try {
    console.log(req.body)
    const { firstName, lastName, email, password, number, serviceType, description, experience, location, fee } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    // Update image path to be relative to uploads directory
    const image = req.file.filename;

    // Check if the user already exists
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new Employee({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      number,
      serviceType,
      description,
      experience,
      location,
      fee,
      image: image // Store just the filename
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await Employee.findOne({ email});
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getLocalities = async (req, res) => {
  try {
    const localities = await Employee.distinct('location');
    res.status(200).json(localities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getServiceTypes = async (req, res) => {
  try {
    const { location } = req.query;
    const serviceTypes = await Employee.distinct('serviceType', { location });
    res.status(200).json(serviceTypes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployees = async (req, res) => {
  try {
    const { location, serviceType } = req.query;
    const query = {};
    
    if (location) query.location = location;
    if (serviceType) query.serviceType = serviceType;
    
    console.log('Fetching employees with query:', query);

    const employees = await Employee.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    console.log('Found employees:', employees.length);

    if (!employees || employees.length === 0) {
      return res.status(200).json([]);
    }

    const employeesWithImageUrls = employees.map(emp => {
      const employee = emp.toObject();
      return {
        ...employee,
        image: employee.image // Keep the original image filename
      };
    });

    res.status(200).json(employeesWithImageUrls);
  } catch (error) {
    console.error('Error in getEmployees:', error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

const getEmployeeProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.user.id).select('-password');
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEmployeeProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route

    const employee = await Employee.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEmployeeReviews = async (req, res) => {
  try {
    const employeeId = req.user.id;
    console.log('Fetching reviews for employee:', employeeId); // Debug log

    const reviews = await Review.find({ employeeId })
      .populate('patientId', 'firstName lastName')
      .sort({ date: -1 });

    console.log(`Found ${reviews.length} reviews`); // Debug log
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error in getEmployeeReviews:', error); // Debug log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { register, login, getEmployees, getLocalities, getServiceTypes, getEmployeeProfile, updateEmployeeProfile, getEmployeeReviews };
