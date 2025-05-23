// File: routes/userRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const { check, validationResult } = require('express-validator');
const User = require('../Models/User');
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);


// Configure Nodemailer with error handling
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS ,
    }
  })
  

// Auth middleware
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
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Registration validation
const validateRegistration = [
  check('firstName').notEmpty().withMessage('First name is required').trim(),
  check('lastName').notEmpty().withMessage('Last name is required').trim(),
  check('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  check('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  check('phoneNumber').notEmpty().withMessage('Phone number is required').trim(),
];

// @route   POST /register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
});

// @route   POST /login
// @desc    Authenticate a user & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
});


router.post("/auth/google", async (req, res, next) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400);
      throw new Error('Google token is required');
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({ 
      idToken: token, 
      audience: GOOGLE_CLIENT_ID 
    });
    
    const payload = ticket.getPayload();
    const { email, sub: googleId, name, picture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Better name handling
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Create new user if not exists
      user = new User({
        firstName,
        lastName,
        email,
        googleId,
        // Generate a random secure password for OAuth users
        password:" ",
        avatar: picture || 'default-avatar.png'
      });
      
      await user.save();
    } else if (!user.googleId) {
      // Link Google ID to existing account if not already linked
      user.googleId = googleId;
      await user.save();
    }
    
    // Generate JWT token using the existing function for consistency
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    next(error);
  }
});
  
  

// @route   GET /profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
});

// @route   PUT /profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
      user.alternateNumber = req.body.alternateNumber || user.alternateNumber;
      
      // Update address if provided
      if (req.body.address) {
        user.address = {
          ...user.address,
          ...req.body.address
        };
      }
      
      // Update password if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
});


