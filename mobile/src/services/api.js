import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Network from 'expo-network';

// Using deployed backend URL
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://react-native-mern-project.onrender.com/api';

console.log('API_BASE_URL:', API_BASE_URL);

// Function to check network connectivity
export const checkNetworkStatus = async () => {
  try {
    const state = await Network.getNetworkStateAsync();
    console.log('Network Status:', {
      isConnected: state.isConnected,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    });
    return state.isConnected;
  } catch (error) {
    console.error('Network check error:', error);
    return true; // Assume connected if check fails
  }
};

/**
 * API Service for Mobile App
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased from 10s to 30s for Render cold starts
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Check network before making request
    const isConnected = await checkNetworkStatus();
    if (!isConnected) {
      throw new Error('No internet connection');
    }

    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error.message);
    return Promise.reject(error);
  }
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      code: error.code,
    });

    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

