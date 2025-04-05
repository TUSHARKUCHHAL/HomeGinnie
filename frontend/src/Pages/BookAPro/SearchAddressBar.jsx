import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Home, Briefcase, MapPinned, Navigation, Loader, X, Plus } from 'lucide-react';
import LocationService from './LocationService';

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
  const [newAddressData, setNewAddressData] = useState({
    addressLine: '',
    city: '',
    pincode: '',
    state: '',
    landmark: '',
    type: 'home' // default type
  });
  const [isLoadingPincodeData, setIsLoadingPincodeData] = useState(false);
  
  const addressInputRef = useRef(null);
  const modalRef = useRef(null);
  
  // Load addresses and active address from session storage on component mount
  useEffect(() => {
    const storedAddresses = sessionStorage.getItem('userAddresses');
    const storedActiveAddress = sessionStorage.getItem('activeAddress');
    
    if (storedAddresses) {
      setAddresses(JSON.parse(storedAddresses));
    }
    
    if (storedActiveAddress) {
      setActiveAddress(storedActiveAddress);
    }
  }, [setAddresses, setActiveAddress]);
  
  // Save addresses and active address to session storage whenever they change
  useEffect(() => {
    if (addresses && Object.keys(addresses).length > 0) {
      sessionStorage.setItem('userAddresses', JSON.stringify(addresses));
    }
    
    if (activeAddress) {
      sessionStorage.setItem('activeAddress', activeAddress);
    }
  }, [addresses, activeAddress]);
  
  // Close address dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressInputRef.current && !addressInputRef.current.contains(event.target)) {
        setAddressBarFocused(false);
      }
      
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          event.target.className !== 'modal-overlay' && 
          !event.target.className.includes('add-address-btn')) {
        setShowAddressModal(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addressInputRef, modalRef]);

  // Handle fetching the current location
  const handleGetCurrentLocation = async () => {
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
      
      // Update addresses state with current location
      const updatedAddresses = {
        ...addresses,
        current: formattedAddress || "Current location"
      };
      
      setAddresses(updatedAddresses);
      
      // Set the active address to the current location
      setActiveAddress('current');
      
      // Save to session storage
      sessionStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      sessionStorage.setItem('activeAddress', 'current');
      
      // Close the dropdown
      setAddressBarFocused(false);
    } catch (error) {
      console.error('Error getting current location:', error);
      setLocationError(error.message);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle pincode/zip code autofill
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setNewAddressData({
      ...newAddressData,
      pincode
    });
    
    // Only attempt autofill if the pincode is of proper length (e.g., 6 digits for India)
    if (pincode.length === 6) {
      setIsLoadingPincodeData(true);
      try {
        // In a real implementation, you would call an API to get location data based on pincode
        // For demonstration, we'll simulate a delay and provide mock data
        setTimeout(() => {
          // Mock response - in a real app, this would come from an API
          const mockPincodeData = {
            city: pincode.startsWith('4') ? 'Mumbai' : pincode.startsWith('5') ? 'Delhi' : 'Bangalore',
            state: pincode.startsWith('4') ? 'Maharashtra' : pincode.startsWith('5') ? 'Delhi' : 'Karnataka'
          };
          
          setNewAddressData(prev => ({
            ...prev,
            city: mockPincodeData.city,
            state: mockPincodeData.state
          }));
          
          setIsLoadingPincodeData(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        setIsLoadingPincodeData(false);
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData({
      ...newAddressData,
      [name]: value
    });
  };

  // Handle address type selection
  const handleAddressTypeChange = (type) => {
    setNewAddressData({
      ...newAddressData,
      type
    });
  };

  // Handle save address
  const handleSaveAddress = () => {
    const { addressLine, city, pincode, state, landmark, type } = newAddressData;
    
    // Basic validation
    if (!addressLine || !city || !pincode || !state) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Format the full address
    const fullAddress = `${addressLine}, ${city}, ${state} - ${pincode}${landmark ? `, Near ${landmark}` : ''}`;
    
    // Update addresses state with new address
    const updatedAddresses = {
      ...addresses,
      [type]: fullAddress
    };
    
    setAddresses(updatedAddresses);
    
    // Set active address to the new address
    setActiveAddress(type);
    
    // Save to session storage
    sessionStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    sessionStorage.setItem('activeAddress', type);
    
    // Reset form and close modal
    setNewAddressData({
      addressLine: '',
      city: '',
      pincode: '',
      state: '',
      landmark: '',
      type: 'home'
    });
    setShowAddressModal(false);
  };

  // Handle address selection
  const handleAddressSelection = (type) => {
    setActiveAddress(type);
    sessionStorage.setItem('activeAddress', type);
    setAddressBarFocused(false);
  };

  // Helper function to get display text for the address bar
  const getAddressDisplayText = () => {
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
                      {isLoadingLocation ? 'Getting location...' : 'Use current location'}
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
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-slate-800/70 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 modal-overlay p-4 sm:p-0">
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md animate-popIn"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Add New Address</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Address Type Selection */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
              <button 
                className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border transition ${newAddressData.type === 'home' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
                onClick={() => handleAddressTypeChange('home')}
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="text-xs sm:text-sm">Home</span>
              </button>
              
              <button 
                className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border transition ${newAddressData.type === 'work' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
                onClick={() => handleAddressTypeChange('work')}
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="text-xs sm:text-sm">Work</span>
              </button>
              
              <button 
                className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border transition ${newAddressData.type === 'other' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
                onClick={() => handleAddressTypeChange('other')}
              >
                <MapPinned className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="text-xs sm:text-sm">Other</span>
              </button>
            </div>
            
            {/* Address Form */}
            <div className="space-y-3 sm:space-y-4">
              {/* Address Line */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Address Line*</label>
                <input
                  type="text"
                  name="addressLine"
                  value={newAddressData.addressLine}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                  placeholder="Flat/House no., Building, Street"
                  required
                />
              </div>
              
              {/* Pincode with autofill */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Pincode/Zip Code*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="pincode"
                    value={newAddressData.pincode}
                    onChange={handlePincodeChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                    placeholder="Enter 6-digit pincode"
                    required
                  />
                  {isLoadingPincodeData && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader className="w-4 h-4 animate-spin text-slate-500" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* City and State (auto-filled based on pincode) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddressData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">State*</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddressData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              
              {/* Landmark (optional) */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={newAddressData.landmark}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                  placeholder="Nearby landmark"
                />
              </div>
              
              {/* Save Button */}
              <div className="flex justify-end pt-2">
                <button 
                  className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-4 sm:px-5 py-2 transition shadow text-sm"
                  onClick={handleSaveAddress}
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAddressBar;