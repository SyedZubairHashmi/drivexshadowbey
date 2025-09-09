import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Admin, Company } from '@/lib/models';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

    // Build case-insensitive matcher for exact email
    const emailMatcher = { $regex: `^${escapeRegExp(email)}$`, $options: 'i' } as const;

    // Try admin first (by email)
    const admin = await Admin.findOne({ email: emailMatcher });
    if (admin) {
      if (!admin.password || admin.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const adminResponse = {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin' as const,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      };

      const response = NextResponse.json({ success: true, data: adminResponse, message: 'Login successful' });
      
      // Set user data in cookie for middleware access
      response.cookies.set('user', JSON.stringify(adminResponse), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      return response;
    }

    // Fallback: try company (by companyEmail)
    const company = await Company.findOne({ companyEmail: emailMatcher });
    if (!company || !company.password || company.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Block inactive companies
    if (company.status !== 'active') {
      return NextResponse.json(
        { success: false, error: 'Company account is inactive. Please contact support.' },
        { status: 403 }
      );
    }

    const companyResponse = {
      _id: company._id,
      ownerName: company.ownerName,
      companyName: company.companyName,
      companyEmail: company.companyEmail,
      status: company.status,
      recoveryEmail: company.recoveryEmail,
      role: 'company' as const,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };

    const response = NextResponse.json({ success: true, data: companyResponse, message: 'Login successful' });
    
    // Set user data in cookie for middleware access
    response.cookies.set('user', JSON.stringify(companyResponse), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;

  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
