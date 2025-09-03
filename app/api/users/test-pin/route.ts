import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users/test-pin - Test endpoint to check PIN values
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all users to see their PIN values
    const users = await User.find({});
    
    const userData = users.map(user => ({
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      pin: user.pin,
      confirmPin: user.confirmPin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      data: userData,
      message: 'User PIN data retrieved for testing'
    });

  } catch (error: any) {
    console.error('Error testing PIN data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
