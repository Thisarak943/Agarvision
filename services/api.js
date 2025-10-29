import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configure axios base URL (replace with your actual API URL)
const API_BASE_URL = 'https://gtim.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Utility function to handle API errors - MOVED TO TOP
const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const responseData = error.response.data;
    const message = responseData?.message || responseData?.error || 'An error occurred';
    
    // Create error object with additional data
    const apiError: any = new Error(message);
    
    // Attach additional response data to error object (e.g., for unverified email)
    if (responseData?.unverified_email) {
      apiError.unverified_email = responseData.unverified_email;
      apiError.can_resend_verification = responseData.can_resend_verification;
    }
    
    return apiError;
  } else if (error.request) {
    // Request made but no response received
    return new Error('Network error. Please check your connection.');
  } else {
    // Something else happened
    return new Error('An unexpected error occurred.');
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await api.post('/customer/refresh-token', {
          refresh_token: refreshToken,
        });

        const { token: newAccessToken, refresh_token: newRefreshToken } = response.data;

        // Store new tokens
        await SecureStore.setItemAsync('authToken', newAccessToken);
        if (newRefreshToken) {
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        }

        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process queued requests
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError, null);
        isRefreshing = false;
        
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userData');
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/customer/login', {
        email: email.trim(),
        password: password.trim(),
      });
      
      // Store tokens if available
      if (response.data.token) {
        await SecureStore.setItemAsync('authToken', response.data.token);
      }
      
      if (response.data.refresh_token) {
        await SecureStore.setItemAsync('refreshToken', response.data.refresh_token);
      }
      
      // Store customer data (FIXED: was looking for "user", should be "customer")
      if (response.data.customer) {
        await SecureStore.setItemAsync('userData', JSON.stringify(response.data.customer));
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Register
  register: async (userData: any) => {
    try {
      const response = await api.post('/customer/register', userData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/customer/refresh-token', {
        refresh_token: refreshToken,
      });

      // Store new tokens
      if (response.data.token) {
        await SecureStore.setItemAsync('authToken', response.data.token);
      }
      
      if (response.data.refresh_token) {
        await SecureStore.setItemAsync('refreshToken', response.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      // Clear tokens if refresh fails
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      throw handleApiError(error);
    }
  },

  // Logout
  logout: async () => {
    try {
      // Call backend logout endpoint if needed
      await api.post('/customer/logout');
      
      // Clear all stored data
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userData');
    } catch (error) {
      console.log('Logout error:', error);
      // Clear tokens even if API call fails
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('userData');
    }
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/customer/forgot-password', {
        email: email.trim(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword: newPassword.trim(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Verify email
  verifyEmail: async (token: string) => {
    try {
      const response = await api.post('/auth/verify-email', {
        token,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Resend verification email
  resendVerification: async (email: string) => {
    try {
      const response = await api.post('/customer/login', {
        resend_verification: 1,
        email: email.trim(),
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Google Sign-In
  googleSignIn: async () => {
    try {
      const response = await api.post('/customer/google');
      
      // Store tokens if available
      if (response.data.token) {
        await SecureStore.setItemAsync('authToken', response.data.token);
      }
      
      if (response.data.refresh_token) {
        await SecureStore.setItemAsync('refreshToken', response.data.refresh_token);
      }
      
      // Store customer data (FIXED: was looking for "user", should be "customer")
      if (response.data.customer) {
        await SecureStore.setItemAsync('userData', JSON.stringify(response.data.customer));
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// User API methods
export const userAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/customer/profile');
      
      // Update stored user data - handle both "customer" and "user" formats
      const userData = response.data.customer || response.data.user;
      if (userData) {
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateProfile: async (userData: any) => {
    try {
      const response = await api.put('/customer/profile', userData);
      
      // Update stored user data - handle both "customer" and "user" formats
      const updatedUser = response.data.customer || response.data.user;
      if (updatedUser) {
        await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return !!token;
  } catch (error) {
    return false;
  }
};

// Get auth token
export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('authToken');
};

// Get refresh token
export const getRefreshToken = async () => {
  return await SecureStore.getItemAsync('refreshToken');
};

// Get user data from storage
export const getUserData = async () => {
  try {
    const userDataString = await SecureStore.getItemAsync('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  } catch (error) {
    console.log('Error getting user data:', error);
    return null;
  }
};

// Clear all auth data
export const clearAuthData = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userData');
  } catch (error) {
    console.log('Error clearing auth data:', error);
  }
};

export default api;