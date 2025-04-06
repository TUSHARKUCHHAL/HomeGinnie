const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
  heading: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  media: {
    type: String,
    trim: true,
    // URL to image or video content
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const paymentDetailsSchema = new Schema({
  accountHolder: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    trim: true
  },
  bankName: {
    type: String,
    trim: true
  },
  ifscCode: {
    type: String,
    trim: true
  },
  upiId: {
    type: String,
    trim: true
  },
  preferredPaymentMethod: {
    type: String,
    enum: ['bank', 'upi', 'cash'],
    default: 'bank'
  }
});

const serviceProviderSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password should be at least 8 characters long']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  alternateNumber: {
    type: String,
    trim: true
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    }
  },
  services: [{
    type: String,
    trim: true
  }],
  experience: {
    years: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      trim: true
    }
  },
  about: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  paymentDetails: paymentDetailsSchema,
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  feedback: [feedbackSchema],
  gennieCoins: {
    type: Number,
    default: 0
  },
  profileImage: {
    type: String,
    default: 'default-profile.jpg'
  },
  declinedRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HireRequest'
  }],
  serviceRadius: {
    type: Number,
    default: 25  // in miles or km
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);

module.exports = ServiceProvider;