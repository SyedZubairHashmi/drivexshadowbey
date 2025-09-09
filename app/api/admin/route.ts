import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Admin } from '@/lib/models';

// POST /api/admin - Create a new admin
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const { name, email, password } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: name, email, password' 
        },
        { status: 400 }
      );
    }

    // Check if admin with same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Admin with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Create new admin
    const adminData = {
      name,
      email,
      password,
      role: 'admin' // Always set role to admin
    };

    const admin = new Admin(adminData);
    await admin.save();

    return NextResponse.json({
      success: true,
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        createdAt: admin.createdAt
      },
      message: 'Admin created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create admin',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET /api/admin - Get all admins
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const admins = await Admin.find({})
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: admins,
      message: 'Admins fetched successfully'
    });

  } catch (error: any) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch admins',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

