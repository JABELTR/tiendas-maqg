// src/context/AuthContext.jsx
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  role: null,
  login: () => {},
  logout: () => {},
  setUserFromStorage: () => {},
});

function isTokenValid(token) {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch {
    return false;
  }
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // { email, rol, tiendaId, ... }
  const [role, setRole] = useState(null);

  const logout = useCallback((opts = { redirect: true, reason: "" }) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    if (opts.redirect) navigate("/", { replace: true });
  }, [navigate]);

  const setUserFromStorage = useCallback(() => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
      if (u) {
        try {
          const parsed = JSON.parse(u);
          setUser(parsed);
          setRole(parsed.rol || parsed.role || null);
        } catch {
          // si falló parseo, limpiamos
          logout({ reason: "user_parse_error" });
        }
      } else {
        // si no hay user, al menos derivar del token
        try {
          const decoded = jwtDecode(token);
          const minimal = { email: decoded.sub, rol: decoded.rol || decoded.role || null };
          setUser(minimal);
          setRole(minimal.rol);
        } catch {
          logout({ reason: "decode_error" });
        }
      }
    } else {
      logout({ redirect: false, reason: "token_invalid" });
    }
  }, [logout]);

  // Inicializar al montar
  useEffect(() => {
    setUserFromStorage();
  }, [setUserFromStorage]);

  // Auto-logout cuando el token expire (calcula tiempo restante)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { exp } = jwtDecode(token);
      if (!exp) return;
      const nowMs = Date.now();
      const expMs = exp * 1000;
      const delay = Math.max(expMs - nowMs, 0);
      if (delay === 0) {
        logout({ reason: "expired" });
        return;
      }
      const timer = setTimeout(() => logout({ reason: "expired" }), delay);
      return () => clearTimeout(timer);
    } catch {
      // si decode falla, cerrar sesión
      logout({ reason: "decode_error" });
    }
  }, [isAuthenticated, logout]);

  const login = useCallback((payload) => {
    // payload: { token, user: { email, rol, tiendaId, ... } }
    localStorage.setItem("token", payload.token);
    if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));
    setIsAuthenticated(true);
    setUser(payload.user || null);
    setRole(payload.user?.rol || payload.user?.role || null);
  }, []);

  const value = useMemo(() => ({
    isAuthenticated, user, role, login, logout, setUserFromStorage
  }), [isAuthenticated, user, role, login, logout, setUserFromStorage]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
