// src/api.js
import axios from "axios";


  // src/api.js
const api = axios.create({
  baseURL: "https://blendaura-artshop.up.railway.app/api",
});



// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
