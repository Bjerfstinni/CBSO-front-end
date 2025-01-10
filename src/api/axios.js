// api/axios.js
import axios from 'axios';

// Create an instance of axios with base settings
const api = axios.create({
  baseURL: 'http://localhost:3000', // Adjust to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach the token, if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
