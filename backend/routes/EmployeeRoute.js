const express = require('express');
const userRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
<<<<<<< HEAD
=======
const Employee = require('../models/EmployeeModel'); // Add this missing import
>>>>>>> f13231d (bot set)
const { 
  login, 
  register, 
  getEmployees, 
  getLocalities, 
  getServiceTypes, 
  getEmployeeProfile, 
  updateEmployeeProfile, 
  getEmployeeReviews,
  getMyPatients
} = require('../controllers/EmployeeController.js');
const authMiddleware = require('../middleware/authMiddleware');

// Ensure upload directories exist
['uploads/images', 'uploads/documents'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'image' ? 'uploads/images' : 'uploads/documents';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Create multer upload instance
const upload = multer({ storage }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'verificationDocument', maxCount: 1 }
]);

// Public routes
userRouter.get('/localities', getLocalities);
userRouter.get('/servicetypes', getServiceTypes);
userRouter.get('/fetch', async (req, res) => {
  try {
    await getEmployees(req, res);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ message: "Route error" });
  }
});

// Auth routes with file upload
userRouter.post('/register', (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      }
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }

      // Verify files were uploaded
      if (!req.files || !req.files.image || !req.files.verificationDocument) {
        return res.status(400).json({
          success: false,
          message: 'Both image and verification document are required'
        });
      }

      // Add file paths to request body
<<<<<<< HEAD
      req.body.image = '/' + req.files.image[0].path.replace(/\\/g, '/');
      req.body.verificationDocument = '/' + req.files.verificationDocument[0].path.replace(/\\/g, '/');
=======
      req.body.image = req.files.image[0].path.replace(/\\/g, '/');
      req.body.verificationDocument = req.files.verificationDocument[0].path.replace(/\\/g, '/');
>>>>>>> f13231d (bot set)

      console.log('Processed files:', {
        image: req.body.image,
        verificationDocument: req.body.verificationDocument
      });

      await register(req, res);
    } catch (error) {
      console.error('Registration route error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  });
});

userRouter.post('/login', login);

// Add new route for getting employee's patients
userRouter.get('/my-patients', authMiddleware, getMyPatients);

<<<<<<< HEAD
=======
// Add new route for profile image update
userRouter.put('/profile/image', authMiddleware, (req, res) => {
  const imageUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, 'uploads/images'),
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    }
  }).single('image');

  imageUpload(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'Image upload failed'
        });
      }

      // Verify file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Profile image is required'
        });
      }

      // Update employee record with new image
      const imagePath = req.file.path.replace(/\\/g, '/');
      
      console.log('Updating profile image:', imagePath);
      
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.user.id,
        { image: imagePath },
        { new: true }
      ).select('-password');

      if (!updatedEmployee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully',
        image: updatedEmployee.image
      });
    } catch (error) {
      console.error('Profile image update error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update profile image'
      });
    }
  });
});

>>>>>>> f13231d (bot set)
// Protected routes
userRouter.get('/profile', authMiddleware, getEmployeeProfile);
userRouter.put('/profile', authMiddleware, updateEmployeeProfile);
userRouter.get('/reviews', authMiddleware, getEmployeeReviews);

module.exports = userRouter;