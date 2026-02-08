import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { API_BASE_URL, TOKEN_KEY } from '@/constants/config';

const secureStorePolyfill = {
  async getItemAsync(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async setItemAsync(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItemAsync(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('[API Request]', config.method?.toUpperCase(), config.url);
    
    const token = await secureStorePolyfill.getItemAsync(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('[API Response]', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.error('[API Response Error]', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      await secureStorePolyfill.deleteItemAsync(TOKEN_KEY);
    }
    
    return Promise.reject(error);
  }
);

export { secureStorePolyfill };