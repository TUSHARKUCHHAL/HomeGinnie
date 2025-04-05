import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Filter, ShoppingCart, Star, Clock, Truck, Tag, ChevronDown, ChevronUp, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductService from './ProductService'

const BuySmart = () => {
  // States
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('bestMatch');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [error, setError] = useState(null);

  // Categories
  const categories = [
    'all', 'electronics', 'fashion', 'home', 'kitchen', 'beauty', 'toys', 'sports'
  ];

  // Platforms
  const platforms = [
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Flipkart', color: '#2874F0' },
    { name: 'Snapdeal', color: '#E40046' },
    { name: 'Blinkit', color: '#FAE100' },
    { name: 'Zepto', color: '#8377FE' },
    { name: 'Instamart', color: '#FC7D03' }
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get products from the API
        const backendProducts = await ProductService.getProducts();
        
        // Transform backend products to match frontend structure
        const formattedProducts = backendProducts.map(product => 
          ProductService.formatProductForFrontend(product)
        );
        
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products based on search and filters
  useEffect(() => {
    let results = [...products];
    
    // Apply search query
    if (searchQuery) {
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }
    
    // Apply price range filter
    results = results.filter(product => {
      const lowestPrice = Math.min(...product.platforms.map(p => p.price));
      return lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];
    });
    
    // Apply sorting
    if (sortBy === 'priceLow') {
      results.sort((a, b) => {
        const aLowestPrice = Math.min(...a.platforms.map(p => p.price));
        const bLowestPrice = Math.min(...b.platforms.map(p => p.price));
        return aLowestPrice - bLowestPrice;
      });
    } else if (sortBy === 'priceHigh') {
      results.sort((a, b) => {
        const aLowestPrice = Math.min(...a.platforms.map(p => p.price));
        const bLowestPrice = Math.min(...b.platforms.map(p => p.price));
        return bLowestPrice - aLowestPrice;
      });
    } else if (sortBy === 'rating') {
      results.sort((a, b) => parseFloat(b.ratings) - parseFloat(a.ratings));
    } else if (sortBy === 'delivery') {
      results.sort((a, b) => {
        const aFastestDelivery = Math.min(...a.platforms.map(p => p.deliveryDays));
        const bFastestDelivery = Math.min(...b.platforms.map(p => p.deliveryDays));
        return aFastestDelivery - bFastestDelivery;
      });
    }
    
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, priceRange, sortBy, products]);

  // Toggle product selection for comparison
  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      if (selectedProducts.length < 3) {
        setSelectedProducts([...selectedProducts, productId]);
      }
    }
  };

  // Handle product rating update
  const handleRateProduct = async (productId, rating) => {
    try {
      await ProductService.updateRating(productId, rating);
      
      // Update the product rating in state
      const updatedProducts = products.map(product => {
        if (product.id === productId) {
          // We would ideally get the new rating from the API response
          // But for now we'll just do a simple update
          const newRatingValue = parseFloat(product.ratings);
          const newRatingCount = product.reviewCount + 1;
          return {
            ...product,
            ratings: ((newRatingValue * product.reviewCount + rating) / newRatingCount).toFixed(1),
            reviewCount: newRatingCount
          };
        }
        return product;
      });
      
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Failed to update product rating:', error);
    }
  };

  // Get the best price platform for a product
  const getBestPricePlatform = (product) => {
    return product.platforms.reduce((best, current) => 
      current.price < best.price ? current : best
    );
  };

  // Get the fastest delivery platform for a product
  const getFastestDeliveryPlatform = (product) => {
    return product.platforms.reduce((fastest, current) => 
      current.deliveryDays < fastest.deliveryDays ? current : fastest
    );
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Product Card Component
  const ProductCard = ({ product, index }) => {
    const bestPrice = getBestPricePlatform(product);
    const fastestDelivery = getFastestDeliveryPlatform(product);
    const isSelected = selectedProducts.includes(product.id);
    
    return (
      <motion.div 
        className={`bg-white rounded-xl shadow-sm overflow-hidden mt-8 transition-all duration-300 hover:shadow-lg ${
          viewMode === 'grid' ? 'w-full' : 'flex'
        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className={`${viewMode === 'grid' ? 'p-4 bg-slate-50' : 'p-4 flex-shrink-0 w-32 bg-slate-50'}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={`mx-auto ${viewMode === 'grid' ? 'h-40 w-40' : 'h-24 w-24'} object-contain`}
          />
        </div>
        
        <div className={`${viewMode === 'grid' ? 'p-4' : 'p-4 flex-grow'}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
            <motion.button 
              onClick={() => toggleProductSelection(product.id)}
              className={`p-2 rounded-full ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 hover:bg-slate-200'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSelected ? <X size={16} /> : <ShoppingCart size={16} />}
            </motion.button>
          </div>
          
          <p className="text-sm text-slate-600 mt-1 mb-3">
            {product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
          </p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center bg-green-50 px-2 py-1 rounded-full">
              <Star size={16} className="text-yellow-500" />
              <span className="ml-1 text-sm font-medium">{product.ratings}</span>
            </div>
            <span className="text-xs text-slate-500 ml-2">({product.reviewCount} reviews)</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tag size={16} className="text-blue-500" />
                <span className="ml-1 text-sm font-semibold">Best Price:</span>
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">{formatPrice(bestPrice.price)}</span>
                <span className="ml-1 text-xs px-2 py-0.5 bg-blue-50 rounded-full text-blue-600">
                  {bestPrice.name}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck size={16} className="text-green-500" />
                <span className="ml-1 text-sm font-semibold">Fastest:</span>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-900">{fastestDelivery.deliveryDays} day{fastestDelivery.deliveryDays > 1 ? 's' : ''}</span>
                <span className="ml-1 text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-600">
                  {fastestDelivery.name}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-slate-500">
              <span>{product.platforms.filter(p => p.inStock).length} of {product.platforms.length} platforms</span>
              <span>Up to {Math.max(...product.platforms.map(p => p.discount))}% off</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Comparison View
  const ComparisonView = () => {
    const selectedProductsData = products.filter(product => selectedProducts.includes(product.id));
    
    return (
      <motion.div 
        className="bg-white p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <motion.button
              onClick={() => setCompareMode(false)}
              className="mr-3 p-2 rounded-full bg-slate-100 hover:bg-slate-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <h2 className="text-xl font-semibold text-slate-800">Compare Products</h2>
          </div>
          <motion.button
            onClick={() => setSelectedProducts([])}
            className="text-sm text-red-500 hover:text-red-700"
            whileHover={{ scale: 1.05 }}
          >
            Clear All
          </motion.button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b"></th>
                {selectedProductsData.map(product => (
                  <th key={product.id} className="p-4 border-b">
                    <div className="flex flex-col items-center">
                      <img src={product.image} alt={product.name} className="h-24 w-24 object-contain mb-2" />
                      <h3 className="text-sm font-medium text-center">{product.name}</h3>
                      <motion.button 
                        onClick={() => toggleProductSelection(product.id)}
                        className="mt-2 p-1 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={16} />
                      </motion.button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b font-medium">Price Range</td>
                {selectedProductsData.map(product => (
                  <td key={product.id} className="p-4 border-b text-center">
                    <div className="font-semibold text-slate-800">
                      {formatPrice(Math.min(...product.platforms.map(p => p.price)))} - {formatPrice(Math.max(...product.platforms.map(p => p.price)))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Best Price</td>
                {selectedProductsData.map(product => {
                  const bestPrice = getBestPricePlatform(product);
                  return (
                    <td key={product.id} className="p-4 border-b text-center">
                      <div className="font-semibold text-slate-800">{formatPrice(bestPrice.price)}</div>
                      <div className="text-xs px-2 py-0.5 bg-blue-50 rounded-full text-blue-600 inline-block">
                        {bestPrice.name}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Rating</td>
                {selectedProductsData.map(product => (
                  <td key={product.id} className="p-4 border-b text-center">
                    <div className="flex items-center justify-center">
                      <Star size={16} className="text-yellow-500" />
                      <span className="ml-1 font-medium">{product.ratings}</span>
                    </div>
                    <span className="text-xs text-slate-500">({product.reviewCount} reviews)</span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Fastest Delivery</td>
                {selectedProductsData.map(product => {
                  const fastestDelivery = getFastestDeliveryPlatform(product);
                  return (
                    <td key={product.id} className="p-4 border-b text-center">
                      <div className="font-medium">{fastestDelivery.deliveryDays} day{fastestDelivery.deliveryDays > 1 ? 's' : ''}</div>
                      <div className="text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-600 inline-block">
                        {fastestDelivery.name}
                      </div>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Description</td>
                {selectedProductsData.map(product => (
                  <td key={product.id} className="p-4 border-b text-center">
                    <p className="text-sm text-slate-600">{product.description}</p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 border-b font-medium">Available On</td>
                {selectedProductsData.map(product => (
                  <td key={product.id} className="p-4 border-b">
                    <div className="flex flex-wrap justify-center gap-2">
                      {product.platforms.map(platform => (
                        <span 
                          key={platform.name} 
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: platforms.find(p => p.name === platform.name)?.color || '#333' }}
                        >
                          {platform.name}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium">Actions</td>
                {selectedProductsData.map(product => (
                  <td key={product.id} className="p-4 text-center">
                    <motion.button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Logic to handle the "Best Buy" action
                        const bestPlatform = getBestPricePlatform(product);
                        alert(`Redirecting to buy ${product.name} from ${bestPlatform.name} at ${formatPrice(bestPlatform.price)}`);
                      }}
                    >
                      Best Buy
                    </motion.button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  // Instructions Modal
  const Instructions = () => (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl max-w-md"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Welcome to BuySmart!</h2>
        <div className="space-y-3 text-slate-600">
          <p>BuySmart helps you find the best deals across multiple shopping platforms.</p>
          <div className="flex items-start">
            <ShoppingCart size={18} className="text-blue-500 mt-1 mr-2" />
            <p>Select up to 3 products to compare prices and delivery options.</p>
          </div>
          <div className="flex items-start">
            <Filter size={18} className="text-blue-500 mt-1 mr-2" />
            <p>Use filters to narrow down products by category, price range, and more.</p>
          </div>
          <div className="flex items-start">
            <Tag size={18} className="text-blue-500 mt-1 mr-2" />
            <p>We highlight the best prices and fastest delivery options for each product.</p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowInstructions(false)}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </motion.div>
    </motion.div>
  );

  // Main UI
  return (
    <div className="bg-slate-50 min-h-screen">
      <AnimatePresence>
        {showInstructions && <Instructions />}
      </AnimatePresence>
      
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-24">
            <h1 className="text-2xl font-bold text-blue-600">BuySmart</h1>
            
            <div className="flex-grow max-w-md relative ml-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className={`p-2 rounded ${filtersVisible ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}
              >
                <Filter size={20} />
              </button>
              {selectedProducts.length > 0 && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center p-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setCompareMode(true)}
                >
                  <ShoppingCart size={18} className="mr-1" />
                  <span>{selectedProducts.length}</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <AnimatePresence>
          {compareMode ? (
            <ComparisonView />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filtersVisible && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="col-span-1 bg-white p-4 rounded-xl shadow-sm"
                    >
                      <h2 className="text-lg font-semibold text-slate-800 mb-4">Filters</h2>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Categories</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <label key={category} className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                                className="form-radio text-blue-500"
                              />
                              <span className="ml-2 text-sm capitalize">{category}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Price Range</h3>
                        <div className="px-2">
                          <input
                            type="range"
                            min="0"
                            max="100000"
                            step="1000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between mt-1 text-xs text-slate-500">
                            <span>₹0</span>
                            <span>₹{priceRange[1].toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Sort By</h3>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="bestMatch">Best Match</option>
                          <option value="priceLow">Price: Low to High</option>
                          <option value="priceHigh">Price: High to Low</option>
                          <option value="rating">Highest Rating</option>
                          <option value="delivery">Fastest Delivery</option>
                        </select>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-slate-700 mb-2">Platforms</h3>
                        <div className="flex flex-wrap gap-2">
                          {platforms.map(platform => (
                            <span
                              key={platform.name}
                              className="text-xs px-2 py-1 rounded-full text-white"
                              style={{ backgroundColor: platform.color }}
                            >
                              {platform.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className={`${filtersVisible ? 'col-span-1 md:col-span-3' : 'col-span-1 md:col-span-4'}`}>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center">
                      <h3 className="text-lg font-medium text-slate-700">No products found</h3>
                      <p className="text-slate-500 mt-2">Try adjusting your filters or search query</p>
                    </div>
                  ) : (
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                    }`}>
                      {filteredProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} index={index} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BuySmart;