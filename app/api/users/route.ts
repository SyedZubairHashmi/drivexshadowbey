import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET /api/users - Get all users or search users
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    let query = {};

    // Build search query if search parameter is provided
    if (search) {
      query = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { secondName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const userData = await request.json();
    
    // Validate required fields based on the User model
    const requiredFields = ['firstName', 'secondName', 'email', 'pin', 'confirmPin'];
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate PIN matching
    if (userData.pin !== userData.confirmPin) {
      return NextResponse.json(
        { success: false, error: 'PIN and confirm PIN do not match' },
        { status: 400 }
      );
    }

    // Process email to lowercase before checking existence
    const processedEmail = userData.email.toLowerCase().trim();
    
    // Check if email already exists (case-insensitive)
    const existingUser = await User.findOne({ email: processedEmail });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }
    
    // Update the userData with processed email
    userData.email = processedEmail;
    if (userData.recoveryEmail) {
      userData.recoveryEmail = userData.recoveryEmail.toLowerCase().trim();
    }

    const user = new User(userData);
    await user.save();

    // Return full user data for creation confirmation
    const userResponse = user.toObject();

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}