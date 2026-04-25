import axios from "axios";

const api = axios.create({
  baseURL: "https://api-poscoffe-main-vqn5zn.free.laravel.cloud/api",
  headers: {
    Accept: "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;