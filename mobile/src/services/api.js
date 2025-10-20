import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Using deployed backend URL
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'https://react-native-mern-project.onrender.com/api';

/**
 * API Service for Mobile App
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
