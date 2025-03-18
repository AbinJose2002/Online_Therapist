const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/PatientModel.js");

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

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user._id, user.email);
        console.log(token)
        res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { register, login };
