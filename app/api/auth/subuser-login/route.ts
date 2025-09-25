import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubUser from "@/lib/models/SubUser";
import Company from "@/lib/models/Company";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: "Email and password are required" 
      }, { status: 400 });
    }

    console.log("=== SUBUSER LOGIN DEBUG ===");
    console.log("Login attempt for email:", email);

    // Find subuser by email
    const subuser = await SubUser.findOne({ email }).populate('companyId');
    
    if (!subuser) {
      console.log("Subuser not found for email:", email);
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    // Check password (in production, use proper password hashing)
    if (subuser.password !== password) {
      console.log("Invalid password for subuser:", email);
      return NextResponse.json({ 
        success: false, 
        error: "Invalid email or password" 
      }, { status: 401 });
    }

    // Get company information
    const company = await Company.findById(subuser.companyId);
    if (!company) {
      console.log("Company not found for subuser:", subuser.companyId);
      return NextResponse.json({ 
        success: false, 
        error: "Company not found" 
      }, { status: 404 });
    }

    // Ensure company is active before allowing login
    if (company.status !== 'active') {
      console.log("Company inactive for subuser:", subuser.companyId);
      return NextResponse.json({
        success: false,
        error: "Company account is inactive"
      }, { status: 403 });
    }

    // Create user session data
    const userSession = {
      _id: subuser._id,
      name: subuser.name,
      email: subuser.email,
      role: 'subuser',
      userRole: subuser.role || 'Staff', // The role like Accountant, Staff, etc.
      companyId: subuser.companyId,
      companyName: company.companyName,
      branch: subuser.branch,
      access: subuser.access,
      createdAt: subuser.createdAt,
      updatedAt: subuser.updatedAt
    };

    console.log("Subuser login successful:", {
      id: subuser._id,
      name: subuser.name,
      email: subuser.email,
      role: subuser.role,
      companyId: subuser.companyId,
      companyName: company.companyName
    });

    // Create response with user data (rich payload for client use)
    const response = NextResponse.json({ 
      success: true, 
      data: userSession,
      message: "Login successful" 
    });

    // Set minimal authentication cookie (server-side auth only)
    const cookieUser = {
      _id: String(subuser._id),
      role: 'subuser',
      companyId: String(subuser.companyId)
    };
    response.cookies.set('user', JSON.stringify(cookieUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Set subuser access cookie so middleware can enforce per-route permissions
    if (subuser.access) {
      response.cookies.set('subuser_access', JSON.stringify(subuser.access), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
    }

    return response;
  } catch (error: any) {
    console.error("Error in subuser login:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Login failed" 
    }, { status: 500 });
  }
}

