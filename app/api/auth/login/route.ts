import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// POST /api/auth/login - Authenticate user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    console.log(email,password)
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

    // Debug logging
    console.log('=== LOGIN DEBUG ===');
    console.log('Email provided:', email);
    console.log('Password provided:', password);
    console.log('User found:', user.email);
    console.log('User PIN in DB:', user.pin);
    console.log('User confirmPin in DB:', user.confirmPin);
    console.log('PIN comparison:', user.pin.toLowerCase(), '===', password.toLowerCase());
    console.log('Full user object:', JSON.stringify(user, null, 2));

    // Check if PIN exists
    if (!user.pin) {
      console.log('PIN is missing from user record!');
      return NextResponse.json(
        { success: false, error: 'User PIN not set. Please contact administrator.' },
        { status: 401 }
      );
    }

    // Check if password matches pin (case-insensitive)
    if (user.pin.toLowerCase() !== password.toLowerCase()) {
      console.log('PIN mismatch! Login failed.');
      console.log('Expected PIN:', user.pin);
      console.log('Provided password:', password);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('PIN match! Login successful.');

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
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
