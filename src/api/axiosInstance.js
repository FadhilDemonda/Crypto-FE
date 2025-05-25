import axios from 'axios';

const API_KEY = 'CG-cR6sjp6AaqrbMFwh87A5v6gx';

const axiosInstance = axios.create({
  baseURL: 'https://crypto-backend-21569344527.us-central1.run.app', // sesuaikan backend lokalmu
  withCredentials: true, // ini wajib supaya cookie dikirim & diterima
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-cg-demo-api-key': API_KEY
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
