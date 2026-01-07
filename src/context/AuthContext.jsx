import React, { createContext, useContext, useState, useEffect } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'worker' or 'manager'

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem('uplift_user');
    const savedType = localStorage.getItem('uplift_user_type');
    if (savedUser && savedType) {
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedType);
    }
  }, []);

  const login = (type) => {
    const user = users[type];
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem('uplift_user', JSON.stringify(user));
    localStorage.setItem('uplift_user_type', type);
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('uplift_user');
    localStorage.removeItem('uplift_user_type');
  };

  const value = {
    currentUser,
    userType,
    isAuthenticated: !!currentUser,
    isWorker: userType === 'worker',
    isManager: userType === 'manager',
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
