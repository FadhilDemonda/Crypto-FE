import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek profil user
  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/users/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.token || res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  // Logout
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  // Register
  const register = async (username, email, password) => {
    const res = await axiosInstance.post("/auth/register", { username, email, password });
    localStorage.setItem("accessToken", res.data.token || res.data.accessToken);
    setUser(res.data.user);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
