import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5173/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export default axiosClient;