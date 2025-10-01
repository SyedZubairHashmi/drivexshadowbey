"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface SubuserProtectedRouteProps {
  children: React.ReactNode;
  requiredAccess?: string;
}

export function SubuserProtectedRoute({ children, requiredAccess }: SubuserProtectedRouteProps) {
  const { user, loading, isAuthenticated, isSubuser, hasAccess } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip checks if still loading or not a subuser
    if (loading || !isAuthenticated || !isSubuser) return;

    // Check if subuser has access to current route
    if (requiredAccess && !hasAccess(requiredAccess)) {
      // Redirect to dashboard if no access
      router.push('/dashboard');
      return;
    }

    // Route-based access checks for subusers
    const routeAccessMap: { [key: string]: string } = {
      '/dashboard': 'dashboardUnits',
      '/cars': 'carManagement',
      '/cars/inventory': 'carManagement',
      '/cars/batch-insight': 'carManagement',
      '/cars/transit': 'carManagement',
      '/cars/sold': 'carManagement',
      '/sales-and-payments': 'salesAndPayments',
      '/sales-and-payments/customers': 'salesAndPayments',
      '/sales-and-payments/remaining-balance': 'salesAndPayments',
      '/sales-and-payments/invoice': 'salesAndPayments',
      '/investors': 'investors',
      '/investors/batch-investment': 'investors',
      '/investors/profit-distribution': 'investors',
      '/investors/all-investors': 'investors',
      '/investors/payment-history': 'investors',
      '/analytics': 'analytics',
      '/setting': 'setting',
    };

    // Check if current path requires specific access
    const requiredAccessForRoute = routeAccessMap[pathname];
    if (requiredAccessForRoute && !hasAccess(requiredAccessForRoute)) {
      // Redirect to dashboard if no access to current route
      router.push('/dashboard');
      return;
    }
  }, [loading, isAuthenticated, isSubuser, hasAccess, pathname, router, requiredAccess]);

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
  if (!isAuthenticated || !isSubuser) {
    return null;
  }

  // Check access for subusers
  if (requiredAccess && !hasAccess(requiredAccess)) {
    return null;
  }

  // Check route-based access for subusers
  const routeAccessMap: { [key: string]: string } = {
    '/dashboard': 'dashboardUnits',
    '/cars': 'carManagement',
    '/cars/inventory': 'carManagement',
    '/cars/batch-insight': 'carManagement',
    '/cars/transit': 'carManagement',
    '/cars/sold': 'carManagement',
    '/sales-and-payments': 'salesAndPayments',
    '/sales-and-payments/customers': 'salesAndPayments',
    '/sales-and-payments/remaining-balance': 'salesAndPayments',
    '/sales-and-payments/invoice': 'salesAndPayments',
    '/investors': 'investors',
    '/investors/batch-investment': 'investors',
    '/investors/profit-distribution': 'investors',
    '/investors/all-investors': 'investors',
    '/investors/payment-history': 'investors',
    '/analytics': 'analytics',
    '/setting': 'setting',
  };

  const requiredAccessForRoute = routeAccessMap[pathname];
  if (requiredAccessForRoute && !hasAccess(requiredAccessForRoute)) {
    return null;
  }

  // User is authenticated subuser with proper access, show the protected content
  return <>{children}</>;
}
