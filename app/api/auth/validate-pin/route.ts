import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Company from '@/lib/models/Company';

// POST /api/auth/validate-pin - Validate company PIN by company ID
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { companyId, pin } = await request.json();
    
    // Validate required fields
    if (!companyId || !pin) {
      return NextResponse.json(
        { success: false, error: 'Company ID and PIN are required' },
        { status: 400 }
      );
    }

    // Find company by ID
    const company = await Company.findById(companyId);

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if PIN matches
    const isValid = company.pin === pin;

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
