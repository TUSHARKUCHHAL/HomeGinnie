const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const ServiceProvider = require('../Models/ServiceProvider');
// At the top of your main server file (app.js or server.js)
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Auth middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.serviceProvider = await ServiceProvider.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Then modify your generateToken function to use this variable
const generateToken = (id) => {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: '30d',
    });
  };

// Registration validation
const validateServiceProviderRegistration = [
  check('firstName').notEmpty().withMessage('First name is required').trim(),
  check('lastName').notEmpty().withMessage('Last name is required').trim(),
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  check('phoneNumber').notEmpty().withMessage('Phone number is required').trim(),
  check('address.street').notEmpty().withMessage('Street address is required'),
  check('address.city').notEmpty().withMessage('City is required'),
  check('address.state').notEmpty().withMessage('State is required'),
  check('address.postalCode').notEmpty().withMessage('Postal code is required'),
  check('services').isArray({ min: 1 }).withMessage('At least one service must be selected'),
  check('yearsOfExperience').isNumeric().withMessage('Years of experience must be a number'),
];

// @route   POST /register
// @desc    Register a new service provider
// @access  Public
router.post('/register', validateServiceProviderRegistration, async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phoneNumber, 
      alternateNumber,
      address,
      services,
      yearsOfExperience,
      experienceDescription,
      about
    } = req.body;

    // Check if service provider exists
    const providerExists = await ServiceProvider.findOne({ email });
    if (providerExists) {
      return res.status(400).json({ message: 'Service provider with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create service provider
    const serviceProvider = await ServiceProvider.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      alternateNumber,
      address,
      services,
      experience: {
        years: yearsOfExperience,
        description: experienceDescription
      },
      about,
      status: 'pending' // Default status is pending for admin approval
    });

    if (serviceProvider) {
      res.status(201).json({
        _id: serviceProvider._id,
        firstName: serviceProvider.firstName,
        lastName: serviceProvider.lastName,
        email: serviceProvider.email,
        role: 'service-provider',
        status: serviceProvider.status,
        token: generateToken(serviceProvider._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid service provider data');
    }
  } catch (error) {
    console.error('Service provider registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /login
// @desc    Authenticate a service provider & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for service provider email
    const serviceProvider = await ServiceProvider.findOne({ email });

    if (!serviceProvider) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (!serviceProvider.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated. Please contact support.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, serviceProvider.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return service provider data with token
    res.json({
      _id: serviceProvider._id,
      firstName: serviceProvider.firstName,
      lastName: serviceProvider.lastName,
      email: serviceProvider.email,
      role: 'service-provider',
      status: serviceProvider.status,
      token: generateToken(serviceProvider._id)
    });
  } catch (error) {
    console.error('Service provider login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
});

// @route   GET /profile
// @desc    Get service provider profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.serviceProvider._id).select('-password');
    
    if (serviceProvider) {
      res.json(serviceProvider);
    } else {
      res.status(404).json({ message: 'Service provider not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: error.message || 'Server error while fetching profile' });
  }
});

// @route   PUT /profile
// @desc    Update service provider profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.serviceProvider._id);

    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    // Update basic info
    serviceProvider.firstName = req.body.firstName || serviceProvider.firstName;
    serviceProvider.lastName = req.body.lastName || serviceProvider.lastName;
    serviceProvider.email = req.body.email || serviceProvider.email;
    serviceProvider.phoneNumber = req.body.phoneNumber || serviceProvider.phoneNumber;
    serviceProvider.alternateNumber = req.body.alternateNumber || serviceProvider.alternateNumber;
    serviceProvider.about = req.body.about || serviceProvider.about;
    
    // Update services if provided
    if (req.body.services && Array.isArray(req.body.services)) {
      serviceProvider.services = req.body.services;
    }
    
    // Update experience if provided
    if (req.body.yearsOfExperience || req.body.experienceDescription) {
      serviceProvider.experience = {
        years: req.body.yearsOfExperience || serviceProvider.experience.years,
        description: req.body.experienceDescription || serviceProvider.experience.description
      };
    }
    
    // Update address if provided
    if (req.body.address) {
      serviceProvider.address = {
        ...serviceProvider.address,
        ...req.body.address
      };
    }
    
    // Update payment details if provided
    if (req.body.paymentDetails) {
      serviceProvider.paymentDetails = {
        ...serviceProvider.paymentDetails,
        ...req.body.paymentDetails
      };
    }
    
    // Update password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      serviceProvider.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedServiceProvider = await serviceProvider.save();

    res.json({
      _id: updatedServiceProvider._id,
      firstName: updatedServiceProvider.firstName,
      lastName: updatedServiceProvider.lastName,
      email: updatedServiceProvider.email,
      role: 'service-provider',
      status: updatedServiceProvider.status,
      token: generateToken(updatedServiceProvider._id)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message || 'Server error while updating profile' });
  }
});

// @route   GET /book-a-pro
// @desc    Get service provider dashboard data
// @access  Private
router.get('/book-a-pro', protect, async (req, res, next) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.serviceProvider._id).select('-password');
    
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    
    // You can add more complex dashboard data aggregation here
    // For example, fetching bookings, earnings, etc.
    
    res.json({
      provider: serviceProvider,
      stats: {
        rating: serviceProvider.rating,
        feedbackCount: serviceProvider.feedback.length,
        gennieCoins: serviceProvider.gennieCoins
        // Add more dashboard stats as needed
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: error.message || 'Server error while fetching dashboard data' });
  }
});

module.exports = router;