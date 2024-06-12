import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // adjust based on your backend URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
