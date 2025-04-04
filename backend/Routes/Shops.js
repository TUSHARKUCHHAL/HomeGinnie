// File: routes/shopOwnerRoutes.js (updated)
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { check, validationResult } = require('express-validator');
const ShopOwner = require('../Models/Shops');
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

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

// Auth middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.shopOwner = await ShopOwner.findById(decoded.id).select('-password');
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
router.post('/register', upload.single('logo'), async (req, res, next) => {
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

// Rest of the routes remain same...

// @route   POST /login
// @desc    Authenticate a shop owner & get token
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for shop owner email
    const shopOwner = await ShopOwner.findOne({ email });

    if (shopOwner && (await bcrypt.compare(password, shopOwner.password))) {
      res.json({
        _id: shopOwner._id,
        firstName: shopOwner.firstName,
        lastName: shopOwner.lastName,
        email: shopOwner.email,
        role: 'shop-owner',
        token: generateToken(shopOwner._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
});

// @route   POST /auth/google
// @desc    Google OAuth for shop owners
// @access  Public
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
    
    // Check if shop owner exists
    let shopOwner = await ShopOwner.findOne({ email });
    
    if (!shopOwner) {
      // Better name handling
      const nameParts = name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Create shop owner with minimal data - they will need to complete profile later
      shopOwner = new ShopOwner({
        firstName,
        lastName,
        email,
        googleId,
        password: " ", // Generate a random secure password for OAuth users
        phoneNumber: "", // Will be required to fill in later
        address: {
          country: "India" // Default value
        },
        shopDetails: {
          shopType: "" // Will be required to fill in later
        },
        profileComplete: false, // Flag to indicate profile needs completion
        avatar: picture || 'default-avatar.png'
      });
      
      await shopOwner.save();
    } else if (!shopOwner.googleId) {
      // Link Google ID to existing account if not already linked
      shopOwner.googleId = googleId;
      await shopOwner.save();
    }
    
    // Generate JWT token
    res.json({
      _id: shopOwner._id,
      firstName: shopOwner.firstName,
      lastName: shopOwner.lastName,
      email: shopOwner.email,
      profileComplete: shopOwner.profileComplete,
      role: 'shop-owner',
      token: generateToken(shopOwner._id)
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /profile
// @desc    Get shop owner profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const shopOwner = await ShopOwner.findById(req.shopOwner._id).select('-password');
    
    if (shopOwner) {
      res.json(shopOwner);
    } else {
      res.status(404);
      throw new Error('Shop owner not found');
    }
  } catch (error) {
    next(error);
  }
});

// @route   PUT /profile
// @desc    Update shop owner profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const shopOwner = await ShopOwner.findById(req.shopOwner._id);

    if (shopOwner) {
      // Update basic info
      shopOwner.firstName = req.body.firstName || shopOwner.firstName;
      shopOwner.lastName = req.body.lastName || shopOwner.lastName;
      shopOwner.email = req.body.email || shopOwner.email;
      shopOwner.phoneNumber = req.body.phoneNumber || shopOwner.phoneNumber;
      shopOwner.alternateNumber = req.body.alternateNumber || shopOwner.alternateNumber;
      
      // Update address if provided
      if (req.body.address) {
        shopOwner.address = {
          ...shopOwner.address,
          ...req.body.address
        };
      }
      
      // Update shop details if provided
      if (req.body.shopDetails) {
        shopOwner.shopDetails = {
          ...shopOwner.shopDetails,
          ...req.body.shopDetails
        };
      }
      
      // Update business hours if provided
      if (req.body.businessHours) {
        shopOwner.shopDetails.businessHours = req.body.businessHours;
      }
      
      // Update password if provided
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        shopOwner.password = await bcrypt.hash(req.body.password, salt);
      }

      // Check if profile is now complete
      const requiredFields = [
        shopOwner.firstName,
        shopOwner.lastName,
        shopOwner.email,
        shopOwner.phoneNumber,
        shopOwner.address.street,
        shopOwner.address.city,
        shopOwner.address.state,
        shopOwner.address.postalCode,
        shopOwner.shopDetails.shopType
      ];
      
      shopOwner.profileComplete = requiredFields.every(field => field && field.toString().trim() !== '');

      const updatedShopOwner = await shopOwner.save();

      res.json({
        _id: updatedShopOwner._id,
        firstName: updatedShopOwner.firstName,
        lastName: updatedShopOwner.lastName,
        email: updatedShopOwner.email,
        profileComplete: updatedShopOwner.profileComplete,
        role: 'shop-owner',
        token: generateToken(updatedShopOwner._id)
      });
    } else {
      res.status(404);
      throw new Error('Shop owner not found');
    }
  } catch (error) {
    next(error);
  }
});

// @route   GET /shops
// @desc    Get all shops (for customers)
// @access  Public
router.get('/shops', async (req, res, next) => {
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
    next(error);
  }
});

// @route   GET /shop/:id
// @desc    Get shop details by ID (for customers)
// @access  Public
router.get('/shop/:id', async (req, res, next) => {
  try {
    const shop = await ShopOwner.findById(req.params.id)
      .select('-password -googleId');
    
    if (shop && shop.profileComplete) {
      res.json(shop);
    } else {
      res.status(404);
      throw new Error('Shop not found or profile not complete');
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;