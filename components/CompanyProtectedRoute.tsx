"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface CompanyProtectedRouteProps {
  children: React.ReactNode;
}

export function CompanyProtectedRoute({ children }: CompanyProtectedRouteProps) {
  const { user, loading, isAuthenticated, isCompany, isSubuser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in, redirect to login
        router.push('/login');
      } else if (!isCompany && !isSubuser) {
        // Logged in but neither company nor subuser, redirect to admin dashboard
        router.push('/admin');
      }
    }
  }, [loading, isAuthenticated, isCompany, isSubuser, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated || (!isCompany && !isSubuser)) {
    return null;
  }

  // User is authenticated and is company or subuser, show the protected content
  return <>{children}</>;
}










