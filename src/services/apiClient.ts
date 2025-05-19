import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// API base URL - replace with your actual API endpoint
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

// Define a generic data type for request payloads
type ApiData = Record<string, unknown>;

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token, etc.
axiosInstance.interceptors.request.use(
  config => {
    // Get token from localStorage or other storage
    const token = localStorage.getItem('token');

    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Handle error responses (e.g., 401 unauthorized, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized - e.g., redirect to login
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Generic request function to handle API calls
const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then(response => response.data),

  post: <T>(url: string, data?: ApiData, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config).then(response => response.data),

  put: <T>(url: string, data?: ApiData, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then(response => response.data),

  patch: <T>(url: string, data?: ApiData, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then(response => response.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then(response => response.data),
};

export default apiClient;
