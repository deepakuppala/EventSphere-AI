import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.interceptors.request.use(config => {
      const currentToken = config.url.includes('/admin') ? localStorage.getItem('adminToken') : localStorage.getItem('token');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });

    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      const adminToken = localStorage.getItem('adminToken');

      try {
        if (token) {
          const res = await axios.get('http://localhost:8080/api/auth/me');
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
      }

      try {
        if (adminToken) {
          const resAdmin = await axios.get('http://localhost:8080/api/admin/me');
          setAdmin(resAdmin.data);
        }
      } catch (err) {
        localStorage.removeItem('adminToken');
      }

      setLoading(false);
    };

    verifyAuth();
  }, []);

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const loginAdmin = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, admin, loading, loginUser, logoutUser, loginAdmin, logoutAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
