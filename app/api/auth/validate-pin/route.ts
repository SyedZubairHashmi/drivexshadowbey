import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/lib/models/Company';
import { getUserFromRequest } from '@/lib/auth-utils';

// POST /api/auth/validate-pin - Validate company PIN
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { password } = await request.json();
    
    // Get current user from authentication cookie
    const user = getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Validate required fields
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'PIN is required' },
        { status: 400 }
      );
    }

    // Find company by user ID (for company users) or handle admin users
    let company;
    if (user.role === 'company') {
      company = await Company.findById(user._id);
    } else {
      // For admin users, we might need different logic or skip PIN validation
      return NextResponse.json(
        { success: false, error: 'PIN validation not available for admin users' },
        { status: 400 }
      );
    }

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if PIN matches (case-insensitive)
    const isValid = company.pin && company.pin.toLowerCase() === password.toLowerCase();

    return NextResponse.json({
      success: true,
      isValid: isValid,
      message: isValid ? 'PIN is valid' : 'Invalid PIN'
    });

  } catch (error: any) {
    console.error('Error validating PIN:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
