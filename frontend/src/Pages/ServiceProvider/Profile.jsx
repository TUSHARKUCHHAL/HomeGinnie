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
        setProfileData(data);
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
      setProfileData({
        ...profileData,
        [parent]: {
          ...profileData[parent],
          [child]: value,
        },
      });
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  const handleServiceChange = (service) => {
    if (profileData.services.includes(service)) {
      setProfileData({
        ...profileData,
        services: profileData.services.filter((s) => s !== service),
      });
    } else {
      setProfileData({
        ...profileData,
        services: [...profileData.services, service],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put('http://localhost:5500/api/service-providers/profile', profileData, config);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      setProfileData(data);
      // Refresh token if returned from API
      if (data.token) {
        localStorage.setItem('token', data.token) || sessionStorage.setItem('token', data.token);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 py-6 px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium shadow hover:bg-gray-100 transition"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.lastName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profileData.phoneNumber}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.phoneNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.street"
                          value={profileData.address.street}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address.street}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.city"
                          value={profileData.address.city}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.state"
                          value={profileData.address.state}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="address.postalCode"
                          value={profileData.address.postalCode}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.address.postalCode}</p>
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
                              id={service}
                              checked={profileData.services.includes(service)}
                              onChange={() => handleServiceChange(service)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={service} className="ml-2 text-sm text-gray-700">
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.services.length > 0 ? (
                          profileData.services.map((service) => (
                            <span
                              key={service}
                              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                              {service}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="experience.years"
                          value={profileData.experience.years}
                          onChange={handleChange}
                          min="0"
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.experience.years} years</p>
                      )}
                    </div>
                  </div>

                  {/* Experience Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Description</label>
                    {isEditing ? (
                      <textarea
                        name="experience.description"
                        value={profileData.experience.description || ''}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">{profileData.experience.description || 'No description provided'}</p>
                    )}
                  </div>
                </div>

                {/* About Me */}
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">About Me</h2>
                  {isEditing ? (
                    <textarea
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
                    className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium shadow hover:bg-blue-700 transition"
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