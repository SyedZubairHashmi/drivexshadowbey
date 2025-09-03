import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users/debug - Debug endpoint to check database state
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get all users with full data
    const users = await User.find({});
    
    const debugData = {
      totalUsers: users.length,
      users: users.map(user => ({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        pin: user.pin,
        confirmPin: user.confirmPin,
        pinType: typeof user.pin,
        confirmPinType: typeof user.confirmPin,
        pinLength: user.pin ? user.pin.length : 0,
        confirmPinLength: user.confirmPin ? user.confirmPin.length : 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    };
    
    return NextResponse.json({
      success: true,
      data: debugData,
      message: 'Debug data retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
