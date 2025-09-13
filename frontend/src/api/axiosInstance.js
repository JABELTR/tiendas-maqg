// src/api/axiosInstance.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Este archivo no conoce el context, así que exponemos un setter opcional
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // si el token ya expiró, evitamos la llamada y disparamos logout
    try {
      const { exp } = jwtDecode(token);
      if (exp && exp * 1000 <= Date.now()) {
        if (onUnauthorized) onUnauthorized("expired_on_request");
        // aborta request
        return Promise.reject({ response: { status: 401, data: { message: "Token expirado" } }});
      }
    } catch {
      // token inválido
      if (onUnauthorized) onUnauthorized("decode_error_on_request");
      return Promise.reject({ response: { status: 401, data: { message: "Token inválido" } }});
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      if (onUnauthorized) onUnauthorized("server_401");
    }
    return Promise.reject(err);
  }
);

export default instance;
