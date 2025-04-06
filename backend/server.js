// File: app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./Routes/User');
const serviceProviderRoutes = require('./Routes/ServiceProvider');
const shopRoutes = require('./Routes/Shops');
const hireRequestRoutes = require('./Routes/HireRequest');
const serviceRoutes = require('./Routes/Services');
const productRoutes = require('./Routes/Products');
const path = require('path');

const serviceProvider = require('./Routes/ServiceProvideFinal');
const hireRequest = require('./Routes/hireRequestFinal');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT;


const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-production-domain.com'
  ];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Routes
// More targeted approach - only serve files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/service-providers', serviceProviderRoutes);
app.use('/api/service-providers', serviceProvider);
app.use('/api/shops', shopRoutes);
app.use('/api/users', hireRequestRoutes);
app.use('/api/services', serviceRoutes);
app.use

// Root route
app.get('/', (req, res) => {
  res.send('HomeGinnie API is running');
});

// Apply error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;