const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const ShopOwner = require('../Models/Shops');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Configure Nodemailer with error handling
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/shops';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `shop-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Improved Auth middleware with proper error handling
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const shopOwner = await ShopOwner.findById(decoded.id).select('-password');
        
        if (!shopOwner) {
          return res.status(401).json({ message: 'User not found, please login again' });
        }
        
        req.shopOwner = shopOwner;
        next();
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token, please login again' });
      }
    } else {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Registration validation
const validateShopRegistration = [
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
  check('address.street').notEmpty().withMessage('Street address is required').trim(),
  check('address.city').notEmpty().withMessage('City is required').trim(),
  check('address.state').notEmpty().withMessage('State is required').trim(),
  check('address.postalCode').notEmpty().withMessage('Postal code is required').trim(),
  check('address.country').notEmpty().withMessage('Country is required').trim(),
  check('shopDetails.shopType').notEmpty().withMessage('Shop type is required').trim(),
];

// @route   POST /register
// @desc    Register a new shop owner
// @access  Public
router.post('/register', upload.single('logo'), async (req, res) => {
  try {
    // If request contains JSON in 'data' field
    let shopOwnerData;
    if (req.body.data) {
      shopOwnerData = JSON.parse(req.body.data);
    } else {
      shopOwnerData = req.body;
    }

    const { firstName, lastName, email, password, confirmPassword, phoneNumber, alternateNumber, address, shopDetails } = shopOwnerData;

    // Manual validation (since express-validator doesn't work well with multer)
    if (!firstName || !lastName || !email || !password || !phoneNumber || 
        !address.street || !address.city || !address.state || 
        !address.postalCode || !address.country || !shopDetails.shopType) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password should be at least 8 characters long' });
    }

    if (!/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      return res.status(400).json({ 
        message: 'Password must contain at least one number, one lowercase and one uppercase letter' 
      });
    }

    // Check if shop owner exists
    const shopOwnerExists = await ShopOwner.findOne({ email });
    if (shopOwnerExists) {
      return res.status(400).json({ message: 'Shop owner account already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare logo path
    const logoPath = req.file ? `/${req.file.path}` : null;

    // Create shop owner
    const shopOwner = await ShopOwner.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      alternateNumber: alternateNumber || '',
      address,
      shopDetails: {
        shopType: shopDetails.shopType,
        logo: logoPath,
        gstNumber: shopDetails.gstNumber || '',
        deliveryProvided: shopDetails.deliveryProvided || false,
        establishedDate: shopDetails.establishedDate || new Date(),
        businessHours: shopDetails.businessHours || {},
      },
      profileComplete: true
    });

    if (shopOwner) {
      res.status(201).json({
        _id: shopOwner._id,
        firstName: shopOwner.firstName,
        lastName: shopOwner.lastName,
        email: shopOwner.email,
        role: 'shop-owner',
        token: generateToken(shopOwner._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid shop owner data' });
    }
  } catch (error) {
    if (req.file) {
      // Remove uploaded file if there was an error
      fs.unlinkSync(req.file.path);
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /login
// @desc    Authenticate a shop owner & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for shop owner email
    const shopOwner = await ShopOwner.findOne({ email });

    if (!shopOwner) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, shopOwner.password);
    
    if (isMatch) {
      res.json({
        _id: shopOwner._id,
        firstName: shopOwner.firstName,
        lastName: shopOwner.lastName,
        email: shopOwner.email,
        role: 'shop-owner',
        token: generateToken(shopOwner._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /me
// @desc    Get logged-in shop owner profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    // req.shopOwner is already populated in the protect middleware
    res.json(req.shopOwner);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error when retrieving profile' });
  }
});

// @route   PUT /me
// @desc    Update shop owner profile
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      alternateNumber,
      address,
      shopDetails
    } = req.body;

    // Build profile object
    const profileFields = {};
    if (firstName) profileFields.firstName = firstName;
    if (lastName) profileFields.lastName = lastName;
    if (phoneNumber) profileFields.phoneNumber = phoneNumber;
    if (alternateNumber !== undefined) profileFields.alternateNumber = alternateNumber;
    
    // Build address object
    if (address) {
      profileFields.address = {};
      if (address.street) profileFields.address.street = address.street;
      if (address.city) profileFields.address.city = address.city;
      if (address.state) profileFields.address.state = address.state;
      if (address.postalCode) profileFields.address.postalCode = address.postalCode;
      if (address.country) profileFields.address.country = address.country;
    }
    
    // Build shop details object
    if (shopDetails) {
      // Get existing shop details to prevent overriding fields not in the request
      const currentShop = await ShopOwner.findById(req.shopOwner._id);
      profileFields.shopDetails = currentShop.shopDetails || {};
      
      if (shopDetails.gstNumber !== undefined) 
        profileFields.shopDetails.gstNumber = shopDetails.gstNumber;
      if (shopDetails.shopType) 
        profileFields.shopDetails.shopType = shopDetails.shopType;
      if (shopDetails.deliveryProvided !== undefined) 
        profileFields.shopDetails.deliveryProvided = shopDetails.deliveryProvided;
      if (shopDetails.establishedDate) 
        profileFields.shopDetails.establishedDate = shopDetails.establishedDate;
      if (shopDetails.businessHours) 
        profileFields.shopDetails.businessHours = shopDetails.businessHours;
    }

    // Set profileComplete to true if all required fields are filled
    if (firstName && lastName && phoneNumber && 
        address && address.street && address.city && address.state && 
        profileFields.shopDetails && profileFields.shopDetails.shopType) {
      profileFields.profileComplete = true;
    }

    // Update the profile
    const shopOwner = await ShopOwner.findByIdAndUpdate(
      req.shopOwner._id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    
    if (!shopOwner) {
      return res.status(404).json({ message: 'Shop owner not found' });
    }
    
    res.json(shopOwner);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error when updating profile' });
  }
});

// @route   PUT /avatar
// @desc    Update profile picture
// @access  Private
router.put('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    
    const avatarPath = `/${req.file.path}`;
    
    const shopOwner = await ShopOwner.findByIdAndUpdate(
      req.shopOwner._id,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');
    
    if (!shopOwner) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Shop owner not found' });
    }
    
    res.json(shopOwner);
  } catch (err) {
    if (req.file) {
      // Remove uploaded file if there was an error
      fs.unlinkSync(req.file.path);
    }
    console.error('Avatar update error:', err.message);
    res.status(500).json({ message: 'Server error when updating avatar' });
  }
});

// @route   PUT /shop-logo
// @desc    Update shop logo
// @access  Private
router.put('/shop-logo', protect, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }
    
    const logoPath = `/${req.file.path}`;
    
    const shopOwner = await ShopOwner.findByIdAndUpdate(
      req.shopOwner._id,
      { 'shopDetails.logo': logoPath },
      { new: true }
    ).select('-password');
    
    if (!shopOwner) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Shop owner not found' });
    }
    
    res.json(shopOwner);
  } catch (err) {
    if (req.file) {
      // Remove uploaded file if there was an error
      fs.unlinkSync(req.file.path);
    }
    console.error('Logo update error:', err.message);
    res.status(500).json({ message: 'Server error when updating shop logo' });
  }
});

