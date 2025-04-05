// File: routes/addressRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../Models/User');

// Auth middleware (reusing from userRoutes.js)
const jwt = require('jsonwebtoken');

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

// @route   GET /api/users/addresses
// @desc    Get all saved addresses for the user
// @access  Private
router.get('/', protect, async (req, res) => {
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

// @route   POST /api/users/addresses
// @desc    Add or update a user address
// @access  Private
router.post('/', protect, async (req, res) => {
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

// @route   DELETE /api/users/addresses/:type
// @desc    Delete a user address
// @access  Private
router.delete('/:type', protect, async (req, res) => {
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