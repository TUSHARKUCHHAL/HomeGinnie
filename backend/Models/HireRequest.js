const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema({
  // User information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^\d{10}$/, 'Please enter a valid contact number']
  },
  
  // Service details
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  serviceDescription: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    minlength: [10, 'Please provide more details (at least 10 characters)']
  },
  
  // Location information
  address: {
    type: String,
    required: [true, 'Service location is required'],
    trim: true
  },
  
  // Timing preferences
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required'],
    validate: {
      validator: function(value) {
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Date cannot be in the past'
    }
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time slot is required'],
    trim: true
  },
  
  // Additional information
  additionalInfo: {
    type: String,
    trim: true
  },
  
  // Request status tracking
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: { createdAt: false, updatedAt: true } });

const HireRequest = mongoose.model('HireRequest', hireRequestSchema);

module.exports = HireRequest;