import { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError('Invalid username or password');
      return false;
    }
  };

  const register = async (username, email, password) => {
    setError(null);
    try {
      await api.post('/register/', { username, email, password });
      return true;
    } catch (err) {
      const msg = err.response?.data?.username?.[0] ||
                  err.response?.data?.email?.[0] ||
                  'Registration failed';
      setError(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);