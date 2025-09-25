import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Admin, Company, SubUser } from '@/lib/models';

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

    // Try company (by companyEmail)
    const company = await Company.findOne({ companyEmail: emailMatcher });
    if (company) {
      if (!company.password || company.password !== password) {
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
    }

    // Try subuser (by email)
    const subuser = await SubUser.findOne({ email: emailMatcher }).populate('companyId');
    if (subuser) {
      if (!subuser.password || subuser.password !== password) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Get company information
      const company = await Company.findById(subuser.companyId);
      if (!company || company.status !== 'active') {
        return NextResponse.json(
          { success: false, error: 'Company account is inactive or not found' },
          { status: 403 }
        );
      }

      const subuserResponse = {
        _id: subuser._id,
        name: subuser.name,
        email: subuser.email,
        role: 'subuser' as const,
        userRole: subuser.role || 'Staff', // The role like Accountant, Staff, etc.
        companyId: subuser.companyId,
        companyName: company.companyName,
        branch: subuser.branch,
        access: subuser.access,
        createdAt: subuser.createdAt,
        updatedAt: subuser.updatedAt,
      };

      const response = NextResponse.json({ success: true, data: subuserResponse, message: 'Login successful' });
      
      // Set user data in cookie for middleware access
      response.cookies.set('user', JSON.stringify(subuserResponse), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      // Set subuser access cookie to allow route-level permissions in middleware
      if (subuser.access) {
        response.cookies.set('subuser_access', JSON.stringify(subuser.access), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7
        });
      }
      
      return response;
    }

    // If no user found
    return NextResponse.json(
      { success: false, error: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error: any) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
