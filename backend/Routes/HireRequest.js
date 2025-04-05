const express = require('express');
const router = express.Router();
const HireRequest = require('../Models/HireRequest');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateHireRequest = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address'),
  
  body('contactNumber')
    .trim()
    .matches(/^\d{10}$/)
    .withMessage('Please enter a valid contact number'),
  
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Service location is required'),
  
  body('serviceType')
    .trim()
    .notEmpty()
    .withMessage('Service type is required'),
  
  body('serviceDescription')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Please provide more details (at least 10 characters)'),
  
  body('preferredDate')
    .custom(value => {
      try {
        // Check if it's a valid date
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        
        // Check if date is in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
          throw new Error('Date cannot be in the past');
        }
        return true;
      } catch (error) {
        throw new Error('Invalid date format or date is in the past');
      }
    }),
  
  body('preferredTime')
    .trim()
    .notEmpty()
    .withMessage('Please select a preferred time slot')
];

// POST - Create a new hire request
router.post('/hire-requests', validateHireRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    // Log the received data for debugging
    console.log('Received hire request data:', req.body);

    // Create new hire request
    const newHireRequest = new HireRequest({
      name: req.body.name,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      serviceType: req.body.serviceType,
      serviceDescription: req.body.serviceDescription,
      preferredDate: new Date(req.body.preferredDate), // Ensure proper date conversion
      preferredTime: req.body.preferredTime,
      additionalInfo: req.body.additionalInfo || ''
      
    });

    // Save to database
    const savedRequest = await newHireRequest.save();

    // Return success response with request ID
    res.status(201).json({
      success: true,
      message: 'Service request submitted successfully',
      requestId: savedRequest._id,
      data: savedRequest
    });
  } catch (error) {
    console.error('Error creating hire request:', error);
    
    // Check if it's a MongoDB validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        param: err.path,
        msg: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Get all hire requests (could be used for admin dashboard)
router.get('/hire-requests', async (req, res) => {
  try {
    const hireRequests = await HireRequest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: hireRequests.length,
      data: hireRequests
    });
  } catch (error) {
    console.error('Error fetching hire requests:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching hire requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Other routes remain unchanged
module.exports = router;