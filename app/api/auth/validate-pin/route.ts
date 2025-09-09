import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/lib/models/Company';

// POST /api/auth/validate-pin - Validate company password
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find company by email
    const company = await Company.findOne({ companyEmail: email.toLowerCase() });

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if password matches (case-insensitive)
    const isValid = company.password.toLowerCase() === password.toLowerCase();

    return NextResponse.json({
      success: true,
      isValid: isValid,
      message: isValid ? 'Password is valid' : 'Invalid password'
    });

  } catch (error: any) {
    console.error('Error validating PIN:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
