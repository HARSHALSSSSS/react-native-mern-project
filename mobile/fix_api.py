#!/usr/bin/env python3
import os

api_code = '''import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://react-native-mern-project.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

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
'''

path = r'c:\Users\Lenovo\Desktop\react native+mern\mobile\src\services\api.js'

# Remove file if exists
if os.path.exists(path):
    os.remove(path)

# Write fresh file
with open(path, 'w', encoding='utf-8') as f:
    f.write(api_code)

print('✓ api.js created successfully!')
