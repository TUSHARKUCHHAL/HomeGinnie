const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  serviceCategory: {
    type: String,
    required: [true, 'Service category is required'],
    trim: true
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  about: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  imagePath: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp before saving
ServiceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', ServiceSchema);