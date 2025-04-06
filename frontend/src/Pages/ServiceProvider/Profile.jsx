import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceProviderProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    alternateNumber: '',
    about: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
    },
    services: [],
    experience: {
      years: 0,
      description: '',
    },
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
    'address.postalCode': '',
    'experience.years': '',
  });

  // Available services options
  const serviceOptions = [
    'Cleaning', 'Plumbing', 'Electrical', 'HVAC', 
    'Landscaping', 'Painting', 'Carpentry', 'Home Renovation',
    'Pest Control', 'Appliance Repair', 'Roofing'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get('http://localhost:5500/api/service-providers/profile', config);
        
        // Ensure all required nested objects exist
        const formattedData = {
          ...data,
          address: data.address || {
            street: '',
            city: '',
            state: '',
            postalCode: '',
          },
          services: Array.isArray(data.services) ? data.services : [],
          experience: data.experience || {
            years: 0,
            description: '',
          }
        };
        
        setProfileData(formattedData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
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
        if (!value.trim()) error = 'Phone number is required';
        else if (!/^\d{10}$/.test(value.replace(/[^\d]/g, ''))) 
          error = 'Phone number must be 10 digits';
        break;
      case 'alternateNumber':
        if (value.trim() && !/^\d{10}$/.test(value.replace(/[^\d]/g, ''))) 
          error = 'Phone number must be 10 digits';
        break;
      case 'address.street':
      case 'address.city':
      case 'address.state':
        if (!value.trim()) error = 'This field is required';
        break;
      case 'address.postalCode':
        if (!value.trim()) error = 'Postal code is required';
        else if (!/^\d{5}(-\d{4})?$/.test(value.trim())) error = 'Invalid postal code format';
        break;
      case 'experience.years':
        if (value < 0) error = 'Years must be a positive number';
        break;
      default:
        break;
    }
    
    return error;
  };

  // Validate all fields at once
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Personal Info
    errors.firstName = validateField('firstName', profileData.firstName);
    errors.lastName = validateField('lastName', profileData.lastName);
    errors.email = validateField('email', profileData.email);
    errors.phoneNumber = validateField('phoneNumber', profileData.phoneNumber);
    errors.alternateNumber = validateField('alternateNumber', profileData.alternateNumber);
    
    // Address
    errors['address.street'] = validateField('address.street', profileData.address?.street);
    errors['address.city'] = validateField('address.city', profileData.address?.city);
    errors['address.state'] = validateField('address.state', profileData.address?.state);
    errors['address.postalCode'] = validateField('address.postalCode', profileData.address?.postalCode);
    
    // Experience
    errors['experience.years'] = validateField('experience.years', profileData.experience?.years);
    
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
      setProfileData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setProfileData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
    
    // Validate field on change
    const errorMessage = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleServiceChange = (service) => {
    setProfileData(prevData => {
      const currentServices = Array.isArray(prevData.services) ? [...prevData.services] : [];
      
      return {
        ...prevData,
        services: currentServices.includes(service)
          ? currentServices.filter((s) => s !== service)
          : [...currentServices, service],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const isValid = validateForm();
    if (!isValid) {
      setError('Please fix the form errors before submitting');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      // Create a copy of the profile data to ensure services is an array
      const dataToSubmit = {
        ...profileData,
        services: Array.isArray(profileData.services) ? profileData.services : [],
      };

      const { data } = await axios.put(
        'http://localhost:5500/api/service-providers/profile', 
        dataToSubmit, 
        config
      );
      
      // Ensure all required nested objects exist in response and preserve services
      const formattedData = {
        ...data,
        address: data.address || profileData.address,
        // Explicitly ensure services is preserved from both response and current state
        services: Array.isArray(data.services) ? data.services : 
                 (Array.isArray(profileData.services) ? profileData.services : []),
        experience: data.experience || profileData.experience
      };
      
      setProfileData(formattedData);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Refresh token if returned from API
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      // Clear success message after 3 seconds
      if (success) {
        setTimeout(() => setSuccess(''), 3000);
      }
    }
  };

  if (loading && !profileData.firstName) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Helper function for input field rendering with validation
  const renderInputField = (label, name, type = 'text', required = true, placeholder = '') => {
    // Get the actual value from nested objects if needed
    let value = '';
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      value = profileData[parent]?.[child] || '';
    } else {
      value = profileData[name] || '';
    }
    
    const errorMessage = validationErrors[name];
    
    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {isEditing ? (
          <div>
            <input
              type={type}
              id={name}
              name={name}
              value={value}
              onChange={handleChange}
              className={`w-full p-2 border ${
                errorMessage ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 ${
                errorMessage ? 'focus:ring-red-500' : 'focus:ring-blue-500'
              }`}
              placeholder={placeholder}
              required={required}
            />
            {errorMessage && (
              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-800">{value || 'Not provided'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-slate-800 py-6 px-8">
            <div className="flex justify-between items-center">
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
                className="px-4 py-2 bg-white text-slate-900 rounded-md font-medium shadow hover:bg-gray-100 transition"
                type="button"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert">
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

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mx-8 mt-4" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderInputField('First Name', 'firstName')}
                    {renderInputField('Last Name', 'lastName')}
                    {renderInputField('Email', 'email', 'email')}
                    {renderInputField('Phone Number', 'phoneNumber', 'tel')}
                    {renderInputField('Alternate Number', 'alternateNumber', 'tel', false)}
                  </div>
                </div>

                {/* Address Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      {renderInputField('Street', 'address.street')}
                    </div>
                    {renderInputField('City', 'address.city')}
                    {renderInputField('State', 'address.state')}
                    {renderInputField('Postal Code', 'address.postalCode')}
                  </div>
                </div>

                {/* Professional Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
                  
                  {/* Services */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Offered <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {serviceOptions.map((service) => (
                            <div key={service} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`service-${service}`}
                                checked={Array.isArray(profileData.services) && profileData.services.includes(service)}
                                onChange={() => handleServiceChange(service)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                aria-label={service}
                              />
                              <label htmlFor={`service-${service}`} className="ml-2 text-sm text-gray-700">
                                {service}
                              </label>
                            </div>
                          ))}
                        </div>
                        {Array.isArray(profileData.services) && profileData.services.length === 0 && (
                          <p className="mt-1 text-sm text-red-600">Please select at least one service</p>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(profileData.services) && profileData.services.length > 0 ? (
                          profileData.services.map((service, index) => (
                            <span
                              key={service || `service-${index}`}
                              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {service || "Unnamed Service"}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No services specified</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                        Years of Experience <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="number"
                            id="experienceYears"
                            name="experience.years"
                            value={profileData.experience?.years || 0}
                            onChange={handleChange}
                            min="0"
                            className={`w-full p-2 border ${
                              validationErrors['experience.years'] ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 ${
                              validationErrors['experience.years'] ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                            required
                          />
                          {validationErrors['experience.years'] && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors['experience.years']}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-800">
                          {profileData.experience?.years !== undefined 
                            ? `${profileData.experience.years} years` 
                            : "Experience not specified"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Experience Description */}
                  <div>
                    <label htmlFor="experienceDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Description
                    </label>
                    {isEditing ? (
                      <textarea
                        id="experienceDescription"
                        name="experience.description"
                        value={profileData.experience?.description || ''}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">{profileData.experience?.description || 'No description provided'}</p>
                    )}
                  </div>
                </div>

                {/* About Me */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">About Me</h2>
                  {isEditing ? (
                    <textarea
                      id="about"
                      name="about"
                      value={profileData.about || ''}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  ) : (
                    <p className="text-gray-800 whitespace-pre-line">{profileData.about || 'No information provided'}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-slate-800 text-white rounded-md font-medium shadow hover:bg-slate-900 transition disabled:opacity-70 disabled:cursor-not-allowed"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;