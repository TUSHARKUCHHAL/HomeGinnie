const mongoose = require('mongoose');

// Message schema for communication
const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'serviceProvider'],
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

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
  
  // User association
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User details
  userDetails: {
    firstName: String,
    lastName: String,
    email: String
  },
  
  // Service provider association
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider'
  },
  
  // Service provider details
  serviceProviderDetails: {
    name: String,
    email: String,
    phone: String
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Additional timestamps for tracking job progress
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  
  // Communication between user and service provider
  messages: [messageSchema],
  
  // Payment and rating information (optional)
  payment: {
    amount: Number,
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    paymentMethod: String
  },
  
  // Rating and review (after completion)
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    givenAt: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HireRequest', hireRequestSchema);