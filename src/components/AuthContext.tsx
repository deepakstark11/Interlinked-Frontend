import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Simulated user database with roles
const MOCK_USERS = [
  { username: "admin", password: "password123", role: "admin" },
  { username: "fireagency", password: "firepass", role: "fire-agency" }
];

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  role: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string) => {
    const foundUser = MOCK_USERS.find(user => user.username === username && user.password === password);
    if (foundUser) {
      const userData = { username: foundUser.username, role: foundUser.role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, role: user?.role || null }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
