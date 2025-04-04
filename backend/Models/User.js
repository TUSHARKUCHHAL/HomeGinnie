// userSchema.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const discountCouponSchema = new Schema({
  code: {
    type: String,
    required: false,
    unique: false,
    trim: true
  },
  discountPercentage: {
    type: Number,
    required: false,
    min: 0,
    max: 100
  },
  maxDiscountAmount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: false
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new Schema({
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
    required: [false, 'Password is required'],
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  googleId: {
    type: String,
    sparse: true
  },
  phoneNumber: {
    type: String,
    trim: true,
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
  discountCoupons: [discountCouponSchema],
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

const User = mongoose.model('User', userSchema);
module.exports = User;