// @route   GET /shops
// @desc    Get all shops (for customers)
// @access  Public
router.get('/shops', async (req, res) => {
  try {
    const { city, shopType } = req.query;
    let query = { profileComplete: true };
    
    // Add filters if provided
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (shopType) query['shopDetails.shopType'] = shopType;
    
    const shops = await ShopOwner.find(query)
      .select('firstName lastName shopDetails address')
      .sort({ createdAt: -1 });
    
    res.json(shops);
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ message: 'Server error when retrieving shops' });
  }
});

// @route   GET /shop/:id
// @desc    Get shop details by ID (for customers)
// @access  Public
router.get('/shop/:id', async (req, res) => {
  try {
    // Validate ObjectId format to prevent CastError
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid shop ID format' });
    }
    
    const shop = await ShopOwner.findById(req.params.id)
      .select('-password -googleId -resetPasswordToken -resetPasswordExpires -__v');
    
    if (shop && shop.profileComplete) {
      res.json(shop);
    } else {
      res.status(404).json({ message: 'Shop not found or profile not complete' });
    }
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ message: 'Server error when retrieving shop' });
  }
});

// @route   POST /forgot-password
// @desc    Send password reset email to shop owner
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email format
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find shop owner with proper error handling
    const shopOwner = await ShopOwner.findOne({ email }).exec();
    if (!shopOwner) {
      return res.status(404).json({ message: "Shop owner not found" });
    }

    // Generate tokens with stronger randomness
    const token = crypto.randomBytes(64).toString("hex");
    const resetToken = jwt.sign({ id: shopOwner._id }, JWT_SECRET, { 
      expiresIn: "1h" 
    });

    // Update shop owner with reset tokens
    shopOwner.resetPasswordToken = token;
    shopOwner.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    // Save with error handling
    try {
      await shopOwner.save();
    } catch (saveError) {
      console.error('Failed to save reset token:', saveError);
      return res.status(500).json({ 
        message: "Failed to save reset token", 
        error: saveError.message 
      });
    }

    const resetUrl = `${process.env.FRONTEND_URL}/ShopOwner-ResetPassword/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: shopOwner.email,
      subject: "Password Reset Request for Your Shop Owner Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
          </div>
          <h2 style="color: #333; margin-bottom: 15px;">Password Reset Request</h2>
          <p style="color: #555; line-height: 1.5;">Hello ${shopOwner.firstName},</p>
          <p style="color: #555; line-height: 1.5;">We received a request to reset the password for your shop owner account. If you didn't make this request, you can safely ignore this email.</p>
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
      await transporter.sendMail(mailOptions);
      res.json({ message: "Reset link sent to your email" });
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      return res.status(500).json({ 
        message: "Failed to send reset email", 
        error: emailError.message 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @route   POST /reset-password/:token
// @desc    Reset shop owner password using token
// @access  Public
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Input validation
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    if (!/\d/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one number" });
    }

    if (!/[a-z]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one lowercase letter" });
    }

    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter" });
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      return res.status(400).json({ message: "Password must contain at least one special character" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (tokenError) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find shop owner
    const shopOwner = await ShopOwner.findById(decoded.id);
    if (!shopOwner) {
      return res.status(404).json({ message: "Shop owner not found" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update shop owner password
    shopOwner.password = hashedPassword;
    shopOwner.resetPasswordToken = undefined;
    shopOwner.resetPasswordExpires = undefined;

    // Save with error handling
    try {
      await shopOwner.save();
      res.json({ message: "Password reset successful" });
    } catch (saveError) {
      console.error("Failed to update password:", saveError);
      return res.status(500).json({ message: "Failed to update password" });
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

module.exports = router;