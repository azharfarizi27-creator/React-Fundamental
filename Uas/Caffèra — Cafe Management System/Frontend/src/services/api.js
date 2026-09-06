import axios from 'axios';
import {
  INITIAL_USERS,
  INITIAL_CATEGORIES,
  INITIAL_MENUS,
  INITIAL_TABLES,
  INITIAL_ORDERS,
} from './mockData';

// API Base URL config (ASP.NET Core Web API default port 5066)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5066/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('caffera_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized or fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request - session may be expired');
    }
    return Promise.reject(error);
  }
);

// ========================================================
// LOCAL STORAGE MOCK ENGINE (Ensures 100% Reliable Offline / Demo Mode)
// ========================================================

const STORAGE_KEYS = {
  USERS: 'caffera_db_users',
  CATEGORIES: 'caffera_db_categories',
  MENUS: 'caffera_db_menus',
  TABLES: 'caffera_db_tables',
  ORDERS: 'caffera_db_orders',
};

// Initialize LocalStorage with seed data if empty
export const initializeLocalStorageDb = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MENUS)) {
    localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(INITIAL_MENUS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(INITIAL_TABLES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
};

export const getStorageData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return [];
  }
};

export const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to storage:`, err);
  }
};

export { STORAGE_KEYS };
export default api;
