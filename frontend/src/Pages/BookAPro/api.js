import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5500/api'
});

// Add a request interceptor to automatically include auth token
api.interceptors.request.use(
  config => {
    // Get token from storage (try localStorage first, then sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Redirect to login page or show auth error
      console.error('Authentication error:', error.response.data);
      // Optional: localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;