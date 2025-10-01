import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    // Get user data from cookies or headers
    const userCookie = request.cookies.get('auth');
    
    if (!userCookie) {
      // No user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const user = JSON.parse(userCookie.value);
      
      // Check if user is admin
      if (user.role !== 'admin') {
        // User is not admin, return 404
        return new NextResponse('Not Found', { status: 404 });
      }
    } catch (error) {
      // Invalid user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Check if the route requires company authentication
  const protectedRoutes = [
    '/dashboard',
    '/cars',
    '/analytics',
    '/investors',
    '/sales-and-payments',
    '/setting'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const userCookie = request.cookies.get('auth');
    
    
    if (!userCookie) {
      // No user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      const user = JSON.parse(userCookie.value);
      
      // Allow company and subuser roles to access protected app routes
      if (user.role !== 'company' && user.role !== 'subuser') {
        // User is not authorized, redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // If subuser, enforce per-route permissions using access flags
      if (user.role === 'subuser') {
        const accessCookie = request.cookies.get('subuser_access');
        let access: any = null;
        try {
          access = accessCookie ? JSON.parse(accessCookie.value) : null;
        } catch {}
        // Fallback to access on user cookie when dedicated cookie is missing
        if (!access && (user as any).access) {
          access = (user as any).access;
        }

        // Special case for settings - only company and admin users can access
        if (pathname.startsWith('/setting')) {
          return new NextResponse('Forbidden', { status: 403 });
        }

        // Map top-level routes to access flags
        const path = pathname;
        const routeToFlag: { [key: string]: string } = {
          '/dashboard': 'dashboardUnits',
          '/cars': 'carManagement',
          '/analytics': 'analytics',
          '/investors': 'investors',
          '/sales-and-payments': 'salesAndPayments',
        };

        const matchedKey = Object.keys(routeToFlag).find((key) => path.startsWith(key));
        if (matchedKey) {
          const flag = routeToFlag[matchedKey];
          const hasAccess = access && access[flag] === true;
          if (!hasAccess) {
            return new NextResponse('Forbidden', { status: 403 });
          }
        }
      }
    } catch (error) {
      // Invalid user data, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/cars/:path*',
    '/analytics/:path*',
    '/investors/:path*',
    '/sales-and-payments/:path*',
    '/setting/:path*',
  ],
};









