import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (user: Omit<User, 'id'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('libraryUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('libraryUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword as User);
      localStorage.setItem('libraryUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('libraryUser');
  };

  const register = async (user: Omit<User, 'id'>): Promise<boolean> => {
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return false;
    }

    // In a real app, this would make an API call
    const newUser = {
      ...user,
      id: `user-${Date.now()}`,
      role: 'member', // Default role
    };

    setUsers([...users, newUser as User]);
    
    // Auto login after registration
    const { password, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword as User);
    localStorage.setItem('libraryUser', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};