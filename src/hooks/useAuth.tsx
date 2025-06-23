
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false for immediate response

  useEffect(() => {
    // Check if admin is authenticated from localStorage immediately
    const authStatus = localStorage.getItem('admin_authenticated');
    setIsAuthenticated(authStatus === 'true');
    // No loading delay needed
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
