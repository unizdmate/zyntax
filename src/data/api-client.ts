import axios from 'axios';

// Create a base axios instance with common configuration
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling common error cases
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases here
    const { response } = error;
    
    if (response?.status === 401) {
      // Handle unauthorized (could redirect to login)
      console.error('Authentication required');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;