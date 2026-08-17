import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const res = await authService.getMe();
          if (res.admin) {
            setAdmin(res.admin);
            localStorage.setItem('savrion_admin_user', JSON.stringify(res.admin));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          authService.logout();
          setAdmin(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  const updateProfile = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    if (data.admin) {
      setAdmin(data.admin);
      localStorage.setItem('savrion_admin_user', JSON.stringify(data.admin));
    }
    return data;
  };

  return (
    <AuthContext.Provider 
      value={{
        admin,
        isAuthenticated: !!admin,
        loading,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
