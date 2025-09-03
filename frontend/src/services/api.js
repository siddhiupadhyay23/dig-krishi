import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('authToken');
    console.log('API Request Interceptor:');
    console.log('  URL:', `${config.baseURL}${config.url}`);
    console.log('  Token found in localStorage:', !!token);
    console.log('  Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('  Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.log('  No Authorization header set');
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    
    // Handle common error responses
    if (error.response?.status === 401) {
      console.log('Unauthorized access - clearing auth data and redirecting to login');
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
