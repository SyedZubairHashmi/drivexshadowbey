import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the route is an admin route
  if (pathname.startsWith('/admin')) {
    // Get user data from cookies or headers
    const userCookie = request.cookies.get('user');
    
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
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
