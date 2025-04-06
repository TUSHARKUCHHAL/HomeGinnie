import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    alternateNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    password: '',
    confirmPassword: ''
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    alternateNumber: '',
    'address.street': '',
    'address.city': '',
    'address.state': '',
    'address.zipCode': '',
    'address.country': '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const { data } = await axios.get('http://localhost:5500/api/users/profile', config);
        
        // Ensure all required nested objects exist
        const userData = {
          ...data,
          address: data.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
          }
        };
        
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          alternateNumber: userData.alternateNumber || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || '',
            country: userData.address?.country || ''
          },
          password: '',
          confirmPassword: ''
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Validate a single field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'This field is required';
        else if (value.trim().length < 2) error = 'Must be at least 2 characters';
        break;
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      case 'phoneNumber':
        if (value.trim() && !/^\d{10}$/.test(value.replace(/[^\d]/g, '')))
          error = 'Phone number must be 10 digits';
        break;
      case 'alternateNumber':
        if (value.trim() && !/^\d{10}$/.test(value.replace(/[^\d]/g, '')))
          error = 'Phone number must be 10 digits';
        break;
      case 'address.zipCode':
        if (value.trim() && !/^\d{5}(-\d{4})?$/.test(value.trim()))
          error = 'Invalid ZIP code format';
        break;
      case 'password':
        if (value.trim() && value.length < 6)
          error = 'Password must be at least 6 characters';
        break;
      case 'confirmPassword':
        if (value.trim() && value !== formData.password)
          error = 'Passwords do not match';
        break;
      default:
        break;
    }
    
    return error;
  };

  // Validate all fields before submission
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Personal Info
    errors.firstName = validateField('firstName', formData.firstName);
    errors.lastName = validateField('lastName', formData.lastName);
    errors.email = validateField('email', formData.email);
    errors.phoneNumber = validateField('phoneNumber', formData.phoneNumber);
    errors.alternateNumber = validateField('alternateNumber', formData.alternateNumber);
    
    // Address - Only validate if provided
    if (formData.address.street || formData.address.city || formData.address.state || formData.address.zipCode || formData.address.country) {
      errors['address.zipCode'] = validateField('address.zipCode', formData.address?.zipCode);
    }
    
    // Password - Only validate if updating password
    if (formData.password) {
      errors.password = validateField('password', formData.password);
      errors.confirmPassword = validateField('confirmPassword', formData.confirmPassword);
    }
    
    // Check if any errors exist
    for (const key in errors) {
      if (errors[key]) {
        isValid = false;
        break;
      }
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
    
    // Validate field on change
    const errorMessage = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = validateForm();
    if (!isValid) {
      setError('Please fix the form errors before submitting');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };
      
      // Only send fields that were updated
      const updatedData = {};
      
      // Personal info
      if (formData.firstName) updatedData.firstName = formData.firstName;
      if (formData.lastName) updatedData.lastName = formData.lastName;
      if (formData.email) updatedData.email = formData.email;
      if (formData.phoneNumber) updatedData.phoneNumber = formData.phoneNumber;
      if (formData.alternateNumber) updatedData.alternateNumber = formData.alternateNumber;
      
      // Password - only include if provided
      if (formData.password) updatedData.password = formData.password;
      
      // Address - only include if any address field was provided
      if (Object.values(formData.address).some(val => val)) {
        updatedData.address = {};
        for (const key in formData.address) {
          if (formData.address[key]) {
            updatedData.address[key] = formData.address[key];
          }
        }
      }
      
      const { data } = await axios.put('http://localhost:5500/api/users/profile', updatedData, config);
      
      // Update form data with response
      setFormData(prev => ({
        ...prev,
        firstName: data.firstName || prev.firstName,
        lastName: data.lastName || prev.lastName,
        email: data.email || prev.email,
        phoneNumber: data.phoneNumber || prev.phoneNumber,
        alternateNumber: data.alternateNumber || prev.alternateNumber,
        address: {
          street: data.address?.street || prev.address.street,
          city: data.address?.city || prev.address.city,
          state: data.address?.state || prev.address.state,
          zipCode: data.address?.zipCode || prev.address.zipCode,
          country: data.address?.country || prev.address.country
        },
        password: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Update token if returned
      if (data.token) {
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  // Helper function for input field rendering with validation
  const renderInputField = (label, name, type = 'text', required = false, placeholder = '') => {
    // Get the actual value from nested objects if needed
    let value = '';
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      value = formData[parent]?.[child] || '';
    } else {
      value = formData[name] || '';
    }
    
    const errorMessage = validationErrors[name];
    
    return (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <>
            <input
              type={type}
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              className={`shadow appearance-none border ${
                errorMessage ? 'border-red-500' : 'border-gray-300'
              } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
                errorMessage ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder={placeholder}
              required={required}
            />
            {errorMessage && (
              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}
          </>
        ) : (
          <p className="text-gray-800">{value || 'Not provided'}</p>
        )}
      </div>
    );
  };

  if (loading && !formData.firstName) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <button
                onClick={() => {
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    // Reset validation errors when canceling edit
                    setValidationErrors({});
                    setError(null);
                  }
                }}
                className="bg-white text-slate-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
                type="button"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Success and Error Messages */}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-6 mt-4" role="alert">
              <span className="block sm:inline">{success}</span>
              <button 
                className="absolute top-0 right-0 px-4 py-3" 
                onClick={() => setSuccess('')}
                type="button"
                aria-label="Close"
              >
                <span className="text-green-500">&times;</span>
              </button>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-6 mt-4" role="alert">
              <span className="block sm:inline">{error}</span>
              <button 
                className="absolute top-0 right-0 px-4 py-3" 
                onClick={() => setError(null)}
                type="button"
                aria-label="Close"
              >
                <span className="text-red-500">&times;</span>
              </button>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInputField('First Name', 'firstName', 'text', true)}
                    {renderInputField('Last Name', 'lastName', 'text', true)}
                    {renderInputField('Email', 'email', 'email', true)}
                    {renderInputField('Phone Number', 'phoneNumber', 'tel')}
                    {renderInputField('Alternate Number', 'alternateNumber', 'tel')}
                  </div>
                </div>

                {/* Address Information */}
                <div className="col-span-2 mt-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      {renderInputField('Street Address', 'address.street')}
                    </div>
                    {renderInputField('City', 'address.city')}
                    {renderInputField('State/Province', 'address.state')}
                    {renderInputField('ZIP/Postal Code', 'address.zipCode')}
                    {renderInputField('Country', 'address.country')}
                  </div>
                </div>

                {/* Password Update */}
                {isEditing && (
                  <div className="col-span-2 mt-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Change Password</h2>
                    <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderInputField('New Password', 'password', 'password')}
                      {renderInputField('Confirm New Password', 'confirmPassword', 'password')}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end mt-8">
                  <button
                    type="submit"
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>

            {/* View Only Mode */}
            {!isEditing && (
              <div className="space-y-8">
                {/* Personal Information Display */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-base text-gray-900">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-900">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-base text-gray-900">{formData.phoneNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Alternate Number</p>
                      <p className="text-base text-gray-900">{formData.alternateNumber || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Address Information Display */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Address</h2>
                  {Object.values(formData.address).some(val => val) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Street Address</p>
                        <p className="text-base text-gray-900">{formData.address.street || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">City</p>
                        <p className="text-base text-gray-900">{formData.address.city || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">State/Province</p>
                        <p className="text-base text-gray-900">{formData.address.state || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">ZIP/Postal Code</p>
                        <p className="text-base text-gray-900">{formData.address.zipCode || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Country</p>
                        <p className="text-base text-gray-900">{formData.address.country || 'Not provided'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base text-gray-500 italic">No address information provided</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;