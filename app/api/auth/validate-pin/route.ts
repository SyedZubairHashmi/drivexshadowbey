import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// POST /api/auth/validate-pin - Validate user PIN
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, pin } = await request.json();
    
    // Validate required fields
    if (!email || !pin) {
      return NextResponse.json(
        { success: false, error: 'Email and PIN are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if PIN matches (case-insensitive)
    const isValid = user.pin.toLowerCase() === pin.toLowerCase();

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
