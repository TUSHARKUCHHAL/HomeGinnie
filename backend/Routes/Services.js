const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Service = require('../Models/Services');

// Define a single consistent path for uploads
const UPLOAD_DIR = 'uploads/services';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Create directory if it doesn't exist
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'service-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services'
    });
  }
});

// GET a single service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service'
    });
  }
});

// POST create a new service with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { serviceCategory, serviceName, about } = req.body;
    
    // Create new service
    const newService = new Service({
      serviceCategory,
      serviceName,
      about,
      imagePath: req.file ? `${UPLOAD_DIR}/${req.file.filename}` : null
    });
    
    // Save to database
    await newService.save();
    
    res.status(201).json({
      success: true,
      data: newService,
      message: 'Service created successfully'
    });
  } catch (error) {
    console.error('Error creating service:', error);
    
    // Remove uploaded file if there was an error saving to DB
    if (req.file) {
      fs.unlink(path.join(UPLOAD_DIR, req.file.filename), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating service'
    });
  }
});

// PUT update a service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { serviceCategory, serviceName, about } = req.body;
    
    // Find service by ID
    let service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Update service fields
    service.serviceCategory = serviceCategory;
    service.serviceName = serviceName;
    service.about = about;
    
    // If a new image was uploaded, update the image path and delete old image
    if (req.file) {
      // Delete old image if it exists
      if (service.imagePath) {
        try {
          fs.unlinkSync(service.imagePath);
        } catch (err) {
          console.error('Error deleting old image:', err);
          // Continue execution even if file deletion fails
        }
      }
      
      // Update with new image path
      service.imagePath = `${UPLOAD_DIR}/${req.file.filename}`;
    }
    
    // Save updated service
    await service.save();
    
    res.status(200).json({
      success: true,
      data: service,
      message: 'Service updated successfully'
    });
  } catch (error) {
    console.error('Error updating service:', error);
    
    // Remove uploaded file if there was an error saving to DB
    if (req.file) {
      fs.unlink(path.join(UPLOAD_DIR, req.file.filename), (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating service'
    });
  }
});

// DELETE a service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Delete associated image file if it exists
    if (service.imagePath) {
      try {
        fs.unlinkSync(service.imagePath);
      } catch (err) {
        console.error('Error deleting image file:', err);
        // Continue execution even if file deletion fails
      }
    }
    
    // Remove from database
    await Service.deleteOne({ _id: req.params.id });
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service'
    });
  }
});

module.exports = router;