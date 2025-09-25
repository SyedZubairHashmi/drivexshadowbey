import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubUser from "@/lib/models/SubUser";
import { getUserFromRequest } from "@/lib/auth-utils";

// GET all subusers for a company
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'company' && user.role !== 'subuser')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ success: false, error: "Company ID is required" }, { status: 400 });
    }

    const subUsers = await SubUser.find({ companyId }).populate('companyId');
    
    return NextResponse.json({ 
      success: true, 
      data: subUsers 
    });
  } catch (error: any) {
    console.error("Error fetching subusers:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to fetch team members" 
    }, { status: 500 });
  }
}

// POST create a new subuser
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'company') {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, role, branch, access } = body;
    
    console.log("=== SUBUSER CREATE API DEBUG ===");
    console.log("Request body:", body);
    console.log("User:", user);
    console.log("Extracted fields:", { name, email, password, role, branch, access });

    // Validate required fields
    if (!name || !email || !password) {
      console.log("Validation failed - missing required fields:", { name: !!name, email: !!email, password: !!password });
      return NextResponse.json({ 
        success: false, 
        error: "Name, email, and password are required" 
      }, { status: 400 });
    }

    // Check if email already exists
    const existingSubUser = await SubUser.findOne({ email });
    if (existingSubUser) {
      console.log("Email already exists:", email);
      return NextResponse.json({ 
        success: false, 
        error: "Email already exists" 
      }, { status: 400 });
    }

    const subUserData = {
      companyId: user._id,
      name,
      email,
      password, // In production, hash this
      role: role || undefined,
      branch: branch || undefined,
      access: {
        carManagement: access?.carManagement || false,
        analytics: access?.analytics || false,
        setting: access?.setting || false,
        sales: access?.sales || false,
        customers: access?.customers || false,
        investors: access?.investors || false,
        dashboardUnits: access?.dashboardUnits || false,
      },
    };

    console.log("Creating SubUser with data:", subUserData);
    
    const subUser = new SubUser(subUserData);
    await subUser.save();
    
    console.log("SubUser created successfully:", subUser);
    
    return NextResponse.json({ 
      success: true, 
      data: subUser,
      message: "Team member created successfully" 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating subuser:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to create team member" 
    }, { status: 500 });
  }
}
