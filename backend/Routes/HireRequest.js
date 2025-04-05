const express = require('express');
const router = express.Router();
const HireRequest = require('../Models/HireRequest');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
// Auth middleware - copied from userRoutes.js for consistency
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

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

// POST - Create a new hire request (protected route)
router.post('/hire-requests', protect, validateHireRequest, async (req, res) => {
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
    console.log('Authenticated user:', req.user);

    // Create new hire request with user information
    const newHireRequest = new HireRequest({
      name: req.body.name,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      address: req.body.address,
      serviceType: req.body.serviceType,
      serviceDescription: req.body.serviceDescription,
      preferredDate: new Date(req.body.preferredDate),
      preferredTime: req.body.preferredTime,
      additionalInfo: req.body.additionalInfo || '',
      // Add user reference
      user: req.user._id,
      // You can also add specific user details if needed
      userDetails: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email
      }
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

// GET - Get all hire requests (admin route, still protected)
router.get('/hire-requests', protect, async (req, res) => {
  try {
    
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required'
      });
    }
  
    
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

// GET - Get authenticated user's hire requests
router.get('/my-hire-requests', protect, async (req, res) => {
  try {
    const hireRequests = await HireRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: hireRequests.length,
      data: hireRequests
    });
  } catch (error) {
    console.error('Error fetching user hire requests:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching your hire requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Get a specific hire request by ID (with owner or admin check)
router.get('/hire-requests/:id', protect, async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.id);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found'
      });
    }
    
    // Check if the request belongs to the authenticated user
    // Or alternatively, check if the user is an admin
    if (hireRequest.user && hireRequest.user.toString() !== req.user._id.toString()) {
      // Optional: Check if admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This hire request does not belong to you'
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: hireRequest
    });
  } catch (error) {
    console.error('Error fetching hire request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the hire request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT - Update a hire request (with owner check)
router.put('/hire-requests/:id', protect, async (req, res) => {
  try {
    let hireRequest = await HireRequest.findById(req.params.id);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found'
      });
    }
    
    // Check if the request belongs to the authenticated user
    if (hireRequest.user && hireRequest.user.toString() !== req.user._id.toString()) {
      // Optional: Check if admin
      // if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This hire request does not belong to you'
        });
      // }
    }
    
    // Update the request
    hireRequest = await HireRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: hireRequest
    });
  } catch (error) {
    console.error('Error updating hire request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the hire request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE - Delete a hire request (with owner check)
router.delete('/hire-requests/:id', protect, async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.id);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Hire request not found'
      });
    }
    
    // Check if the request belongs to the authenticated user
    if (hireRequest.user && hireRequest.user.toString() !== req.user._id.toString()) {
      // Optional: Check if admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. This hire request does not belong to you'
        });
      }
    }
    
    await hireRequest.remove();
    
    res.status(200).json({
      success: true,
      message: 'Hire request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting hire request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the hire request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;