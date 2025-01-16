import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios'; // Będziemy używać axios do komunikacji z backendem
import { useNavigate } from 'react-router-dom'; // Aby nawigować po logowaniu

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  user: any; // Możesz określić dokładny typ na podstawie struktury użytkownika
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null); // Przechowujemy dane użytkownika
  const navigate = useNavigate();


  // Funkcja do logowania
  const login = async (email: string, password: string) => {
    try {
      // Wysyłamy dane logowania do serwera
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { token } = response.data;

      if (token) {
        // Zapisujemy token w localStorage
        localStorage.setItem('token', token);

        // Pobieramy dane użytkownika, jeżeli chcesz je przechować
        const userResponse = await axios.get('http://localhost:5000/user', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(userResponse.data); // Zapisujemy dane użytkownika
        setIsAuthenticated(true); // Użytkownik jest zalogowany
        navigate('/'); // Przekierowanie na stronę główną po udanym logowaniu
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Invalid login credentials');
    }
  };

  // Funkcja do wylogowania
  const logout = () => {
    localStorage.removeItem('token'); // Usuwamy token z localStorage
    setIsAuthenticated(false); // Ustawiamy status na niezalogowanego
    setUser(null); // Usuwamy dane użytkownika
    navigate('/login'); // Przekierowanie na stronę logowania
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook do używania kontekstu
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
