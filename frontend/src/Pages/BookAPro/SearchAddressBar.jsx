import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Home, Briefcase, MapPinned, Navigation, Loader, X, Plus } from 'lucide-react';
import LocationService from './LocationService';
import AddressModal from './AddressModal';
import api from './api'; // Import the api instance instead of axios directly

const SearchAddressBar = ({
  searchQuery,
  setSearchQuery,
  activeAddress,
  setActiveAddress,
  addresses,
  setAddresses
}) => {
  const [addressBarFocused, setAddressBarFocused] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const addressInputRef = useRef(null);
  
  // Load saved addresses from MongoDB and current location from session storage on component mount
  useEffect(() => {
    const loadSavedAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        // Fetch saved addresses from backend using our api instance with auth headers
        const response = await api.get('/users/addresses');
        // If we get a successful response, user is logged in
        setIsLoggedIn(true);
        
        const savedAddresses = response.data.reduce((acc, address) => {
          acc[address.type] = address.formattedAddress;
          return acc;
        }, {});
        
        // Get current location from session storage
        const storedCurrentLocation = sessionStorage.getItem('currentLocation') || localStorage.getItem('currentLocation');
        const storedActiveAddress = sessionStorage.getItem('activeAddress') || localStorage.getItem('activeAddress');
        
        // Combine backend addresses with current location from session storage
        const combinedAddresses = {
          ...savedAddresses,
          ...(storedCurrentLocation ? { current: storedCurrentLocation } : {})
        };
        
        setAddresses(combinedAddresses);
        
        // If logged in but no active address is set, leave it empty
        if (storedActiveAddress && (combinedAddresses[storedActiveAddress] || storedActiveAddress === 'current')) {
          setActiveAddress(storedActiveAddress);
        } else if (!isLoggedIn && Object.keys(combinedAddresses).length > 0) {
          // Only set first available address as active if not logged in
          const firstAddressKey = Object.keys(combinedAddresses)[0];
          setActiveAddress(firstAddressKey);
          sessionStorage.setItem('activeAddress', firstAddressKey);
          localStorage.setItem('activeAddress', firstAddressKey);
        } else {
          // For logged in users with no active address, leave it empty
          setActiveAddress(null);
        }
      } catch (error) {
        console.error('Error loading saved addresses:', error);
        // If unauthorized (401), user is not logged in
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          setLocationError('Please sign in again to view your addresses');
        }
        
        // Even if login failed, still check for current location in session storage
        const storedCurrentLocation = sessionStorage.getItem('currentLocation') || localStorage.getItem('currentLocation');
        if (storedCurrentLocation) {
          setAddresses({ current: storedCurrentLocation });
          setActiveAddress('current');
        }
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    
    loadSavedAddresses();
  }, [setAddresses, setActiveAddress]);
  
  // Save active address to session storage whenever it changes
  useEffect(() => {
    if (activeAddress) {
      sessionStorage.setItem('activeAddress', activeAddress);
      localStorage.setItem('activeAddress', activeAddress);
    }
  }, [activeAddress]);
  
  // Close address dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setAddressBarFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressInputRef]);

  // Handle fetching the current location
  const handleGetCurrentLocation = async () => {
    // Check if we already have the current location in session storage
    const storedCurrentLocation = sessionStorage.getItem('currentLocation') || localStorage.getItem('currentLocation');
    
    if (storedCurrentLocation) {
      // Use the stored location instead of requesting a new one
      const updatedAddresses = {
        ...addresses,
        current: storedCurrentLocation
      };
      
      setAddresses(updatedAddresses);
      setActiveAddress('current');
      sessionStorage.setItem('activeAddress', 'current');
      localStorage.setItem('activeAddress', 'current');
      setAddressBarFocused(false);
      return;
    }
    
    // If no stored location, fetch the current location
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      const locationData = await LocationService.getCurrentLocation();
      
      // Format the location data into a string representation
      let formattedAddress = '';
      
      if (typeof locationData === 'string') {
        // If it's already a string, use it directly
        formattedAddress = locationData;
      } else if (locationData && typeof locationData === 'object') {
        // If it's an object, format it properly
        if (locationData.address) {
          formattedAddress = locationData.address;
        } else if (locationData.latitude && locationData.longitude) {
          formattedAddress = `Location at ${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`;
        }
      }
      
      // Store the formatted address in session storage
      sessionStorage.setItem('currentLocation', formattedAddress || "Current location");
      localStorage.setItem('currentLocation', formattedAddress || "Current location");
      
      // Update addresses state with current location
      const updatedAddresses = {
        ...addresses,
        current: formattedAddress || "Current location"
      };
      
      setAddresses(updatedAddresses);
      
      // Set the active address to the current location
      setActiveAddress('current');
      
      // Save to session storage
      sessionStorage.setItem('activeAddress', 'current');
      localStorage.setItem('activeAddress', 'current');
      
      // Close the dropdown
      setAddressBarFocused(false);
    } catch (error) {
      console.error('Error getting current location:', error);
      setLocationError(error.message);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle address selection
  const handleAddressSelection = (type) => {
    setActiveAddress(type);
    sessionStorage.setItem('activeAddress', type);
    localStorage.setItem('activeAddress', type);
    setAddressBarFocused(false);
  };

  // Handle saving a new address to the MongoDB backend
  const handleSaveAddress = async (newAddressData) => {
    const { addressLine, city, pincode, state, landmark, type } = newAddressData;
    
    // Format the full address
    const formattedAddress = `${addressLine}, ${city}, ${state} - ${pincode}${landmark ? `, Near ${landmark}` : ''}`;
    
    try {
      // Save address to MongoDB through API with auth headers
      await api.post('/users/addresses', {
        type,
        addressLine,
        city,
        pincode,
        state,
        landmark,
        formattedAddress
      });
      
      // Update local state
      const updatedAddresses = {
        ...addresses,
        [type]: formattedAddress
      };
      
      setAddresses(updatedAddresses);
      
      // Set active address to the new address
      setActiveAddress(type);
      sessionStorage.setItem('activeAddress', type);
      localStorage.setItem('activeAddress', type);
    } catch (error) {
      console.error('Error saving address to database:', error);
      if (error.response && error.response.status === 401) {
        alert('You need to be signed in to save addresses. Please sign in again.');
      } else {
        alert('Failed to save address. Please try again.');
      }
    }
  };

  // Helper function to get display text for the address bar
  const getAddressDisplayText = () => {
    // If logged in but no active address selected, show empty placeholder
    if (isLoggedIn && (!activeAddress || !addresses || !addresses[activeAddress])) {
      return "Select Address";
    }
    
    // If not logged in or if an address is selected
    if (!activeAddress || !addresses || !addresses[activeAddress]) {
      return "Select Address";
    }
    
    // Make sure we're dealing with a string
    return typeof addresses[activeAddress] === 'string' 
      ? addresses[activeAddress] 
      : "Select Address";
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-0 gap-3 sm:gap-4 mb-6 sm:mb-8 mt-12 sm:mt-16 max-w-full sm:max-w-3xl md:max-w-4xl ml-auto">
      {/* Responsive container - Stack on mobile, right-aligned address bar on larger screens */}
      <div className="flex flex-col lg:flex-row w-full gap-3 justify-between">
        {/* Translucent Search Bar - On the left for large screens */}
        <div className="w-full lg:w-2/5 lg:order-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-slate-900" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/90 focus:bg-white"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Redesigned Address Bar with Dropdown - On the right for large screens */}
        <div className="w-full lg:w-3/5 relative lg:order-2" ref={addressInputRef}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MapPin className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            className={`w-full pl-10 pr-10 py-3 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/90 focus:bg-white ${addressBarFocused ? 'border-slate-500' : 'border'}`}
            value={getAddressDisplayText()}
            readOnly
            onClick={() => setAddressBarFocused(true)}
            onFocus={() => setAddressBarFocused(true)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${addressBarFocused ? 'transform rotate-180' : ''}`} />
          </div>
          
          {/* Address Dropdown Menu */}
          {addressBarFocused && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-20 animate-slideDown">
              <div className="p-3">
                {isLoadingAddresses ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="w-5 h-5 animate-spin text-slate-400 mr-2" />
                    <span className="text-sm text-slate-500">Loading addresses...</span>
                  </div>
                ) : (
                  <>
                    {/* Only show saved addresses if they exist */}
                    {addresses && addresses.home && (
                      <button 
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'home' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                        onClick={() => handleAddressSelection('home')}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Home</div>
                          <div className="text-xs opacity-80 truncate">{addresses.home}</div>
                        </div>
                      </button>
                    )}
                    
                    {addresses && addresses.work && (
                      <button 
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'work' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                        onClick={() => handleAddressSelection('work')}
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Work</div>
                          <div className="text-xs opacity-80 truncate">{addresses.work}</div>
                        </div>
                      </button>
                    )}
                    
                    {addresses && addresses.other && (
                      <button 
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'other' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                        onClick={() => handleAddressSelection('other')}
                      >
                        <MapPinned className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Other</div>
                          <div className="text-xs opacity-80 truncate">{addresses.other}</div>
                        </div>
                      </button>
                    )}
                    
                    {/* Show current location if it exists */}
                    {addresses && addresses.current && (
                      <button 
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'current' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}
                        onClick={() => handleAddressSelection('current')}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Current Location</div>
                          <div className="text-xs opacity-80 truncate">{addresses.current}</div>
                        </div>
                      </button>
                    )}
                    
                    <div className={`${addresses && Object.values(addresses).some(addr => addr) ? 'border-t border-slate-200 pt-3' : ''}`}>
                      {/* Current Location Button */}
                      <button 
                        className="w-full flex items-center px-3 py-2 rounded-lg transition hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleGetCurrentLocation}
                        disabled={isLoadingLocation}
                      >
                        {isLoadingLocation ? (
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Navigation className="w-4 h-4 mr-2" />
                        )}
                        <div className="text-sm">
                          {isLoadingLocation ? 'Getting location...' : sessionStorage.getItem('currentLocation') || localStorage.getItem('currentLocation') ? 'Use current location' : 'Use current location'}
                        </div>
                      </button>
                      
                      {/* Show error message if there is one */}
                      {locationError && (
                        <div className="text-xs text-red-500 mt-1 px-3">
                          {locationError}
                        </div>
                      )}
                      
                      {/* Add new address button */}
                      <button 
                        className="w-full flex items-center px-3 py-2 rounded-lg transition hover:bg-slate-100 text-slate-600 add-address-btn"
                        onClick={() => {
                          setShowAddressModal(true);
                          setAddressBarFocused(false);
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <div className="text-sm">Add new address</div>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Address Modal */}
      <AddressModal 
        isOpen={showAddressModal} 
        onClose={() => setShowAddressModal(false)} 
        onSave={handleSaveAddress} 
      />
    </div>
  );
};

export default SearchAddressBar;