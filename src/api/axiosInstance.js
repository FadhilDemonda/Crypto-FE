import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://crypto-backend-21569344527.us-central1.run.app', // sesuaikan backend lokalmu
  withCredentials: true, // ini wajib supaya cookie dikirim & diterima
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosInstance;
