import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, MapPin, Clock, IndianRupee, Award, X, MessageSquare, Phone, UserCheck } from 'lucide-react';

const RequestResponse = ({ userAddress }) => {
  // Sample data - in a real app, this would come from an API/websocket
  const [serviceProviders, setServiceProviders] = useState([
    {
      id: 1,
      name: "Hardik shah",
      rating: 4.8,
      experience: 7,
      price: 85,
      distance: 3.2,
      responseTime: "10 min ago",
      avatar: "http://localhost:5500/uploads/download.jpeg",
      specialization: "Electrical Work",
      verified: true
    },
    {
      id: 2,
      name: "Rakesh Prasad",
      rating: 4.6,
      experience: 5,
      price: 75,
      distance: 1.8,
      responseTime: "15 min ago",
      avatar: "http://localhost:5500/uploads/images.jpeg",
      specialization: "Plumbing",
      verified: true
    },
    {
      id: 3,
      name: "Madhur Virli",
      rating: 4.9,
      experience: 10,
      price: 95,
      distance: 4.5,
      responseTime: "5 min ago",
      avatar: "http://localhost:5500/uploads/images2.jpeg",
      specialization: "Carpentry",
      verified: true
    }
  ]);

  // Filter states
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 200,
    minExperience: 0
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState(serviceProviders);

  // Sort options
  const [sortBy, setSortBy] = useState("rating"); // rating, price, experience, distance

  // Apply filters and sorting
  useEffect(() => {
    let result = serviceProviders.filter(provider => {
      return (
        provider.rating >= filters.minRating &&
        provider.price <= filters.maxPrice &&
        provider.experience >= filters.minExperience
      );
    });

    // Apply sorting
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "price":
        result.sort((a, b) => a.price - b.price);
        break;
      case "experience":
        result.sort((a, b) => b.experience - a.experience);
        break;
      case "distance":
        result.sort((a, b) => a.distance - b.distance);
        break;
      default:
        break;
    }

    setFilteredProviders(result);
  }, [serviceProviders, filters, sortBy]);

  // Simulate real-time updates with new service providers joining
  useEffect(() => {
    const addNewProvider = () => {
      const newProvider = {
        id: serviceProviders.length + 1 + Math.random(),
        name: `Provider ${serviceProviders.length + 1}`,
        rating: (4 + Math.random()).toFixed(1),
        experience: Math.floor(2 + Math.random() * 15),
        price: Math.floor(50 + Math.random() * 100),
        distance: (Math.random() * 10).toFixed(1),
        responseTime: "Just now",
        avatar: "/api/placeholder/40/40",
        specialization: ["Electrical Work", "Plumbing", "Carpentry", "Painting"][Math.floor(Math.random() * 4)],
        verified: Math.random() > 0.3
      };
      
      setServiceProviders(prev => [...prev, newProvider]);
    };

    // Simulate new providers joining every 15 seconds
    const timer = setTimeout(addNewProvider, 15000);
    return () => clearTimeout(timer);
  }, [serviceProviders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const resetFilters = () => {
    setFilters({
      minRating: 0,
      maxPrice: 200,
      minExperience: 0
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 mt-24">
        <h1 className="text-3xl font-bold text-slate-800">Available Service Providers</h1>
        <p className="text-slate-500 mt-2">
          We've found {filteredProviders.length} providers for your request at <MapPin className="inline h-4 w-4" /> {userAddress || "your location"}
        </p>
      </div>

      {/* Filters and Sorting */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg mr-4 transition-colors"
          >
            <Filter className="h-5 w-5 mr-2" />
            <span>Filters</span>
          </button>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="rating">Top Rated</option>
            <option value="price">Lowest Price</option>
            <option value="experience">Most Experience</option>
            <option value="distance">Nearest</option>
          </select>
        </div>
        
        <div className="text-slate-500 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Auto-refreshing results</span>
        </div>
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">Filter Options</h3>
              <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">Minimum Rating</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="minRating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full accent-slate-800"
                  />
                  <span className="ml-2 flex items-center">
                    {filters.minRating} <Star className="h-4 w-4 text-yellow-500 ml-1" />
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">Maximum Price</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="maxPrice"
                    min="0"
                    max="200"
                    step="5"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full accent-slate-800"
                  />
                  <span className="ml-2 flex items-center">
                    ${filters.maxPrice}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700">Minimum Experience</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="minExperience"
                    min="0"
                    max="15"
                    step="1"
                    value={filters.minExperience}
                    onChange={handleFilterChange}
                    className="w-full accent-slate-800"
                  />
                  <span className="ml-2">{filters.minExperience} years</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={resetFilters}
                className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProviders.map(provider => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              layout
              className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-lg text-slate-800 flex items-center">
                        {provider.name}
                        {provider.verified && (
                          <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        )}
                      </h3>
                      <p className="text-slate-500 text-sm">{provider.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{provider.rating}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-3 rounded-lg flex flex-col">
                    <span className="text-slate-500 text-sm mb-1">Price</span>
                    <span className="text-slate-800 font-medium flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      {provider.price}/hr
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded-lg flex flex-col">
                    <span className="text-slate-500 text-sm mb-1">Experience</span>
                    <span className="text-slate-800 font-medium flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      {provider.experience} years
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {provider.distance} miles away
                  </span>
                  <span className="text-green-600 font-medium">
                    {provider.responseTime}
                  </span>
                </div>
              </div>
              
              {/* Updated Button Section */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
  <div className="flex items-center justify-between">
    <button className="flex-grow flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white py-2 rounded-lg transition-colors mr-2">
      <UserCheck className="h-4 w-4 mr-2" />
      <span>Hire</span>
    </button>
    <div className="flex space-x-2">
      <button className="p-3 bg-slate-500/80 hover:bg-slate-600/80 text-white rounded-lg transition-colors">
        <MessageSquare className="h-4 w-4" />
      </button>
      <button className="p-3 bg-green-600/90 hover:bg-green-700 text-white rounded-lg transition-colors">
        <Phone className="h-4 w-4" />
      </button>
    </div>
  </div>
</div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredProviders.length === 0 && (
          <div className="col-span-3 py-12 text-center">
            <p className="text-slate-500 text-lg">No service providers match your current filters.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestResponse;