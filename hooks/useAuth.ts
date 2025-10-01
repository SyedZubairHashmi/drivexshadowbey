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
    salesAndPayments: boolean;
    investors: boolean;
    dashboardUnits: boolean;
  };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // First, check for cached user data to show immediately
    const getCookieValue = (name: string) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };
    
    const storageUserData = localStorage.getItem('user') || sessionStorage.getItem('user');
    let cookieUserData = getCookieValue('user_client');
    if (cookieUserData) {
      try {
        cookieUserData = decodeURIComponent(cookieUserData);
      } catch {}
    }
    const cachedUserData = cookieUserData || storageUserData;
    
    // Set cached user immediately to reduce loading time
    if (cachedUserData) {
      try {
        const parsedUser = JSON.parse(cachedUserData);
        setUser(parsedUser);
        setLoading(false); // Stop loading immediately with cached data
      } catch (error) {
        console.error('Error parsing cached user data:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        if (typeof document !== 'undefined') {
          document.cookie = 'user_client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
      }
    }

    // Then verify with server in background
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
        const me = await res.json();
        if (me && me.authenticated && me.auth) {
          // If subuser, fetch live data from DB to reflect latest access flags
          if (me.auth.role === 'subuser') {
            try {
              const live = await fetch('/api/subusers/me', { method: 'GET', credentials: 'include' });
              const liveData = await live.json();
              if (liveData?.success && liveData.data) {
                setUser(liveData.data);
                return;
              }
            } catch {}
          }
          // Update with server data if different from cached
          const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
          if (stored) {
            try { 
              const parsedStored = JSON.parse(stored);
              if (parsedStored._id !== me.auth._id) {
                setUser({ _id: me.auth._id, role: me.auth.role } as any);
              }
            } catch {}
          } else {
            setUser({ _id: me.auth._id, role: me.auth.role } as any);
          }
          return;
        }
      } catch {}
      
      // If no cached data and server check failed, set loading to false
      if (!cachedUserData) {
        setLoading(false);
      }
    })();
  }, []);

  const login = (userData: User, rememberMe: boolean = false) => {
    console.log('useAuth login called with:', userData);
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data saved to localStorage');
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
      console.log('User data saved to sessionStorage');
    }
    setUser(userData);
    console.log('User state updated');
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
    
    // Clear client-readable cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'user_client=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
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