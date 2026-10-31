import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;

export const api = axios.create({ baseURL: `${API_URL}/api` });
api.interceptors.request.use((cfg) => {
  try {
    const a = JSON.parse(localStorage.getItem("tn_auth"));
    if (a?.token) cfg.headers.Authorization = `Bearer ${a.token}`;
  } catch {}
  return cfg;
});
