import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users/[id] - Get a specific user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select('-pin -confirmPin');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });

  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a specific user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const userData = await request.json();
    
    // Remove fields that shouldn't be updated directly
    delete userData._id;
    delete userData.createdAt;
    
    // If updating email, check for duplicates
    if (userData.email) {
      const existingUser = await User.findOne({
        _id: { $ne: params.id },
        email: userData.email
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // If updating PIN, validate PIN matching
    if (userData.pin && userData.confirmPin && userData.pin !== userData.confirmPin) {
      return NextResponse.json(
        { success: false, error: 'PIN and confirm PIN do not match' },
        { status: 400 }
      );
    }

    // If only pin is provided without confirmPin, copy pin to confirmPin
    if (userData.pin && !userData.confirmPin) {
      userData.confirmPin = userData.pin;
    }

    // If only confirmPin is provided without pin, copy confirmPin to pin
    if (userData.confirmPin && !userData.pin) {
      userData.pin = userData.confirmPin;
    }

    const user = await User.findByIdAndUpdate(
      params.id,
      { ...userData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-pin -confirmPin');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete a specific user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
