const express = require('express');
const router = express.Router();
const HireRequest = require('../Models/HireRequest');
const ServiceProvider = require('../Models/ServiceProvider');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// Auth middleware for service providers
const protectServiceProvider = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find service provider instead of user
      req.serviceProvider = await ServiceProvider.findById(decoded.id).select('-password');
      
      if (!req.serviceProvider) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized as service provider'
        });
      }
      
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

// GET - Get all pending requests that match service provider's skills
router.get('/available-requests', protectServiceProvider, async (req, res) => {
    try {
      // Get service provider's services
      const serviceTypes = req.serviceProvider.services;
      
      // Find all hire requests with pending status that match service provider's skills
      const availableRequests = await HireRequest.find({
        status: 'pending',
        // Don't show requests that the provider has already declined
        _id: { $nin: req.serviceProvider.declinedRequests || [] }
      }).sort({ createdAt: -1 });
      
      // Add default customer name if missing
      const requestsWithName = availableRequests.map(request => {
        if (!request.name && request.userId) {
          return { ...request.toObject(), name: "Customer" };
        }
        return request;
      });
      
      res.status(200).json({
        success: true,
        count: requestsWithName.length,
        data: requestsWithName
      });
    } catch (error) {
      console.error('Error fetching pending hire requests:', error);
      res.status(500).json({
        success: false,
        message: 'An error occurred while fetching pending requests',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

// POST - Accept a hire request
router.post('/accept-request/:requestId', protectServiceProvider, async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Check if request is still pending
    if (hireRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This request is no longer available'
      });
    }
    
    // Update the hire request with service provider info and change status
    hireRequest.serviceProvider = req.serviceProvider._id;
    hireRequest.serviceProviderDetails = {
      name: req.serviceProvider.name,
      email: req.serviceProvider.email,
      phone: req.serviceProvider.phone
    };
    hireRequest.status = 'confirmed';
    hireRequest.acceptedAt = Date.now();
    hireRequest.price = req.body.price ; // Optional price field
    
    const updatedRequest = await hireRequest.save();
    
    // Send response with updated request data
    res.status(200).json({
      success: true,
      message: 'Request accepted successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error accepting request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while accepting the request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST - Decline a hire request
router.post('/decline-request/:requestId', protectServiceProvider, async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Add request ID to service provider's declined requests
    await ServiceProvider.findByIdAndUpdate(req.serviceProvider._id, {
      $addToSet: { declinedRequests: hireRequest._id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Request declined'
    });
  } catch (error) {
    console.error('Error declining request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while declining the request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Get service provider's active jobs
router.get('/active-jobs', protectServiceProvider, async (req, res) => {
  try {
    // Find hire requests assigned to this service provider
    const activeJobs = await HireRequest.find({
      serviceProvider: req.serviceProvider._id,
      status: { $in: ['confirmed', 'in-progress'] }
    }).sort({ preferredDate: 1 });
    
    res.status(200).json({
      success: true,
      count: activeJobs.length,
      data: activeJobs
    });
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching active jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH - Update job status (in-progress, completed)
router.patch('/update-job-status/:requestId', protectServiceProvider, [
  body('status')
    .isIn(['in-progress', 'completed'])
    .withMessage('Invalid status value')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { status } = req.body;
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if this job belongs to the service provider
    if (hireRequest.serviceProvider.toString() !== req.serviceProvider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }
    
    // Validate status transition
    if (status === 'in-progress' && hireRequest.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Can only start confirmed jobs'
      });
    }
    
    if (status === 'completed' && hireRequest.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete in-progress jobs'
      });
    }
    
    // Update status and timestamps
    hireRequest.status = status;
    if (status === 'in-progress') {
      hireRequest.startedAt = Date.now();
    } else if (status === 'completed') {
      hireRequest.completedAt = Date.now();
    }
    
    const updatedJob = await hireRequest.save();
    
    res.status(200).json({
      success: true,
      message: `Job marked as ${status}`,
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the job status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// GET - Get service provider's job history (completed jobs)
router.get('/job-history', protectServiceProvider, async (req, res) => {
  try {
    // Find completed hire requests assigned to this service provider
    const completedJobs = await HireRequest.find({
      serviceProvider: req.serviceProvider._id,
      status: 'completed'
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: completedJobs.length,
      data: completedJobs
    });
  } catch (error) {
    console.error('Error fetching job history:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching job history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


// POST - Decline a hire request
router.post('/decline-request/:requestId', protectServiceProvider, async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }
    
    // Add request ID to service provider's declined requests
    await ServiceProvider.findByIdAndUpdate(req.serviceProvider._id, {
      $addToSet: { declinedRequests: hireRequest._id }
    });
    
    res.status(200).json({
      success: true,
      message: 'Request declined'
    });
  } catch (error) {
    console.error('Error declining request:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while declining the request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH - Update job status (in-progress, completed)
router.patch('/update-job-status/:requestId', protectServiceProvider, [
  body('status')
    .isIn(['in-progress', 'completed'])
    .withMessage('Invalid status value')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { status } = req.body;
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if this job belongs to the service provider
    if (hireRequest.serviceProvider.toString() !== req.serviceProvider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }
    
    // Validate status transition
    if (status === 'in-progress' && hireRequest.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Can only start confirmed jobs'
      });
    }
    
    if (status === 'completed' && hireRequest.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete in-progress jobs'
      });
    }
    
    // Update status and timestamps
    hireRequest.status = status;
    if (status === 'in-progress') {
      hireRequest.startedAt = Date.now();
    } else if (status === 'completed') {
      hireRequest.completedAt = Date.now();
    }
    
    const updatedJob = await hireRequest.save();
    
    res.status(200).json({
      success: true,
      message: `Job marked as ${status}`,
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the job status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST - Add a message to a job
router.post('/add-message/:requestId', protectServiceProvider, [
  body('message')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Message cannot be empty')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { message } = req.body;
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    // Check if this job belongs to the service provider
    if (hireRequest.serviceProvider && 
        hireRequest.serviceProvider.toString() !== req.serviceProvider._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to message on this job'
      });
    }
    
    // Initialize messages array if it doesn't exist
    if (!hireRequest.messages) {
      hireRequest.messages = [];
    }
    
    // Add new message
    hireRequest.messages.push({
      sender: 'serviceProvider',
      senderId: req.serviceProvider._id,
      senderName: req.serviceProvider.name,
      message: message,
      timestamp: Date.now()
    });
    
    const updatedJob = await hireRequest.save();
    
    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      data: updatedJob.messages[updatedJob.messages.length - 1]
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while adding your message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET - Get dashboard stats for service provider
router.get('/dashboard-stats', protectServiceProvider, async (req, res) => {
  try {
    // Get counts for different job statuses
    const activeJobs = await HireRequest.countDocuments({
      serviceProvider: req.serviceProvider._id,
      status: { $in: ['confirmed', 'in-progress'] }
    });
    
    const completedJobs = await HireRequest.countDocuments({
      serviceProvider: req.serviceProvider._id,
      status: 'completed'
    });
    
    // Available requests matching service provider's skills
    const serviceTypes = req.serviceProvider.services;
    const newRequests = await HireRequest.countDocuments({
      serviceType: { $in: serviceTypes },
      status: 'pending',
      _id: { $nin: req.serviceProvider.declinedRequests || [] }
    });
    
    // Get weekly earnings if you have payment tracking
    // This is a simplified version
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentCompletedJobs = await HireRequest.find({
      serviceProvider: req.serviceProvider._id,
      status: 'completed',
      completedAt: { $gte: oneWeekAgo }
    });
    
    // Calculate completion rate
    const totalAssignedJobs = await HireRequest.countDocuments({
      serviceProvider: req.serviceProvider._id
    });
    
    const completionRate = totalAssignedJobs > 0 
      ? (completedJobs / totalAssignedJobs * 100).toFixed(1) 
      : 0;
    
    res.status(200).json({
      success: true,
      data: {
        activeJobs,
        newRequests, 
        completedJobs,
        totalAssignedJobs,
        completionRate,
        recentCompletedJobs: recentCompletedJobs.length
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PATCH - Toggle service provider availability status
router.patch('/toggle-availability', protectServiceProvider, [
  body('isAvailable')
    .isBoolean()
    .withMessage('isAvailable must be a boolean value')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }
    
    const { isAvailable } = req.body;
    
    // Update service provider availability
    const serviceProvider = await ServiceProvider.findByIdAndUpdate(
      req.serviceProvider._id,
      { isAvailable },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: `Status updated to ${isAvailable ? 'available' : 'unavailable'}`,
      data: {
        isAvailable: serviceProvider.isAvailable
      }
    });
  } catch (error) {
    console.error('Error updating availability status:', error);
    res.status(500).json({
      success: false, 
      message: 'An error occurred while updating your availability status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;