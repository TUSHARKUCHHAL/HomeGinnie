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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mt-20">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-slate-800 py-6 px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
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
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.firstName || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.lastName || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profileData.email || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.email || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={profileData.phoneNumber || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.phoneNumber || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="alternateNumber" className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          id="alternateNumber"
                          name="alternateNumber"
                          value={profileData.alternateNumber || ''}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.alternateNumber || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="street"
                          name="address.street"
                          value={profileData.address?.street || ""}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address?.street || "No street address provided"}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="city"
                          name="address.city"
                          value={profileData.address?.city || ""}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address?.city || "No city provided"}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="state"
                          name="address.state"
                          value={profileData.address?.state || ""}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address?.state || "No state provided"}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="postalCode"
                          name="address.postalCode"
                          value={profileData.address?.postalCode || ""}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address?.postalCode || "No postal code provided"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h2>
                  
                  {/* Services */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
                    {isEditing ? (
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
                      <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                      {isEditing ? (
                        <input
                          type="number"
                          id="experienceYears"
                          name="experience.years"
                          value={profileData.experience?.years || 0}
                          onChange={handleChange}
                          min="0"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
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
                    <label htmlFor="experienceDescription" className="block text-sm font-medium text-gray-700 mb-1">Experience Description</label>
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

        {/* Password Reset Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Password Management</h2>
            <p className="text-gray-600 mb-4">Need to change your password? You can request a password reset.</p>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfile;