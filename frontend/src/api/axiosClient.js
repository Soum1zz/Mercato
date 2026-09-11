import axios from 'axios';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') return null;
  return token;
};

const envBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const API_BASE_URL = envBaseUrl
  ? envBaseUrl.replace(/\/+$/, '')
  : (import.meta.env.DEV ? 'http://localhost:8080' : '');

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosClient;