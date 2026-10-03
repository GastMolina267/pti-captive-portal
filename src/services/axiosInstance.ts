import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
  // Configuración para desarrollo - ignorar errores SSL
  ...(import.meta.env.DEV && {
    httpsAgent: false,
    timeout: 10000,
  }),
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  },
);

export default axiosInstance;
