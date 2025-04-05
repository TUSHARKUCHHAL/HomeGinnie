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
            resolve({
              address,
              latitude,
              longitude
            });
          } catch (error) {
            // If geocoding fails, resolve with coordinates at least
            resolve({
              address: `Location at ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: error.message
            });
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
  
  // Function to perform reverse geocoding with multiple fallbacks
  reverseGeocode: async (latitude, longitude) => {
    // Helper function for timeout management
    const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
      ]);
    };
    
    // Try multiple geocoding services in sequence
    const geocodingServices = [
      // Service 1: OpenCage Data - Highly accurate geocoding service (requires API key)
      async () => {
        try {
          // Replace 'YOUR_API_KEY' with your actual OpenCage API key
          const API_KEY = '18ed6e4f9f0e456da0319f1dd81a4a5e';
          const response = await fetchWithTimeout(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}&no_annotations=1`,
            {
              headers: {
                'Accept': 'application/json'
              }
            },
            8000
          );
          
          if (!response.ok) {
            throw new Error(`OpenCage service failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data || !data.results || data.results.length === 0) {
            throw new Error('Invalid response from OpenCage');
          }
          
          return data.results[0].formatted || null;
        } catch (error) {
          console.warn('OpenCage geocoding failed:', error.message);
          throw error;
        }
      },
      
      // Service 2: HERE Maps Geocoding API (requires API key)
      async () => {
        try {
          // Replace 'YOUR_API_KEY' with your actual HERE API key
          const API_KEY = 'YOUR_API_KEY';
          const response = await fetchWithTimeout(
            `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${API_KEY}`,
            {
              headers: {
                'Accept': 'application/json'
              }
            },
            8000
          );
          
          if (!response.ok) {
            throw new Error(`HERE Maps service failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data || !data.items || data.items.length === 0) {
            throw new Error('Invalid response from HERE Maps');
          }
          
          const address = data.items[0].address;
          const components = [
            address.houseNumber,
            address.street,
            address.district,
            address.city,
            address.postalCode,
            address.stateCode,
            address.countryName
          ].filter(Boolean);
          
          return components.join(', ') || null;
        } catch (error) {
          console.warn('HERE Maps geocoding failed:', error.message);
          throw error;
        }
      },
      
      // Service 3: OpenStreetMap Nominatim as a fallback (free, no API key required)
      async () => {
        try {
          const response = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'HomeGinnie' // Replace with your app name
              }
            },
            8000
          );
          
          if (!response.ok) {
            throw new Error(`Nominatim service failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Try to construct a more detailed address from address details
          if (data.address) {
            const addr = data.address;
            const components = [
              addr.house_number,
              addr.road,
              addr.neighbourhood || addr.suburb,
              addr.city || addr.town || addr.village,
              addr.county,
              addr.state || addr.province,
              addr.postcode,
              addr.country
            ].filter(Boolean);
            
            if (components.length > 0) {
              return components.join(', ');
            }
          }
          
          return data.display_name || null;
        } catch (error) {
          console.warn('Nominatim geocoding failed:', error.message);
          throw error;
        }
      },
      
      // Service 4: BigDataCloud as final fallback
      async () => {
        try {
          const response = await fetchWithTimeout(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
            {
              headers: {
                'Accept': 'application/json'
              }
            },
            5000
          );
          
          if (!response.ok) {
            throw new Error(`BigDataCloud service failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data) {
            throw new Error('Invalid response from BigDataCloud');
          }
          
          const components = [
            data.locality,
            data.city,
            data.principalSubdivision,
            data.postcode,
            data.countryName
          ].filter(Boolean);
          
          return components.join(', ') || null;
        } catch (error) {
          console.warn('BigDataCloud geocoding failed:', error.message);
          throw error;
        }
      }
    ];
    
    // Try each service in sequence until one succeeds
    let lastError = null;
    
    for (const geocodingService of geocodingServices) {
      try {
        const result = await geocodingService();
        if (result) {
          return result;
        }
      } catch (error) {
        lastError = error;
        // Continue to the next service
      }
    }
    
    // If all services fail, throw the last error
    throw lastError || new Error('All geocoding services failed');
  },
  
  // Helper function to format a location object into a readable string
  formatLocation: (location) => {
    if (!location) return 'Unknown location';
    
    if (typeof location === 'string') return location;
    
    if (location.address) return location.address;
    
    if (location.latitude && location.longitude) {
      return `Location at ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    
    return 'Invalid location data';
  }
};

// Example usage component
const LocationFinder = () => {
  const [location, setLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const handleGetLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const locationData = await LocationService.getCurrentLocation();
      setLocation(locationData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <button onClick={handleGetLocation} disabled={loading}>
        {loading ? 'Loading...' : 'Get My Location'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {location && (
        <div>
          <h3>Your Location</h3>
          <p>{LocationService.formatLocation(location)}</p>
          
          {location.latitude && location.longitude && (
            <p>Coordinates: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</p>
          )}
          
          {location.error && (
            <p style={{ color: 'orange' }}>Note: {location.error}</p>
          )}
        </div>
      )}
    </div>
  );
};

export { LocationService, LocationFinder };
export default LocationService;