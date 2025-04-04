import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';

const ShopRegistrationForm = () => {
  // State management for form data
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    alternateNumber: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    gstNumber: '',
    shopType: '',
    deliveryProvided: false,
    establishedDate: '',
    logo: null,
    businessHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '18:00' },
      sunday: { open: '', close: '' },
    },
  });
  
  // Form errors state
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  
  // Loading state
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form handling functions
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    
    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleNestedChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: value,
      },
    });
    
    // Clear error for this field if it exists
    const errorKey = `${category}.${field}`;
    if (errors[errorKey]) {
      setErrors({ ...errors, [errorKey]: null });
    }
  };

  const handleBusinessHoursChange = (day, timeType, value) => {
    setFormData({
      ...formData,
      businessHours: {
        ...formData.businessHours,
        [day]: {
          ...formData.businessHours[day],
          [timeType]: value,
        },
      },
    });
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Check file type
      const fileType = e.target.files[0].type;
      if (!fileType.startsWith('image/')) {
        setErrors({ ...errors, logo: 'Please upload only image files' });
        e.target.value = '';
        return;
      }
      
      // Check file size (5MB max)
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        setErrors({ ...errors, logo: 'File size should be less than 5MB' });
        e.target.value = '';
        return;
      }
      
      setFormData({ ...formData, logo: e.target.files[0] });
      setErrors({ ...errors, logo: null });
    }
  };

  const validateStep = (currentStep) => {
    let stepErrors = {};
    let isValid = true;
    
    if (currentStep === 1) {
      // Validate personal information
      if (!formData.firstName.trim()) {
        stepErrors.firstName = 'First name is required';
        isValid = false;
      }
      
      if (!formData.lastName.trim()) {
        stepErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        stepErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = 'Email is invalid';
        isValid = false;
      }
      
      if (!formData.phoneNumber.trim()) {
        stepErrors.phoneNumber = 'Phone number is required';
        isValid = false;
      } else if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
        stepErrors.phoneNumber = 'Phone number is invalid';
        isValid = false;
      }
      
      if (!formData.password) {
        stepErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 8) {
        stepErrors.password = 'Password must be at least 8 characters';
        isValid = false;
      } else if (!/\d/.test(formData.password) || !/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password)) {
        stepErrors.password = 'Password must contain at least one number, one lowercase and one uppercase letter';
        isValid = false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Validate address
      if (!formData.address.street.trim()) {
        stepErrors['address.street'] = 'Street address is required';
        isValid = false;
      }
      
      if (!formData.address.city.trim()) {
        stepErrors['address.city'] = 'City is required';
        isValid = false;
      }
      
      if (!formData.address.state.trim()) {
        stepErrors['address.state'] = 'State is required';
        isValid = false;
      }
      
      if (!formData.address.postalCode.trim()) {
        stepErrors['address.postalCode'] = 'Postal code is required';
        isValid = false;
      } else if (!/^\d{6}$/.test(formData.address.postalCode.trim())) {
        stepErrors['address.postalCode'] = 'Postal code must be 6 digits';
        isValid = false;
      }
    } else if (currentStep === 3) {
      // Validate shop details
      if (!formData.shopType) {
        stepErrors.shopType = 'Shop type is required';
        isValid = false;
      }
      
      if (formData.gstNumber && !/\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/.test(formData.gstNumber)) {
        stepErrors.gstNumber = 'Invalid GST number format';
        isValid = false;
      }
    } else if (currentStep === 4) {
      // Validate business hours
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      for (const day of days) {
        const open = formData.businessHours[day].open;
        const close = formData.businessHours[day].close;
        
        // Skip validation if both fields are empty (closed day)
        if (!open && !close) continue;
        
        // Check if one time is set but the other isn't
        if ((open && !close) || (!open && close)) {
          stepErrors[`businessHours.${day}`] = `Both opening and closing times must be set for ${day}`;
          isValid = false;
        }
        
        // Check if closing time is after opening time
        if (open && close && open >= close) {
          stepErrors[`businessHours.${day}`] = `Closing time must be after opening time for ${day}`;
          isValid = false;
        }
      }
    }
    
    setErrors(stepErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check
    if (!validateStep(step)) {
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      
      // Create shop owner data object
      const shopOwnerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber,
        alternateNumber: formData.alternateNumber || '',
        address: formData.address,
        shopDetails: {
          gstNumber: formData.gstNumber || '',
          shopType: formData.shopType,
          deliveryProvided: formData.deliveryProvided,
          establishedDate: formData.establishedDate || new Date().toISOString().split('T')[0],
          businessHours: formData.businessHours
        }
      };
      
      // Add JSON data to FormData
      formDataToSend.append('data', JSON.stringify(shopOwnerData));
      
      // Add logo file if it exists
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      
      // Send API request
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shops/register`, 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // Use AuthContext login function with the token from response
      if (response.data && response.data.token) {
        login(response.data.token, response.data.role || 'shop-owner', true);
        
        // Show success message and redirect
        alert('Registration successful! Redirecting to dashboard...');
        window.location.href = '/shop-owner-dashboard';
      } else {
        throw new Error('Invalid response from server');
      }
      
    } catch (error) {
      console.error('Shop registration error:', error);
      
      // Handle different types of errors
      if (error.response?.data?.errors) {
        // Handle validation errors from express-validator
        const validationErrors = {};
        error.response.data.errors.forEach(err => {
          validationErrors[err.param] = err.msg;
        });
        setErrors(validationErrors);
      } else if (error.response?.data?.message) {
        // Handle specific error message from the server
        setApiError(error.response.data.message);
      } else if (error.response?.status === 409) {
        // Handle conflict error (email already exists)
        setApiError('A user with this email already exists');
      } else if (error.response?.status === 500) {
        // Handle server error
        setApiError('Server error. Please try again later.');
      } else {
        // Display general error message
        setApiError('Registration failed. Please check your information and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Error display helper
  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <p className="text-red-500 text-xs mt-1">{errors[fieldName]}</p>
    ) : null;
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl text-slate-900 font-bold text-center mb-2 mt-20">Join as a Shop Owner</h1>
        <p className="text-center text-gray-600 mb-6">
          Create your professional profile and start connecting with customers in your area
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Step {step} of 4</span>
            <span className="text-sm">{step * 25}% Complete</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-slate-600 rounded-full"
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>
        </div>

        {/* API error display */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Registration Error</p>
            <p className="text-sm">{apiError}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Personal Information</h2>
              <div className="grid gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`pl-10 w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        placeholder="John"
                        required
                      />
                    </div>
                    {renderError('firstName')}
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`pl-10 w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        placeholder="Doe"
                        required
                      />
                    </div>
                    {renderError('lastName')}
                  </div>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  {renderError('email')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={`pl-10 w-full border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        placeholder="+91 9876543210"
                        required
                      />
                    </div>
                    {renderError('phoneNumber')}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      Alternate Number (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                      <input
                        type="tel"
                        name="alternateNumber"
                        value={formData.alternateNumber}
                        onChange={handleChange}
                        className="pl-10 w-full border border-gray-300 rounded-md p-2"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`pl-10 w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                    {renderError('password')}
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters long with a mix of uppercase, lowercase, numbers, and symbols
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="block mb-1 font-medium text-slate-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 w-full border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {renderError('confirmPassword')}
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Shop Address</h2>
              <div className="grid gap-5">
                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleNestedChange('address', 'street', e.target.value)}
                    className={`w-full border ${errors['address.street'] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                    placeholder="123 Main Street"
                    required
                  />
                  {renderError('address.street')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleNestedChange('address', 'city', e.target.value)}
                      className={`w-full border ${errors['address.city'] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                      placeholder="Mumbai"
                      required
                    />
                    {renderError('address.city')}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleNestedChange('address', 'state', e.target.value)}
                      className={`w-full border ${errors['address.state'] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                      placeholder="Maharashtra"
                      required
                    />
                    {renderError('address.state')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address.postalCode}
                      onChange={(e) => handleNestedChange('address', 'postalCode', e.target.value)}
                      className={`w-full border ${errors['address.postalCode'] ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                      placeholder="400001"
                      required
                    />
                    {renderError('address.postalCode')}
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-slate-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleNestedChange('address', 'country', e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                      placeholder="India"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">Shop Details</h2>
              <div className="grid gap-5">
                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    Shop Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="shopType"
                    value={formData.shopType}
                    onChange={handleChange}
                    className={`w-full border ${errors.shopType ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                    required
                  >
                    <option value="">Select shop type</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="service">Service</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="other">Other</option>
                  </select>
                  {renderError('shopType')}
                </div>

                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    Shop Logo
                  </label>
                  <input
                    type="file"
                    name="logo"
                    onChange={handleFileChange}
                    className={`w-full border ${errors.logo ? 'border-red-500' : 'border-gray-300'} rounded-md p-2`}
                    accept="image/*"
                  />
                  {renderError('logo')}
                  <p className="text-xs text-gray-500 mt-1">
                    Max file size: 5MB. Accepted formats: JPG, PNG, GIF
                  </p>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-slate-700">
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    name="gstNumber"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deliveryProvided"
                    name="deliveryProvided"
                    checked={formData.deliveryProvided}
                    onChange={(e) => setFormData({ ...formData, deliveryProvided: e.target.checked })}
                    className="h-4 w-4 text-slate-800"
                  />
                  <label htmlFor="deliveryProvided" className="ml-2 font-medium text-slate-700">
                    Delivery Service Provided
                  </label>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-slate-800">Business Hours</h2>
              <div className="grid gap-4 text-slate-700">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="grid grid-cols-3 items-center gap-2">
                    <div className="capitalize font-medium">{day}</div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-600">Opening Time</label>
                      <input
                        type="time"
                        value={formData.businessHours[day].open}
                        onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                        className="w-full border border-gray-300 text-slate-700 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm text-gray-600">Closing Time</label>
                      <input
                        type="time"
                        value={formData.businessHours[day].close}
                        onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                onClick={handleSubmit}
                className="ml-auto px-6 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Looking to sign up as a user instead?{' '}
            <a href="/SignUp" className="text-slate-900 underline font-medium">
              User Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationForm;