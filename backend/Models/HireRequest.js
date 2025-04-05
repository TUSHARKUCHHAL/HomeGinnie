const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema({
  // Original fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Service location is required'],
    trim: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    trim: true
  },
  serviceDescription: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required'],
    trim: true
  },
  additionalInfo: {
    type: String,
    trim: true
  },
  
  // New fields for user association
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Optional: Store some user details directly in the request for easier access
  userDetails: {
    firstName: String,
    lastName: String,
    email: String
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HireRequest', hireRequestSchema);