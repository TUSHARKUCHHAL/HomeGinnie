import React from 'react';

// Service to handle location-related functionality
const LocationService = {
  // Function to get current location using browser's Geolocation API
  getCurrentLocation: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const address = await LocationService.reverseGeocode(latitude, longitude);
            resolve(address);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          let errorMessage = 'Unknown error occurred while getting location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get location timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },
  
  // Function to perform reverse geocoding (convert coordinates to address)
  reverseGeocode: async (latitude, longitude) => {
    try {
      // Use a free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'YourAppName' // Good practice to identify your app
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address from coordinates');
      }
      
      const data = await response.json();
      
      // Format the address from the response
      const formattedAddress = data.display_name || 'Unknown address';
      
      return formattedAddress;
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      throw error;
    }
  }
};

export default LocationService;