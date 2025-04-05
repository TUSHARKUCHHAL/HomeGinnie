import React, { useState, useEffect } from 'react';
import { Search, Grid, List, Filter, ShoppingCart, Star, Clock, Truck, Tag, ChevronDown, ChevronUp, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Categories
  const categories = [
    'all', 'electronics', 'fashion', 'home', 'kitchen', 'beauty', 'toys', 'sports'
  ];

  // Mock platforms
  const platforms = [
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Flipkart', color: '#2874F0' },
    { name: 'Snapdeal', color: '#E40046' },
    { name: 'Blinkit', color: '#FAE100' },
    { name: 'Zepto', color: '#8377FE' },
    { name: 'Instamart', color: '#FC7D03' }
  ];

  // Mock data - would be fetched from API in real app
  useEffect(() => {
    const fetchProducts = async () => {
      // Simulate API call
      setIsLoading(true);
      
      // Generate mock data
      const mockProducts = Array(24).fill().map((_, idx) => {
        const id = idx + 1;
        const name = `${['Premium', 'Ultra', 'Essential', 'Smart', 'Pro'][Math.floor(Math.random() * 5)]} ${
          ['Headphones', 'Smartphone', 'Laptop', 'Watch', 'TV', 'Camera', 'Speaker', 'Tablet'][Math.floor(Math.random() * 8)]
        }`;
        
        const category = ['electronics', 'fashion', 'home', 'kitchen', 'beauty', 'toys', 'sports'][Math.floor(Math.random() * 7)];
        const basePrice = Math.floor(Math.random() * 90000) + 1000;
        
        return {
          id,
          name,
          category,
          image: `/api/placeholder/200/200`, // Placeholder image
          description: `High-quality ${name.toLowerCase()} with the latest features and exceptional performance.`,
          basePrice,
          ratings: (Math.random() * 2 + 3).toFixed(1), // 3-5 rating
          reviewCount: Math.floor(Math.random() * 1000) + 50,
          platforms: platforms.map(platform => ({
            name: platform.name,
            price: Math.floor(basePrice * (0.9 + Math.random() * 0.2)), // +/- 10% from base price
            inStock: Math.random() > 0.2,
            discount: Math.floor(Math.random() * 20),
            deliveryDays: Math.floor(Math.random() * 5) + 1,
            color: platform.color
          }))
        };
      });
      
      setTimeout(() => {
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setIsLoading(false);
      }, 800); // Simulate loading delay
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
        className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${
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
        transition={{ duration: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Product Comparison</h2>
          <motion.button 
            onClick={() => setCompareMode(false)}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Shopping
          </motion.button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 text-left bg-slate-50 rounded-l-lg">Details</th>
                {selectedProductsData.map((product, index) => (
                  <th key={product.id} className={`p-4 text-center bg-slate-50 ${index === selectedProductsData.length - 1 ? 'rounded-r-lg' : ''}`}>
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mb-2">
                        <img src={product.image} alt={product.name} className="w-24 h-24 object-contain" />
                      </div>
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 px-4 font-medium">Rating</td>
                {selectedProductsData.map(product => (
                  <td key={product.id} className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <Star size={16} className="text-yellow-500" />
                      <span className="ml-1">{product.ratings}</span>
                      <span className="text-xs text-slate-500 ml-1">({product.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>
              
              {platforms.map((platform, idx) => (
                <tr key={platform.name} className={idx % 2 === 0 ? 'bg-slate-50' : ''}>
                  <td className="py-4 px-4 font-medium">
                    <div className="flex items-center">
                      <div className="w-3-h-3 w-3 h-3 rounded-full mr-2" style={{ backgroundColor: platform.color }}></div>
                      {platform.name}
                    </div>
                  </td>
                  {selectedProductsData.map(product => {
                    const platformData = product.platforms.find(p => p.name === platform.name);
                    return (
                      <td key={`${product.id}-${platform.name}`} className="py-4 px-4 text-center">
                        {platformData.inStock ? (
                          <div>
                            <div className="font-bold">{formatPrice(platformData.price)}</div>
                            <div className="flex justify-center items-center mt-1">
                              <Clock size={14} className="text-slate-500" />
                              <span className="text-xs ml-1">{platformData.deliveryDays} day{platformData.deliveryDays > 1 ? 's' : ''}</span>
                            </div>
                            {platformData.discount > 0 && (
                              <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-50 rounded-full text-green-600">
                                {platformData.discount}% off
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-red-500">Out of stock</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              
              <tr className="bg-blue-50">
                <td className="py-4 px-4 font-medium text-blue-700">Best Deal</td>
                {selectedProductsData.map(product => {
                  const bestPlatform = getBestPricePlatform(product);
                  return (
                    <td key={`${product.id}-best`} className="py-4 px-4 text-center">
                      <div className="font-bold text-blue-700">{formatPrice(bestPlatform.price)}</div>
                      <div className="text-xs mt-1 inline-block px-2 py-1 bg-white rounded-full shadow-sm">
                        {bestPlatform.name}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
    <div>
        <div className="container mx-auto max-w-6xl ">
          <div className="flex flex-col md:flex-row justify-between items-center ">
        
            {/* SEARCH BAR */}
            
          </div>
        </div>
    </div>
      
      {/* Main Content */}
      <main className="container mx-auto max-w-6xl px-4 pb-8">
        {compareMode ? (
          <ComparisonView />
        ) : (
          <>
            

            <div className="w-full md:w-1/2 lg:w-1.5/3 relative mb-8 ml-auto mt-28">
              <motion.div 
                className="relative"
                initial={{ width: '100%' }}
                whileFocus={{ scale: 1.02 }}
              >
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-none rounded-full bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                />
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              </motion.div>
            </div>
            
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <motion.button 
                  onClick={() => setFiltersVisible(!filtersVisible)}
                  className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Filter size={16} className="mr-2 text-blue-500" />
                  <span>Filters</span>
                  {filtersVisible ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
                </motion.button>
                
                <div className="flex bg-white border border-slate-200 rounded-full overflow-hidden shadow-sm">
                  <motion.button 
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center px-4 py-2 ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'bg-white hover:bg-slate-100'}`}
                    whileHover={viewMode !== 'grid' ? { backgroundColor: '#f1f5f9' } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Grid size={16} className="mr-2" />
                    <span className="text-sm">Grid</span>
                  </motion.button>
                  <motion.button 
                    onClick={() => setViewMode('list')}
                    className={`flex items-center px-4 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white hover:bg-slate-100'}`}
                    whileHover={viewMode !== 'list' ? { backgroundColor: '#f1f5f9' } : {}}
                    whileTap={{ scale: 0.95 }}
                  >
                    <List size={16} className="mr-2" />
                    <span className="text-sm">List</span>
                  </motion.button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="py-2 px-4 border border-slate-200 rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  >
                    <option value="bestMatch">Best Match</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="delivery">Fastest Delivery</option>
                  </select>
                </div>
                
                <AnimatePresence>
                  {selectedProducts.length > 0 && (
                    <motion.button 
                      onClick={() => setCompareMode(true)}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Compare ({selectedProducts.length})
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Filters Panel */}
            <AnimatePresence>
              {filtersVisible && (
                <motion.div 
                  className="bg-white p-6 rounded-xl shadow-sm mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium mb-3 text-slate-800">Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                          <motion.button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-3 py-1.5 text-sm rounded-full capitalize ${
                              selectedCategory === category 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                            whileHover={selectedCategory !== category ? { scale: 1.05 } : {}}
                            whileTap={{ scale: 0.95 }}
                          >
                            {category}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3 text-slate-800">Price Range</h3>
                      <div className="px-2">
                        <input 
                          type="range"
                          min="0"
                          max="100000"
                          step="1000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between mt-2 text-sm text-slate-600">
                          <span>{formatPrice(priceRange[0])}</span>
                          <span>{formatPrice(priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3 text-slate-800">Platforms</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {platforms.map(platform => (
                          <div key={platform.name} className="flex items-center bg-slate-50 p-2 rounded-lg">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: platform.color }}></div>
                            <span className="text-sm">{platform.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {Array(6).fill().map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 h-64 animate-pulse">
                    <div className="bg-slate-200 h-32 w-32 rounded-lg mb-4 mx-auto"></div>
                    <div className="bg-slate-200 h-4 w-3/4 rounded-full mb-2"></div>
                    <div className="bg-slate-200 h-4 w-1/2 rounded-full mb-4"></div>
                    <div className="bg-slate-200 h-6 w-full rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <motion.div 
                    className="bg-white text-center py-16 rounded-xl shadow-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h3 className="text-xl font-medium text-slate-800 mb-2">No products found</h3>
                    <p className="text-slate-500">Try adjusting your search or filters</p>
                  </motion.div>
                ) : (
                  <div className={`grid ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  } gap-6`}>
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
      
      
    </div>
  );
};

export default BuySmart;