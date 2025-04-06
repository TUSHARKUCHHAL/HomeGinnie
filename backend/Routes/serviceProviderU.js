const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const config = require('config');
const ServiceProvider = require('../Models/ServiceProvider');
const HireRequest = require('../Models/HireRequest');
const User = require('../Models/User');

// Middleware
const auth = async (req, res, next) => {
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

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  if ((lat1 === lat2) && (lon1 === lon2)) {
    return 0;
  }

  const radlat1 = Math.PI * lat1 / 180;
  const radlat2 = Math.PI * lat2 / 180;
  const theta = lon1 - lon2;
  const radtheta = Math.PI * theta / 180;
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + 
             Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  
  if (dist > 1) {
    dist = 1;
  }
  
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515; // Miles
  return dist;
}

// @route   GET api/service-providers
// @desc    Get all service providers
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get query parameters for filtering
    const {
      serviceType,
      minRating,
      maxPrice,
      minExperience,
      lat,
      lng,
      radius = 50, // Default 50 miles radius
      limit = 50,
      sort = 'rating' // Default sort by rating
    } = req.query;

    // Build the query
    let query = {};

    // Service type filter
    if (serviceType) {
      query.services = { $in: serviceType.split(',') };
    }

    // Rating filter
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    // Price filter
    if (maxPrice) {
      query.hourlyRate = { $lte: parseFloat(maxPrice) };
    }

    // Experience filter
    if (minExperience) {
      query['experience.years'] = { $gte: parseInt(minExperience) };
    }

    // Only show available providers
    query.isAvailable = true;
    query.isActive = true;
    query.status = 'approved';

    // Location-based filter
    if (lat && lng) {
      // We'll handle distance calculation in memory since we have a custom schema structure
      // Using MongoDB's $geoNear requires geoJSON format which our schema doesn't use
    }

    // Determine sort order
    let sortOption = {};
    switch (sort) {
      case 'price':
        sortOption = { hourlyRate: 1 }; // Ascending price
        break;
      case 'experience':
        sortOption = { 'experience.years': -1 }; // Descending experience
        break;
      case 'distance':
        // Distance sorting will be handled after fetching
        break;
      default:
        sortOption = { 'rating.average': -1 }; // Default to rating (descending)
    }

    const serviceProviders = await ServiceProvider.find(query)
      .select('-password')
      .sort(sortOption)
      .limit(parseInt(limit));

    // Calculate distance for each provider if coordinates provided
    if (lat && lng) {
      const providersWithDistance = serviceProviders.map(provider => {
        const providerData = provider.toObject();
        
        // Calculate distance in miles if provider has address
        if (provider.address) {
          // Get or calculate provider coordinates based on your address structure
          // This is a placeholder - you'll need to adjust based on how you store coordinates
          const providerLat = provider.address.latitude || 0;
          const providerLng = provider.address.longitude || 0;
          
          if (providerLat && providerLng) {
            const distance = calculateDistance(
              parseFloat(lat),
              parseFloat(lng),
              providerLat,
              providerLng
            );
            
            providerData.distance = parseFloat(distance.toFixed(1));
          }
        }
        
        return providerData;
      });

      // Sort by distance if that's the selected sort option
      if (sort === 'distance') {
        providersWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      }
      
      return res.json(providersWithDistance);
    }

    return res.json(serviceProviders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/service-providers/:id
// @desc    Get service provider by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid provider ID' });
    }
    
    const serviceProvider = await ServiceProvider.findById(req.params.id).select('-password');
    
    if (!serviceProvider) {
      return res.status(404).json({ msg: 'Service provider not found' });
    }
    
    res.json(serviceProvider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/service-providers
// @desc    Register a service provider
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'First name is required').notEmpty(),
    check('lastName', 'Last name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8 }),
    check('phoneNumber', 'Phone number is required').notEmpty(),
    check('services', 'At least one service is required').isArray({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      alternateNumber,
      address,
      services,
      experience,
      about,
      bio,
      hourlyRate,
      serviceRadius
    } = req.body;

    try {
      // Check if service provider already exists
      let serviceProvider = await ServiceProvider.findOne({ email });

      if (serviceProvider) {
        return res.status(400).json({ msg: 'Service provider already exists' });
      }

      // Create new service provider
      serviceProvider = new ServiceProvider({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        alternateNumber,
        address,
        services,
        experience,
        about,
        bio,
        hourlyRate,
        serviceRadius
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      serviceProvider.password = await bcrypt.hash(password, salt);

      await serviceProvider.save();

      // Create JWT payload
      const payload = {
        user: {
          id: serviceProvider.id,
          type: 'serviceProvider'
        }
      };

      // Sign token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   POST api/service-providers/login
// @desc    Authenticate service provider & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if service provider exists
      let serviceProvider = await ServiceProvider.findOne({ email });

      if (!serviceProvider) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Check if account is active
      if (!serviceProvider.isActive || serviceProvider.status !== 'approved') {
        return res.status(403).json({ 
          msg: 'Account is not active or pending approval. Please contact support.'
        });
      }

      // Match password
      const isMatch = await bcrypt.compare(password, serviceProvider.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Create JWT payload
      const payload = {
        user: {
          id: serviceProvider.id,
          type: 'serviceProvider'
        }
      };

      // Sign token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '7d' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/service-providers/update
// @desc    Update service provider profile
// @access  Private
router.put('/update', auth, async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    alternateNumber,
    address,
    services,
    experience,
    about,
    bio,
    hourlyRate,
    serviceRadius,
    paymentDetails
  } = req.body;

  // Build update object
  const providerFields = {};
  if (firstName) providerFields.firstName = firstName;
  if (lastName) providerFields.lastName = lastName;
  if (phoneNumber) providerFields.phoneNumber = phoneNumber;
  if (alternateNumber) providerFields.alternateNumber = alternateNumber;
  if (address) providerFields.address = address;
  if (services) providerFields.services = services;
  if (experience) providerFields.experience = experience;
  if (about) providerFields.about = about;
  if (bio) providerFields.bio = bio;
  if (hourlyRate) providerFields.hourlyRate = hourlyRate;
  if (serviceRadius) providerFields.serviceRadius = serviceRadius;
  if (paymentDetails) providerFields.paymentDetails = paymentDetails;
  
  providerFields.updatedAt = Date.now();

  try {
    // Check if service provider exists
    let serviceProvider = await ServiceProvider.findById(req.user.id);

    if (!serviceProvider) {
      return res.status(404).json({ msg: 'Service provider not found' });
    }

    // Update
    serviceProvider = await ServiceProvider.findByIdAndUpdate(
      req.user.id,
      { $set: providerFields },
      { new: true }
    ).select('-password');

    return res.json(serviceProvider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/service-providers/availability
// @desc    Update service provider availability
// @access  Private
router.put('/availability', auth, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    if (isAvailable === undefined) {
      return res.status(400).json({ msg: 'Availability status is required' });
    }

    const serviceProvider = await ServiceProvider.findById(req.user.id);
    
    if (!serviceProvider) {
      return res.status(404).json({ msg: 'Service provider profile not found' });
    }

    serviceProvider.isAvailable = isAvailable;
    serviceProvider.updatedAt = Date.now();
    
    await serviceProvider.save();
    
    res.json(serviceProvider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/service-providers/upload-profile-image
// @desc    Upload profile image
// @access  Private
router.put('/upload-profile-image', auth, async (req, res) => {
  try {
    const { profileImage } = req.body;
    
    if (!profileImage) {
      return res.status(400).json({ msg: 'Profile image URL is required' });
    }

    const serviceProvider = await ServiceProvider.findById(req.user.id);
    
    if (!serviceProvider) {
      return res.status(404).json({ msg: 'Service provider not found' });
    }

    serviceProvider.profileImage = profileImage;
    await serviceProvider.save();
    
    res.json(serviceProvider);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/service-providers/hire-requests
// @desc    Create a hire request for a service provider
// @access  Private (for users)
router.post(
  '/hire-requests',
  [
    auth,
    [
      check('name', 'Name is required').notEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('contactNumber', 'Contact number is required').notEmpty(),
      check('serviceProviderId', 'Service provider ID is required').notEmpty(),
      check('serviceType', 'Service type is required').notEmpty(),
      check('serviceDescription', 'Service description is required').notEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      contactNumber,
      address,
      serviceType,
      serviceDescription,
      preferredDate,
      preferredTime,
      serviceProviderId,
      initialMessage
    } = req.body;

    try {
      // Check if service provider exists
      const serviceProvider = await ServiceProvider.findById(serviceProviderId);
      
      if (!serviceProvider) {
        return res.status(404).json({ msg: 'Service provider not found' });
      }

      // Check if provider is available
      if (!serviceProvider.isAvailable) {
        return res.status(400).json({ msg: 'Service provider is currently unavailable' });
      }

      // Create new hire request
      const newRequest = new HireRequest({
        user: req.user.id,
        serviceProvider: serviceProviderId,
        name,
        email,
        contactNumber,
        address,
        serviceType,
        serviceDescription,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
        preferredTime,
        status: 'pending',
        messages: initialMessage ? [{
          sender: 'user',
          message: initialMessage,
          timestamp: Date.now()
        }] : []
      });

      const hireRequest = await newRequest.save();
      
      res.json(hireRequest);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/service-providers/hire-requests
// @desc    Get all hire requests for logged in user (either service provider or regular user)
// @access  Private
router.get('/hire-requests', auth, async (req, res) => {
  try {
    // Determine if user is a service provider or regular user
    let query = {};
    
    if (req.user.type === 'serviceProvider') {
      // For service providers, find requests where they are the provider
      query.serviceProvider = req.user.id;
    } else {
      // For regular users, find requests they created
      query.user = req.user.id;
    }
    
    const hireRequests = await HireRequest.find(query)
      .populate('serviceProvider', 'firstName lastName profileImage rating')
      .populate('user', 'name email profileImage')
      .sort({ createdAt: -1 });
    
    res.json(hireRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/service-providers/hire-requests/:id
// @desc    Get hire request by ID
// @access  Private
router.get('/hire-requests/:id', auth, async (req, res) => {
  try {
    const hireRequest = await HireRequest.findById(req.params.id)
      .populate('serviceProvider', 'firstName lastName profileImage rating services hourlyRate')
      .populate('user', 'name email profileImage');
      
    if (!hireRequest) {
      return res.status(404).json({ msg: 'Hire request not found' });
    }
    
    // Make sure user has permission to view this request
    if (
      hireRequest.user._id.toString() !== req.user.id && 
      hireRequest.serviceProvider._id.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(hireRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/service-providers/hire-requests/:id
// @desc    Update hire request status
// @access  Private
router.put('/hire-requests/:id', auth, async (req, res) => {
  try {
    const { status, responseMessage } = req.body;
    
    if (!status) {
      return res.status(400).json({ msg: 'Status is required' });
    }

    // Check if hire request exists
    const hireRequest = await HireRequest.findById(req.params.id);
    
    if (!hireRequest) {
      return res.status(404).json({ msg: 'Hire request not found' });
    }

    // Make sure user has permission to update this request
    if (req.user.type === 'serviceProvider') {
      // Service providers can only update requests assigned to them
      if (hireRequest.serviceProvider.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    } else {
      // Regular users can only update their own requests
      if (hireRequest.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
      
      // Users can only cancel their own requests
      if (status !== 'cancelled') {
        return res.status(400).json({ msg: 'Users can only cancel requests' });
      }
    }

    // Update request status
    hireRequest.status = status;
    
    // Add response message if provided
    if (responseMessage) {
      const senderType = req.user.type === 'serviceProvider' ? 'serviceProvider' : 'user';
      hireRequest.messages.push({
        sender: senderType,
        message: responseMessage,
        timestamp: Date.now()
      });
    }

    // If declining, add to declined requests
    if (status === 'declined' && req.user.type === 'serviceProvider') {
      const serviceProvider = await ServiceProvider.findById(req.user.id);
      if (serviceProvider) {
        serviceProvider.declinedRequests.push(hireRequest._id);
        await serviceProvider.save();
      }
    }

    await hireRequest.save();
    
    res.json(hireRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/service-providers/hire-requests/:id/message
// @desc    Add a message to a hire request
// @access  Private
router.post('/hire-requests/:id/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ msg: 'Message is required' });
    }
    
    const hireRequest = await HireRequest.findById(req.params.id);
    
    if (!hireRequest) {
      return res.status(404).json({ msg: 'Hire request not found' });
    }
    
    // Make sure user has permission to message in this request
    if (
      hireRequest.user.toString() !== req.user.id && 
      hireRequest.serviceProvider.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Determine sender type
    const senderType = hireRequest.serviceProvider.toString() === req.user.id ? 
      'serviceProvider' : 'user';
    
    // Add message
    hireRequest.messages.push({
      sender: senderType,
      message,
      timestamp: Date.now()
    });
    
    await hireRequest.save();
    
    res.json(hireRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/service-providers/feedback/:id
// @desc    Add feedback for a service provider
// @access  Private
router.post(
  '/feedback/:id',
  [
    auth,
    [
      check('heading', 'Heading is required').notEmpty(),
      check('description', 'Description is required').notEmpty(),
      check('rating', 'Rating is required').isNumeric()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { heading, description, media, rating } = req.body;

    try {
      const serviceProvider = await ServiceProvider.findById(req.params.id);
      
      if (!serviceProvider) {
        return res.status(404).json({ msg: 'Service provider not found' });
      }

      // Create new feedback
      const newFeedback = {
        user: req.user.id,
        heading,
        description,
        media,
        rating: parseFloat(rating),
        createdAt: Date.now()
      };

      // Add to feedback array
      serviceProvider.feedback.unshift(newFeedback);

      // Update rating
      const currentTotalRating = serviceProvider.rating.average * serviceProvider.rating.count;
      const newCount = serviceProvider.rating.count + 1;
      const newAverage = (currentTotalRating + parseFloat(rating)) / newCount;

      serviceProvider.rating.average = parseFloat(newAverage.toFixed(1));
      serviceProvider.rating.count = newCount;
      serviceProvider.totalReviews = newCount;

      await serviceProvider.save();
      
      res.json(serviceProvider);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   DELETE api/service-providers
// @desc    Delete service provider profile
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove service provider
    await ServiceProvider.findByIdAndRemove(req.user.id);
    
    // Remove associated hire requests (optional based on your requirements)
    // await HireRequest.deleteMany({ serviceProvider: req.user.id });
    
    res.json({ msg: 'Service provider profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/service-providers/hire-requests/providers/:requestId
// @desc    Get service providers for a specific request
// @access  Private
router.get('/hire-requests/providers/:requestId', auth, async (req, res) => {
  try {
    // Get the hire request
    const hireRequest = await HireRequest.findById(req.params.requestId);
    
    if (!hireRequest) {
      return res.status(404).json({ msg: 'Hire request not found' });
    }
    
    // Make sure user owns the request
    if (hireRequest.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Find service providers based on request criteria
    let query = {
      services: { $in: [hireRequest.serviceType] },
      isAvailable: true,
      isActive: true,
      status: 'approved'
    };
    
    // Add location query if address has coordinates
    // This would depend on your address structure
    
    const serviceProviders = await ServiceProvider.find(query)
      .select('-password')
      .sort({ 'rating.average': -1 })
      .limit(50);
    
    res.json(serviceProviders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;