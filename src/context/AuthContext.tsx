import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();


  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);

        const userResponse = await axios.get('http://localhost:5000/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(userResponse.data);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid login credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
