'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface BillingInfo {
  firstName?: string;
  lastName?: string;
  company?: string;
  country?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  orderNotes?: string;
}

interface User {
  _id?: string;
  username: string;
  email: string;
  userType?: string;
  createdAt?: Date;
  billingInfo?: BillingInfo;
}

interface UserContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isUserLoaded: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // Load from localStorage on first mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setIsUserLoaded(true);
  }, []);

  // Save to localStorage whenever user changes
  useEffect(() => {
    if (isUserLoaded) {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
  }, [user, isUserLoaded]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        isUserLoaded,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
