import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    const checkAuth = async () => {
      try {
        const res = await axios.get(
          //   `${import.meta.env.VITE_API_URL}/api/auth/me`,
          "/api/auth/me",
          {
            withCredentials: true, // Include cookies/tokens
          }
        );

        if (res.data) {
          setUser(res.data);
          setIsAuthenticated(true);
        }
      } catch {
        // Token expired or user not authenticated
        console.log("User not authenticated");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Custom login function
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData)); // ← save to localStorage
  };

  // Custom logout function
  const logout = async () => {
    try {
      await axios.post(
        // `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        "/api/auth/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user"); // ← remove from localStorage
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login, // Keep the same name for compatibility
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy use
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
