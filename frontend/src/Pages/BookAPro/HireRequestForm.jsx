import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, ChevronDown, Home, Briefcase, MapPinned, 
  Navigation, Loader, X, Plus, MapIcon, CheckCircle, AlertCircle 
} from 'lucide-react';
import { LocationService } from './LocationService'; // Importing the service from the second file
import axios from 'axios';

const HireRequestForm = ({ serviceType }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    serviceDescription: '',
    preferredDate: '',
    preferredTime: '',
    additionalInfo: '',
    serviceType: sessionStorage.getItem('hirenow') || '' // Adding fallback empty string
  });

  // Form validation errors
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    serviceDescription: '',
    preferredDate: '',
    preferredTime: '',
    serviceType: ''
  });

  // Form touched state for validation
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    contactNumber: false,
    address: false,
    serviceDescription: false,
    preferredDate: false,
    preferredTime: false,
    serviceType: false
  });

  // Address states - from the address bar
  const [addresses, setAddresses] = useState({
    home: '123 Main St, Anytown',
    work: '456 Business Ave, Commerce City',
    other: '',
    current: ''
  });
  
  const [activeAddress, setActiveAddress] = useState('');
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
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
  const [addressErrors, setAddressErrors] = useState({
    addressLine: '',
    city: '',
    pincode: '',
    state: '',
  });
  const [isLoadingPincodeData, setIsLoadingPincodeData] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10); // 10 seconds countdown
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const addressDropdownRef = useRef(null);
  const modalRef = useRef(null);
  
  // Load user data from session storage on component mount
  useEffect(() => {
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    
    if (userName) {
      setFormData(prev => ({ ...prev, name: userName }));
    }
    
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
    
    // Also load addresses if they exist in session storage
    const storedAddresses = sessionStorage.getItem('userAddresses');
    if (storedAddresses) {
      try {
        const parsedAddresses = JSON.parse(storedAddresses);
        setAddresses(prev => ({ ...prev, ...parsedAddresses }));
      } catch (error) {
        console.error('Error parsing addresses from session storage:', error);
      }
    }
  }, []);

  // Countdown timer effect for redirect
  useEffect(() => {
    let timer;
    if (showSuccessPopup && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      // Redirect to RequestResponse
      console.log('Redirecting to RequestResponse page...');
      // In a real implementation, you would use router to navigate
      // e.g., router.push('/request-response');
      // For this example, we'll just log it
      window.location.href = '/request-response'; // Uncomment in real implementation
    }
    
    return () => clearTimeout(timer);
  }, [showSuccessPopup, countdown]);

  // Close address dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (addressDropdownRef.current && !addressDropdownRef.current.contains(event.target)) {
        setAddressDropdownOpen(false);
      }
      
      if (modalRef.current && !modalRef.current.contains(event.target) && 
          !event.target.className?.includes('modal-overlay') && 
          !event.target.className?.includes('add-address-btn')) {
        setShowAddressModal(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Validate form field
  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errorMessage = 'Name is required';
        } else if (value.trim().length < 2) {
          errorMessage = 'Name must be at least 2 characters';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errorMessage = 'Email is required';
        } else if (!emailRegex.test(value)) {
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'contactNumber':
        const phoneRegex = /^\d{10}$/;
        if (!value.trim()) {
          errorMessage = 'Contact number is required';
        } else if (!phoneRegex.test(value)) {
          errorMessage = 'Please enter a valid contact number';
        }
        break;
      case 'address':
        if (!value.trim()) {
          errorMessage = 'Service location is required';
        }
        break;
      case 'serviceDescription':
        if (!value.trim()) {
          errorMessage = 'Service description is required';
        } else if (value.trim().length < 10) {
          errorMessage = 'Please provide more details (at least 10 characters)';
        }
        break;
      case 'preferredDate':
        if (!value) {
          errorMessage = 'Preferred date is required';
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate < today) {
            errorMessage = 'Date cannot be in the past';
          }
        }
        break;
      case 'preferredTime':
        if (!value) {
          errorMessage = 'Please select a preferred time slot';
        }
        break;
      case 'serviceType':
        if (!value || value.trim() === '') {
          errorMessage = 'Service type is required';
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  // Validate address field
  const validateAddressField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'addressLine':
        if (!value.trim()) {
          errorMessage = 'Address line is required';
        } else if (value.trim().length < 5) {
          errorMessage = 'Please enter a complete address';
        }
        break;
      case 'city':
        if (!value.trim()) {
          errorMessage = 'City is required';
        }
        break;
      case 'pincode':
        const pincodeRegex = /^[0-9]{5,6}$/;
        if (!value.trim()) {
          errorMessage = 'Pincode is required';
        } else if (!pincodeRegex.test(value)) {
          errorMessage = 'Please enter a valid pincode/ZIP';
        }
        break;
      case 'state':
        if (!value.trim()) {
          errorMessage = 'State is required';
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  // Handle form input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate if field has been touched
    if (touched[name]) {
      const errorMessage = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: errorMessage }));
    }
  };

  // Handle input blur for validation
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMessage = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  // Handle fetching the current location using LocationService
  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    try {
      // Use the LocationService from the imported file
      const locationData = await LocationService.getCurrentLocation();
      const formattedAddress = LocationService.formatLocation(locationData);
      
      // Update addresses state with current location
      setAddresses(prev => ({
        ...prev,
        current: formattedAddress
      }));
      
      // Set the active address and form data
      setActiveAddress('current');
      setFormData(prev => ({ ...prev, address: formattedAddress }));
      setTouched(prev => ({ ...prev, address: true }));
      setErrors(prev => ({ ...prev, address: '' }));
      
      // Save to session storage
      const updatedAddresses = { ...addresses, current: formattedAddress };
      sessionStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      
      // Close the dropdown
      setAddressDropdownOpen(false);
      setIsLoadingLocation(false);
    } catch (error) {
      console.error('Error getting current location:', error);
      setLocationError(error.message || "Unable to access your location. Please check your browser permissions.");
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
    
    // Validate pincode
    const pincodeError = validateAddressField('pincode', pincode);
    setAddressErrors(prev => ({ ...prev, pincode: pincodeError }));
    
    // Only attempt autofill if the pincode is of proper length (e.g., 6 digits for India)
    if (pincode.length === 6 && !pincodeError) {
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
          
          // Clear city and state errors if autofilled
          setAddressErrors(prev => ({
            ...prev,
            city: '',
            state: ''
          }));
          
          setIsLoadingPincodeData(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        setIsLoadingPincodeData(false);
      }
    }
  };

  // Handle input change for new address form with validation
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddressData({
      ...newAddressData,
      [name]: value
    });
    
    // Validate address field
    const errorMessage = validateAddressField(name, value);
    setAddressErrors(prev => ({ ...prev, [name]: errorMessage }));
  };

  // Handle address type selection
  const handleAddressTypeChange = (type) => {
    setNewAddressData({
      ...newAddressData,
      type
    });
  };

  // Validate entire address form
  const validateAddressForm = () => {
    const fields = ['addressLine', 'city', 'pincode', 'state'];
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      const error = validateAddressField(field, newAddressData[field]);
      newErrors[field] = error;
      if (error) {
        isValid = false;
      }
    });
    
    setAddressErrors(newErrors);
    return isValid;
  };

  // Handle save address
  const handleSaveAddress = () => {
    // Validate all address fields
    if (!validateAddressForm()) {
      return;
    }
    
    const { addressLine, city, pincode, state, landmark, type } = newAddressData;
    
    // Format the full address
    const fullAddress = `${addressLine}, ${city}, ${state} - ${pincode}${landmark ? `, Near ${landmark}` : ''}`;
    
    // Update addresses state with new address
    const updatedAddresses = {
      ...addresses,
      [type]: fullAddress
    };
    
    setAddresses(updatedAddresses);
    
    // Set active address to the new address and update form data
    setActiveAddress(type);
    setFormData(prev => ({ ...prev, address: fullAddress }));
    setTouched(prev => ({ ...prev, address: true }));
    setErrors(prev => ({ ...prev, address: '' }));
    
    // Save to session storage
    sessionStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    
    // Reset form and close modal
    setNewAddressData({
      addressLine: '',
      city: '',
      pincode: '',
      state: '',
      landmark: '',
      type: 'home'
    });
    setAddressErrors({});
    setShowAddressModal(false);
  };

  // Handle selecting an existing address
  const handleSelectAddress = (type) => {
    setActiveAddress(type);
    setFormData(prev => ({ ...prev, address: addresses[type] }));
    setTouched(prev => ({ ...prev, address: true }));
    setErrors(prev => ({ ...prev, address: '' }));
    setAddressDropdownOpen(false);
  };

  // Validate the entire form
  const validateForm = () => {
    const formFields = ['name', 'email', 'contactNumber', 'address', 'serviceDescription', 'preferredDate', 'preferredTime', 'serviceType'];
    const newErrors = {};
    let isValid = true;
    
    formFields.forEach(field => {
      const error = validateField(field, formData[field]);
      newErrors[field] = error;
      if (error) {
        isValid = false;
      }
    });
    
    // Update all fields as touched and set errors
    const allTouched = {};
    formFields.forEach(field => {
      allTouched[field] = true;
    });
    
    setTouched(allTouched);
    setErrors(newErrors);
    
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('.error-message');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    // Get the service type from sessionStorage before submission
    const serviceTypeFromStorage = sessionStorage.getItem('hirenow') || '';
    
    // Save user details to session storage
    sessionStorage.setItem('userName', formData.name);
    sessionStorage.setItem('userEmail', formData.email);
    // Update state to show loading
    setIsSubmitting(true);
    
    try {
      // Format date to ISO string for API (if it's not already)
      const apiFormData = {
        ...formData,
        // Ensure serviceType is set correctly - use the prop value or session storage as fallback
        serviceType: formData.serviceType || serviceTypeFromStorage || serviceType,
        preferredDate: formData.preferredDate instanceof Date 
          ? formData.preferredDate.toISOString() 
          : formData.preferredDate
      };
      
      // Use axios to make the API request
      const response = await axios.post(
        'http://localhost:5500/api/users/hire-requests',
        apiFormData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const data = response.data;
      
      // Check for success property as defined in your backend
      if (!data.success) {
        console.log('Form data before submission:', formData);
        throw new Error(data.message || 'Failed to submit request');
  
      }
      
      console.log('Form submitted successfully:', data);
      
      // Store the request ID for reference on the response page
      if (data.requestId) {
        sessionStorage.setItem('lastRequestId', data.requestId);
      }
      
      // Update UI state for success
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setShowSuccessPopup(true);
      
      // Reset form - will happen after redirect
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          name: sessionStorage.getItem('userName') || '',
          email: sessionStorage.getItem('userEmail') || '',
          contactNumber: '',
          address: '',
          serviceDescription: '',
          preferredDate: '',
          preferredTime: '',
          additionalInfo: '',
          serviceType: sessionStorage.getItem('hirenow') || ''
        });
        setActiveAddress('');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      
      // Handle error based on your backend response structure
      if (error.response) {
        const { data, status } = error.response;
        
        // Handle validation errors from backend (matching your express-validator format)
        if (data.errors && Array.isArray(data.errors)) {
          // Map backend validation errors to frontend error state
          const backendErrors = {};
          data.errors.forEach(error => {
            backendErrors[error.param] = error.msg;
          });
          
          setErrors(prev => ({
            ...prev,
            ...backendErrors
          }));
          
          // Scroll to first error
          const firstErrorField = document.querySelector('.error-message');
          if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          
          alert('Please fix the highlighted errors');
          return;
        }
        
        // Handle specific status codes
        if (status === 400) {
          alert(`Validation error: ${data.message || 'Please check your input'}`);
        } else if (status === 404) {
          alert('Resource not found');
        } else if (status === 500) {
          alert('Server error: Please try again later');
        } else {
          alert(`Error (${status}): ${data.message || 'An error occurred'}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        alert(`Error: ${error.message || 'An unexpected error occurred'}`);
      }
    }
  };

  // Input field animation variants
  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };


  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 md:px-8 bg-slate-50">
    <motion.div 
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-xl border border-slate-100 relative mt-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-12 relative px-4 py-6"
    >
      {/* Background decorative elements */}
      <div className="absolute -left-4 -top-4 w-20 h-20 bg-slate-100 rounded-full opacity-50 -z-10"></div>
      <div className="absolute right-12 bottom-4 w-16 h-16 bg-slate-100 rounded-full opacity-30 -z-10"></div>
      
      <div className="flex flex-col items-center gap-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">Request Service</h2>
          <p className="text-slate-500 text-lg">Fill in the details to request our services</p>
        </div>
        
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-6 rounded-full shadow-md flex items-center justify-center"
        >
          <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
          <span className="font-medium">Live Services</span>
        </motion.div>
      </div>
    </motion.div>
      <motion.form 
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Personal Details Section */}
        <motion.div variants={inputVariants} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">1</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Personal Details</h3>
              <p className="text-slate-500 text-sm mt-1">Please provide your contact information</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <motion.div variants={inputVariants}>
              <label htmlFor="name" className="block text-slate-700 font-medium mb-1">
                Full Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-slate-500'} bg-white/80 backdrop-blur-sm transition-all duration-300`}
                placeholder="Enter your full name"
              />
              {errors.name && touched.name && (
                <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={inputVariants}>
                <label htmlFor="email" className="block text-slate-700 font-medium mb-1">
                  Email Address<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-slate-500'} bg-white/80 backdrop-blur-sm transition-all duration-300`}
                  placeholder="your@email.com"
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.email}
                  </p>
                )}
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="contactNumber" className="block text-slate-700 font-medium mb-1">
                  Contact Number<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border ${errors.contactNumber ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.contactNumber ? 'focus:ring-red-500' : 'focus:ring-slate-500'} bg-white/80 backdrop-blur-sm transition-all duration-300`}
                  placeholder="1234567890"
                />
                {errors.contactNumber && touched.contactNumber && ( 
                  <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.contactNumber}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Service Details Section */}
        <motion.div variants={inputVariants} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-md">2</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Service Details</h3>
              <p className="text-slate-500 text-sm mt-1">Tell us what service you need and when</p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Service Location with Address Dropdown */}
            <motion.div variants={inputVariants} className="relative" ref={addressDropdownRef}>
              <label htmlFor="address" className="block text-slate-700 font-medium mb-1">
                Service Location<span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 group-hover:text-slate-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address || (activeAddress ? addresses[activeAddress] : '')}
                  readOnly
                  className={`w-full pl-10 pr-10 py-3 border ${errors.address ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.address ? 'focus:ring-red-500' : 'focus:ring-slate-500'} group-hover:border-slate-400 bg-white/80 backdrop-blur-sm transition-all duration-300`}
                  placeholder="Select service location"
                  onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${addressDropdownOpen ? 'transform rotate-180' : ''}`} />
                </div>
              </div>
              {errors.address && touched.address && (
                <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  {errors.address}
                </p>
              )}

              {/* Address Dropdown Menu */}
              {addressDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-20"
                >
                  <div className="p-3 max-h-64 overflow-y-auto">
                    {/* Home Address */}
                    {addresses.home && (
                      <motion.button 
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        type="button"
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'home' ? 'bg-slate-800 text-white' : ''}`}
                        onClick={() => handleSelectAddress('home')}
                      >
                        <Home className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Home</div>
                          <div className="text-xs opacity-80 truncate">{addresses.home}</div>
                        </div>
                      </motion.button>
                    )}
                    
                    {/* Work Address */}
                    {addresses.work && (
                      <motion.button 
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        type="button"
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'work' ? 'bg-slate-800 text-white' : ''}`}
                        onClick={() => handleSelectAddress('work')}
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Work</div>
                          <div className="text-xs opacity-80 truncate">{addresses.work}</div>
                        </div>
                      </motion.button>
                    )}
                    
                    {/* Other Address */}
                    {addresses.other && (
                      <motion.button 
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        type="button"
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'other' ? 'bg-slate-800 text-white' : ''}`}
                        onClick={() => handleSelectAddress('other')}
                      >
                        <MapPinned className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Other</div>
                          <div className="text-xs opacity-80 truncate">{addresses.other}</div>
                        </div>
                      </motion.button>
                    )}
                    
                    {/* Current Location */}
                    {addresses.current && (
                      <motion.button 
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        type="button"
                        className={`w-full flex items-center px-3 py-2 mb-2 rounded-lg transition ${activeAddress === 'current' ? 'bg-slate-800 text-white' : ''}`}
                        onClick={() => handleSelectAddress('current')}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">Current Location</div>
                          <div className="text-xs opacity-80 truncate">{addresses.current}</div>
                        </div>
                      </motion.button>
                    )}
                    
                    <div className={`${Object.values(addresses).some(addr => addr) ? 'border-t border-slate-200 pt-3' : ''}`}>
                      {/* Current Location Button */}
                      <motion.button 
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        type="button"
                        className="w-full flex items-center px-3 py-2 mb-2 rounded-lg transition text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleGetCurrentLocation}
                        disabled={isLoadingLocation}
                      >
                        {isLoadingLocation ? (
                          <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            <span>Getting location...</span>
                          </>
                        ) : (
                          <>
                            <Navigation className="w-4 h-4 mr-2" />
                            <span>Use current location</span>
                          </>
                        )}
                      </motion.button>
                      
                      {locationError && (
                        <div className="text-xs text-red-500 mb-2 px-3">
                          {locationError}
                        </div>
                      )}
                      
                      {/* Add New Address Button */}
                      <motion.button 
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 1)" }}
                        type="button"
                        className="w-full flex items-center px-3 py-2 rounded-lg transition text-slate-600 add-address-btn"
                        onClick={() => setShowAddressModal(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span>Add new address</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Service Description */}
            <motion.div variants={inputVariants}>
              <label htmlFor="serviceDescription" className="block text-slate-700 font-medium mb-1">
                Service Description<span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="serviceDescription"
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-3 border ${errors.serviceDescription ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.serviceDescription ? 'focus:ring-red-500' : 'focus:ring-slate-500'} bg-white/80 backdrop-blur-sm transition-all duration-300 min-h-[100px]`}
                placeholder="Please describe the service you need in detail..."
              />
              {errors.serviceDescription && touched.serviceDescription && (
                <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  {errors.serviceDescription}
                </p>
              )}
            </motion.div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={inputVariants}>
                <label htmlFor="preferredDate" className="block text-slate-700 font-medium mb-1">
                  Preferred Date<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min={new Date().toISOString().split('T')[0]} // Set min to today
                  className={`w-full px-4 py-3 border ${errors.preferredDate ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.preferredDate ? 'focus:ring-red-500' : 'focus:ring-slate-500'} bg-white/80 backdrop-blur-sm transition-all duration-300`}
                />
                {errors.preferredDate && touched.preferredDate && (
                  <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.preferredDate}
                  </p>
                )}
              </motion.div>

              <motion.div variants={inputVariants}>
                <label htmlFor="preferredTime" className="block text-slate-700 font-medium mb-1">
                  Preferred Time<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 border ${errors.preferredTime ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.preferredTime ? 'focus:ring-red-500' : 'focus:ring-slate-500'} bg-white/80 backdrop-blur-sm transition-all duration-300 appearance-none`}
                >
                  <option value="">Select a time slot</option>
                  <option value="morning">Morning (8 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 8 PM)</option>
                </select>
                {errors.preferredTime && touched.preferredTime && (
                  <p className="mt-1 text-red-500 text-sm flex items-center error-message">
                    <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                    {errors.preferredTime}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Additional Information */}
            <motion.div variants={inputVariants}>
              <label htmlFor="additionalInfo" className="block text-slate-700 font-medium mb-1">
                Additional Information <span className="text-slate-400 text-sm">(Optional)</span>
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white/80 backdrop-blur-sm transition-all duration-300"
                placeholder="Any additional details or special requirements..."
                rows={3}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          variants={inputVariants}
          className="flex justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-3 px-8 rounded-lg shadow-lg flex items-center justify-center text-lg font-medium disabled:opacity-70 disabled:cursor-not-allowed min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm modal-overlay">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Add New Address</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Address Type Selection */}
              <div className="flex space-x-3 mb-4">
                <button 
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg text-center transition ${newAddressData.type === 'home' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                  onClick={() => handleAddressTypeChange('home')}
                >
                  <Home className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Home</span>
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg text-center transition ${newAddressData.type === 'work' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                  onClick={() => handleAddressTypeChange('work')}
                >
                  <Briefcase className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Work</span>
                </button>
                <button 
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-lg text-center transition ${newAddressData.type === 'other' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}
                  onClick={() => handleAddressTypeChange('other')}
                >
                  <MapPinned className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-xs">Other</span>
                </button>
              </div>
              
              {/* Address Line */}
              <div>
                <label htmlFor="addressLine" className="block text-slate-700 text-sm font-medium mb-1">
                  Address Line<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="addressLine"
                  name="addressLine"
                  value={newAddressData.addressLine}
                  onChange={handleAddressInputChange}
                  className={`w-full px-3 py-2 border ${addressErrors.addressLine ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500`}
                  placeholder="House/Flat No., Street, Area"
                />
                {addressErrors.addressLine && (
                  <p className="mt-1 text-red-500 text-xs">
                    {addressErrors.addressLine}
                  </p>
                )}
              </div>
              
              {/* Pincode with Autofill */}
              <div>
                <label htmlFor="pincode" className="block text-slate-700 text-sm font-medium mb-1">
                  Pincode/ZIP<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={newAddressData.pincode}
                    onChange={handlePincodeChange}
                    className={`w-full px-3 py-2 border ${addressErrors.pincode ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500`}
                    placeholder="Enter pincode/ZIP"
                    maxLength={6}
                  />
                  {isLoadingPincodeData && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  )}
                </div>
                {addressErrors.pincode && (
                  <p className="mt-1 text-red-500 text-xs">
                    {addressErrors.pincode}
                  </p>
                )}
              </div>
              
              {/* City and State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city" className="block text-slate-700 text-sm font-medium mb-1">
                    City<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={newAddressData.city}
                    onChange={handleAddressInputChange}
                    className={`w-full px-3 py-2 border ${addressErrors.city ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500`}
                    placeholder="City"
                  />
                  {addressErrors.city && (
                    <p className="mt-1 text-red-500 text-xs">
                      {addressErrors.city}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-slate-700 text-sm font-medium mb-1">
                    State<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={newAddressData.state}
                    onChange={handleAddressInputChange}
                    className={`w-full px-3 py-2 border ${addressErrors.state ? 'border-red-300 bg-red-50' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500`}
                    placeholder="State"
                  />
                  {addressErrors.state && (
                    <p className="mt-1 text-red-500 text-xs">
                      {addressErrors.state}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Landmark */}
              <div>
                <label htmlFor="landmark" className="block text-slate-700 text-sm font-medium mb-1">
                  Landmark <span className="text-slate-400 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={newAddressData.landmark}
                  onChange={(e) => setNewAddressData({...newAddressData, landmark: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  placeholder="Near..."
                />
              </div>
              
              {/* Save Button */}
              <button
                type="button"
                onClick={handleSaveAddress}
                className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition mt-2"
              >
                Save Address
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md m-4 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Request Submitted</h3>
            <p className="text-slate-600 mb-6">
              Your service request has been submitted successfully. You will be redirected to track your request.
            </p>
            
            <p className="text-slate-700 text-sm flex justify-center items-center gap-1">
                <MapIcon className="w-4 h-4 mr-1" />
                Redirecting in {countdown} seconds...
            </p>

          </motion.div>
        </div>
      )}
    </motion.div>
    </div>
  );
};


export default HireRequestForm;