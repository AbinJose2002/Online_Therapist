const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const employeeRoutes = require('./routes/EmployeeRoute');
const adminRoutes = require('./routes/AdminRoute');
const paymentRoutes = require('./routes/paymentRoutes');
const patientRoutes = require('./routes/PatientRoute');
const appointmentRoutes = require('./routes/appointmentRoutes');
const warningRoutes = require('./routes/warningRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

// Middleware for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer directories
const imageDir = 'uploads/images';
const documentDir = 'uploads/documents';
[imageDir, documentDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/warnings', warningRoutes); // Add warning routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
