
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('admin_authenticated');
      setIsAuthenticated(authStatus === 'true');
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const signOut = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  const signIn = () => {
    localStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  return {
    isAuthenticated,
    loading,
    signOut,
    signIn,
  };
};
