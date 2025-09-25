"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  role: 'company' | 'admin' | 'subuser';
  // Company fields
  ownerName?: string;
  companyName?: string;
  companyEmail?: string;
  status?: 'active' | 'inactive';
  recoveryEmail?: string;
  // Admin fields
  name?: string;
  email?: string;
  // Subuser fields
  userRole?: string; // The role like Accountant, Staff, etc.
  companyId?: string;
  branch?: string;
  access?: {
    carManagement: boolean;
    analytics: boolean;
    setting: boolean;
    sales: boolean;
    customers: boolean;
    investors: boolean;
    dashboardUnits: boolean;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user data in localStorage or sessionStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData: User, rememberMe: boolean = false) => {
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookie
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Clear client-side storage
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isCompany = user?.role === 'company';
  const isSubuser = user?.role === 'subuser';

  // Helper function to check if user has access to a specific feature
  const hasAccess = (feature: string): boolean => {
    if (!user) return false;
    
    // Admin and company users have full access
    if (user.role === 'admin' || user.role === 'company') return true;
    
    // Subusers have limited access based on their permissions
    if (user.role === 'subuser' && user.access) {
      return user.access[feature as keyof typeof user.access] === true;
    }
    
    return false;
  };

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    isCompany,
    isSubuser,
    hasAccess,
    login,
    logout
  };
}