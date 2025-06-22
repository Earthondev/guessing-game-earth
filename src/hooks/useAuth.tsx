
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated from localStorage
    const authStatus = localStorage.getItem('admin_authenticated');
    setIsAuthenticated(authStatus === 'true');
    setLoading(false);
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
