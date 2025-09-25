import { NextRequest } from 'next/server';

/**
 * Extract company ID from authentication cookie
 * Returns null if user is not authenticated or not a company/subuser
 */
export function getCompanyIdFromRequest(request: NextRequest): string | null {
  try {
    const userCookie = request.cookies.get('user');
    
    if (!userCookie) {
      return null;
    }

    const user = JSON.parse(userCookie.value);
    
    // Return companyId for company users (their own ID) or subusers (their companyId)
    if (user.role === 'company' && user._id) {
      return user._id;
    } else if (user.role === 'subuser' && user.companyId) {
      return user.companyId;
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

/**
 * Check if user has access to a specific feature
 * Company users have full access, subusers have limited access based on permissions
 */
export function hasAccess(user: any, feature: string): boolean {
  if (!user) return false;
  
  // Company users have full access
  if (user.role === 'company') return true;
  
  // Admin users have full access
  if (user.role === 'admin') return true;
  
  // Subusers have limited access based on their permissions
  if (user.role === 'subuser' && user.access) {
    return user.access[feature] === true;
  }
  
  return false;
}

/**
 * Check if user is authorized for company operations
 * Returns true for company users and subusers of the same company
 */
export function isAuthorizedForCompany(request: NextRequest, companyId?: string): boolean {
  const user = getUserFromRequest(request);
  
  if (!user) return false;
  
  // Admin users have access to all companies
  if (user.role === 'admin') return true;
  
  // Company users have access to their own company
  if (user.role === 'company' && user._id === companyId) return true;
  
  // Subusers have access to their company's data
  if (user.role === 'subuser' && user.companyId === companyId) return true;
  
  return false;
}









