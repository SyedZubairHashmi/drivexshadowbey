import { NextRequest } from 'next/server';

/**
 * Extract company ID from authentication cookie
 * Returns null if user is not authenticated or not a company user
 */
export function getCompanyIdFromRequest(request: NextRequest): string | null {
  try {
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      return null;
    }

    const user = JSON.parse(userCookie.value);
    
    // Only return companyId for company users
    if (user.role === 'company' && user._id) {
      return user._id;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
}

/**
 * Extract user info from authentication cookie
 * Returns null if user is not authenticated
 */
export function getUserFromRequest(request: NextRequest): any | null {
  try {
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      return null;
    }

    return JSON.parse(userCookie.value);
  } catch (error) {
    console.error('Error parsing user cookie:', error);
    return null;
  }
}