// Middleware to validate email
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  // Middleware for error handling
  const handleError = (res, error, customMessage = "Server error") => {
    console.error(`❌ ${customMessage}:`, error)
    return res.status(500).json({ 
      message: customMessage, 
      error: error.message || error 
    })
  }
  
  
  router.post("/forgot-password", async (req, res) => {
    try {
      const { email } = req.body
      
      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" })
      }
  
      // Find user with proper error handling
      const user = await User.findOne({ email }).exec()
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
  
      // Generate tokens with stronger randomness
      const token = crypto.randomBytes(64).toString("hex")
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
        expiresIn: "1h" 
      })
  
      // Update user with reset tokens
      user.resetPasswordToken = token
      user.resetPasswordExpires = Date.now() + 3600000
      
      // Save with error handling
      try {
        await user.save()
      } catch (saveError) {
        return handleError(res, saveError, "Failed to save reset token")
      }
  
      const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request for Your Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
            </div>
            <h2 style="color: #333; margin-bottom: 15px;">Password Reset Request</h2>
            <p style="color: #555; line-height: 1.5;">Hello,</p>
            <p style="color: #555; line-height: 1.5;">We received a request to reset the password for your account. If you didn't make this request, you can safely ignore this email.</p>
            <div style="margin: 25px 0; text-align: center;">
              <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Your Password</a>
            </div>
            <p style="color: #555; line-height: 1.5;">This link will expire in 1 hour for security reasons.</p>
            <p style="color: #555; line-height: 1.5;">If the button above doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #f7f7f7; padding: 10px; border-radius: 3px; font-size: 14px;">${resetUrl}</p>
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; color: #777; font-size: 12px;">
              <p>If you didn't request this password reset, please contact our support team immediately at ${process.env.SUPPORT_EMAIL}.</p>
              <p>&copy; ${new Date().getFullYear()} ${process.env.COMPANY_NAME }. All rights reserved.</p>
            </div>
          </div>
        `
      };
  
      // Send email with comprehensive error handling
      try {
        await transporter.sendMail(mailOptions)
        res.json({ message: "Reset link sent to your email" })
      } catch (emailError) {
        return handleError(res, emailError, "Failed to send reset email")
      }
    } catch (error) {
      handleError(res, error)
    }
  })
  
  router.post("/reset-password/:token", async (req, res) => {
    try {
      const { token } = req.params
      const { newPassword } = req.body
  
      // Validate password strength
      if (newPassword.length < 8) {
        return res.status(400).json({ 
          message: "Password must be at least 8 characters long" 
        })
      }

  
      // Verify token with error handling
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
      } catch (tokenError) {
        return res.status(400).json({ message: "Invalid or expired token" })
      }
  
      // Find user with proper query
      const user = await User.findById(decoded.id).exec()
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }
  
          // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

      // Update user password
      user.password = hashedPassword
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
  
      // Save with error handling
      try {
        await user.save()
        res.json({ message: "Password reset successful" })
      } catch (saveError) {
        return handleError(res, saveError, "Failed to update password")
      }
    } catch (error) {
      handleError(res, error)
    }
  })
  
  



  // @route   GET /addresses
// @desc    Get all saved addresses for the user
// @access  Private
router.get('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format addresses to match frontend expectations
    const addresses = [];
    
    // Add home address if it exists
    if (user.addresses.home && user.addresses.home.street) {
      addresses.push({
        type: 'home',
        addressLine: user.addresses.home.street,
        city: user.addresses.home.city,
        pincode: user.addresses.home.postalCode,
        state: user.addresses.home.state,
        country: user.addresses.home.country,
        formattedAddress: `${user.addresses.home.street}, ${user.addresses.home.city}, ${user.addresses.home.state} - ${user.addresses.home.postalCode}`
      });
    }
    
    // Add work address if it exists
    if (user.addresses.work && user.addresses.work.street) {
      addresses.push({
        type: 'work',
        addressLine: user.addresses.work.street,
        city: user.addresses.work.city,
        pincode: user.addresses.work.postalCode,
        state: user.addresses.work.state,
        country: user.addresses.work.country,
        formattedAddress: `${user.addresses.work.street}, ${user.addresses.work.city}, ${user.addresses.work.state} - ${user.addresses.work.postalCode}`
      });
    }
    
    // Add other addresses if they exist
    if (user.addresses.others && user.addresses.others.length > 0) {
      // Add the first "other" address with type "other" to match frontend expectations
      const otherAddress = user.addresses.others[0];
      addresses.push({
        type: 'other',
        addressLine: otherAddress.street,
        city: otherAddress.city,
        pincode: otherAddress.postalCode,
        state: otherAddress.state,
        country: otherAddress.country,
        formattedAddress: `${otherAddress.street}, ${otherAddress.city}, ${otherAddress.state} - ${otherAddress.postalCode}`
      });
    }

    res.json(addresses);
  } catch (error) {
    console.error('Error retrieving addresses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /addresses
// @desc    Add or update a user address
// @access  Private
router.post('/addresses', protect, async (req, res) => {
  try {
    const { type, addressLine, city, pincode, state, landmark, formattedAddress } = req.body;
    
    if (!type || !addressLine || !city || !pincode || !state) {
      return res.status(400).json({ message: 'Please provide all required address fields' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize addresses object if it doesn't exist
    if (!user.addresses) {
      user.addresses = { home: {}, work: {}, others: [] };
    }
    
    // Create the address object
    const addressData = {
      street: addressLine,
      city,
      state,
      postalCode: pincode,
      country: 'India' // Default country
    };
    
    // Update the appropriate address based on type
    if (type === 'home') {
      user.addresses.home = addressData;
    } else if (type === 'work') {
      user.addresses.work = addressData;
    } else if (type === 'other') {
      // Check if we already have an "other" address
      if (user.addresses.others && user.addresses.others.length > 0) {
        // Update the first "other" address
        user.addresses.others[0] = addressData;
      } else {
        // Add a new "other" address
        user.addresses.others.push(addressData);
      }
    } else {
      return res.status(400).json({ message: 'Invalid address type. Must be home, work, or other.' });
    }
    
    // Save the updated user
    await user.save();
    
    // Return the formatted address that matches frontend expectations
    res.status(201).json({
      type,
      addressLine,
      city,
      pincode,
      state,
      landmark: landmark || '',
      formattedAddress: formattedAddress || `${addressLine}, ${city}, ${state} - ${pincode}${landmark ? `, Near ${landmark}` : ''}`
    });
  } catch (error) {
    console.error('Error saving address:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /addresses/:type
// @desc    Delete a user address
// @access  Private
router.delete('/addresses/:type', protect, async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['home', 'work', 'other'].includes(type)) {
      return res.status(400).json({ message: 'Invalid address type. Must be home, work, or other.' });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove the specified address
    if (type === 'home') {
      user.addresses.home = {};
    } else if (type === 'work') {
      user.addresses.work = {};
    } else if (type === 'other' && user.addresses.others && user.addresses.others.length > 0) {
      user.addresses.others = [];
    }
    
    // Save the updated user
    await user.save();
    
    res.json({ message: `${type} address deleted successfully` });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;