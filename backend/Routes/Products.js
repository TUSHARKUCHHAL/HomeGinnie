const express = require('express');
const router = express.Router();
const Product = require('../Models/Products');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

// Filter file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Error handler middleware
const errorHandler = (res, error) => {
  console.error('Error:', error.message);
  return res.status(500).json({ 
    success: false, 
    message: 'Server error', 
    error: error.message 
  });
};

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { search, minPrice, maxPrice, inStock } = req.query;
    
    // Build query object
    const query = {};
    
    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }
    
    // Add stock filter if provided
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    // Execute query
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    return errorHandler(res, error);
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return errorHandler(res, error);
  }
});

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, stock } = req.body;
    
    // Handle image upload
    let imagePath;
    if (req.file) {
      imagePath = `/uploads/products/${req.file.filename}`;
    } else if (req.body.image) {
      // If image is provided as a URL
      imagePath = req.body.image;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Product image is required'
      });
    }
    
    // Create product
    const product = new Product({
      title,
      description,
      price,
      stock: stock || 0,
      image: imagePath
    });
    
    const savedProduct = await product.save();
    
    return res.status(201).json({
      success: true,
      data: savedProduct
    });
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return errorHandler(res, error);
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product
 * @access  Private
 */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      // Delete uploaded file if there was one
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Handle image upload
    if (req.file) {
      // Delete old image if it's a file in our uploads folder
      if (product.image.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', 'public', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      req.body.image = `/uploads/products/${req.file.filename}`;
    }
    
    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Delete uploaded file if there was an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    return errorHandler(res, error);
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Delete product image if it's stored locally
    if (product.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', 'public', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return errorHandler(res, error);
  }
});

/**
 * @route   PATCH /api/products/:id/stock
 * @desc    Update product stock quantity
 * @access  Private
 */
router.patch('/:id/stock', async (req, res) => {
  try {
    const { stock } = req.body;
    
    if (stock === undefined || isNaN(stock) || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid stock quantity is required'
      });
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    return errorHandler(res, error);
  }
});

/**
 * @route   PATCH /api/products/:id/rating
 * @desc    Add/update product rating
 * @access  Public
 */
router.patch('/:id/rating', async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating === undefined || isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid rating between 0 and 5 is required'
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Calculate new average rating
    const newCount = product.rating.count + 1;
    const newValue = (product.rating.value * product.rating.count + rating) / newCount;
    
    // Update product rating
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        'rating.value': parseFloat(newValue.toFixed(1)), 
        'rating.count': newCount,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    return res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    return errorHandler(res, error);
  }
});

/**
 * @route   GET /api/products/stats/inventory
 * @desc    Get inventory statistics
 * @access  Private
 */
router.get('/stats/inventory', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ stock: { $lte: 5, $gt: 0 } });
    const outOfStock = await Product.countDocuments({ stock: 0 });
    
    // Get total inventory value
    const products = await Product.find({}, 'price stock');
    const totalValue = products.reduce((sum, product) => {
      return sum + (product.price * product.stock);
    }, 0);
    
    return res.status(200).json({
      success: true,
      data: {
        totalProducts,
        lowStock,
        outOfStock,
        inStock: totalProducts - outOfStock,
        totalValue: parseFloat(totalValue.toFixed(2))
      }
    });
  } catch (error) {
    return errorHandler(res, error);
  }
});

module.exports = router;