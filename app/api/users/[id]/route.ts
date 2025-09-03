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

    const user = await User.findById(params.id);
    
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
    
    // Prepare update object with only provided fields
    const updateFields: any = {};
    
    // Process profile fields if provided
    if (userData.firstName !== undefined) updateFields.firstName = userData.firstName;
    if (userData.secondName !== undefined) updateFields.secondName = userData.secondName;
    if (userData.city !== undefined) updateFields.city = userData.city;
    if (userData.country !== undefined) updateFields.country = userData.country;
    if (userData.image !== undefined) updateFields.image = userData.image;
    
    // Process email if provided
    if (userData.email !== undefined) {
      const processedEmail = userData.email.toLowerCase().trim();
      updateFields.email = processedEmail;
      
      // Check for duplicate email
      const existingUser = await User.findOne({
        _id: { $ne: params.id },
        email: processedEmail
      });

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    
    // Process recoveryEmail if provided
    if (userData.recoveryEmail !== undefined) {
      updateFields.recoveryEmail = userData.recoveryEmail.toLowerCase().trim();
    }

    // Process PIN fields if provided
    if (userData.pin !== undefined || userData.confirmPin !== undefined) {
      // If only one PIN field is provided, copy it to the other
      if (userData.pin !== undefined && userData.confirmPin === undefined) {
        updateFields.confirmPin = userData.pin;
      } else if (userData.confirmPin !== undefined && userData.pin === undefined) {
        updateFields.pin = userData.confirmPin;
      } else {
        // Both PIN fields are provided
        updateFields.pin = userData.pin;
        updateFields.confirmPin = userData.confirmPin;
      }
      
      // Validate PIN matching if both are provided
      if (updateFields.pin && updateFields.confirmPin && updateFields.pin !== updateFields.confirmPin) {
        return NextResponse.json(
          { success: false, error: 'PIN and confirm PIN do not match' },
          { status: 400 }
        );
      }
    }

    // Add updatedAt timestamp
    updateFields.updatedAt = new Date();
    
    console.log('=== USER UPDATE DEBUG ===');
    console.log('User ID:', params.id);
    console.log('Original request data:', userData);
    console.log('Processed update fields:', updateFields);
    
    // Use $set to only update provided fields
    const user = await User.findByIdAndUpdate(
      params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    
    console.log('MongoDB update result:', user);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User updated successfully. New user data:', user);

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
