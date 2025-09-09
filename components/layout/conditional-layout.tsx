"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { PublicLayout } from "./public-layout";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // List of admin/dashboard routes that should NOT use PublicLayout
  const adminRoutes = [
    '/dashboard',
    '/admin',
    '/analytics',
    '/cars/inventory',
    '/cars/sold',
    '/cars/transit',
    '/cars/batch-insight',
    '/investors',
    '/sales-and-payments',
    '/setting',
    '/debug-api',
    '/test-investor-api',
    '/login'
  ];

  // Check if current route is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // If it's an admin route, render children without PublicLayout
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For public routes, wrap with PublicLayout
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  );
}
