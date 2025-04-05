import React, { useState, useEffect, useRef } from 'react';
import { Home, Briefcase, MapPinned, X, Loader } from 'lucide-react';

const AddressModal = ({ isOpen, onClose, onSave }) => {
  const [showAddressModal, setShowAddressModal] = useState(isOpen);
  const [isLoadingPincodeData, setIsLoadingPincodeData] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const modalRef = useRef(null);
  
  const [newAddressData, setNewAddressData] = useState({
    type: 'home',
    addressLine: '',
    pincode: '',
    city: '',
    state: '',
    landmark: ''
  });

  useEffect(() => {
    setShowAddressModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    // Close modal on ESC key press
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && showAddressModal) {
        setShowAddressModal(false);
        onClose();
      }
    };

    // Close modal when clicking outside
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          event.target.classList.contains('modal-overlay')) {
        setShowAddressModal(false);
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressModal, onClose]);

  const handleAddressTypeChange = (type) => {
    setNewAddressData({ ...newAddressData, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData({ ...newAddressData, [name]: value });
  };

  const handlePincodeChange = async (e) => {
    const { value } = e.target;
    setNewAddressData({ ...newAddressData, pincode: value });
    
    // Only fetch data if pincode is 6 digits
    if (value.length === 6) {
      try {
        setIsLoadingPincodeData(true);
        const locationData = await fetchLocationByPincode(value);
        setNewAddressData(prev => ({
          ...prev,
          city: locationData.city || '',
          state: locationData.state || ''
        }));
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoadingPincodeData(false);
      }
    }
  };

  const fetchLocationByPincode = async (pincode) => {
    // Simulating API call to get location data
    // Replace with actual API call in production
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock response - replace with actual API call
        const mockLocations = {
          '110001': { city: 'New Delhi', state: 'Delhi' },
          '400001': { city: 'Mumbai', state: 'Maharashtra' },
          '700001': { city: 'Kolkata', state: 'West Bengal' },
          // Add more mock data as needed
        };
        
        resolve(mockLocations[pincode] || { city: '', state: '' });
      }, 800);
    });
  };

  const handleSaveAddress = async () => {
    // Validate required fields
    if (!newAddressData.addressLine || !newAddressData.pincode || 
        !newAddressData.city || !newAddressData.state) {
      alert('Please fill all required fields');
      return;
    }
    
    setIsSavingAddress(true);
    
    try {
      // Call the onSave function passed from parent with new address data
      await onSave(newAddressData);
      
      // Reset form and close modal
      setNewAddressData({
        type: 'home',
        addressLine: '',
        pincode: '',
        city: '',
        state: '',
        landmark: ''
      });
      
      setShowAddressModal(false);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      alert('Failed to save address. Please try again.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  // Don't render anything if modal is not shown
  if (!showAddressModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-800/70 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 modal-overlay p-4 sm:p-0">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md animate-popIn"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Add New Address</h3>
          <button 
            onClick={() => {
              setShowAddressModal(false);
              onClose();
            }}
            className="text-slate-500 hover:text-slate-700"
            disabled={isSavingAddress}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Address Type Selection */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
          <button 
            className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border transition ${newAddressData.type === 'home' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
            onClick={() => handleAddressTypeChange('home')}
            disabled={isSavingAddress}
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
            <span className="text-xs sm:text-sm">Home</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border transition ${newAddressData.type === 'work' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
            onClick={() => handleAddressTypeChange('work')}
            disabled={isSavingAddress}
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
            <span className="text-xs sm:text-sm">Work</span>
          </button>
          
          <button 
            className={`flex flex-col items-center justify-center py-2 sm:py-3 rounded-lg border transition ${newAddressData.type === 'other' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
            onClick={() => handleAddressTypeChange('other')}
            disabled={isSavingAddress}
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
              disabled={isSavingAddress}
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
                disabled={isSavingAddress}
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
                disabled={isSavingAddress}
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
                disabled={isSavingAddress}
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
              disabled={isSavingAddress}
            />
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button 
              className="bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg px-4 sm:px-5 py-2 transition shadow text-sm flex items-center"
              onClick={handleSaveAddress}
              disabled={isSavingAddress}
            >
              {isSavingAddress ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Address'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;