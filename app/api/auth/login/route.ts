import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// POST /api/auth/login - Authenticate user
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

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if password matches pin (case-insensitive)
    if (user.pin.toLowerCase() !== password.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Remove sensitive fields from response
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
      city: user.city,
      country: user.country,
      recoveryEmail: user.recoveryEmail,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'Login successful'
    });

  } catch (error: any) {
    console.error('Error during login:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return more specific error information for debugging
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Database connection or validation error'
      },
      { status: 500 }
    );
  }
}
