import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubUser from "@/lib/models/SubUser";
import { getUserFromRequest } from "@/lib/auth-utils";

// GET a specific subuser by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'company' && user.role !== 'subuser')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const subUser = await SubUser.findById(params.id).populate('companyId');
    
    if (!subUser) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: subUser 
    });
  } catch (error: any) {
    console.error("Error fetching subuser:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to fetch team member" 
    }, { status: 500 });
  }
}

// PUT update a subuser
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'company' && user.role !== 'subuser')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, role, branch, access } = body;

    const updateData: any = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password; // In production, hash this
    if (role !== undefined) updateData.role = role;
    if (branch !== undefined) updateData.branch = branch;
    if (access) {
      updateData.access = {
        carManagement: access.carManagement || false,
        analytics: access.analytics || false,
        setting: access.setting || false,
        sales: access.sales || false,
        customers: access.customers || false,
        investors: access.investors || false,
        dashboardUnits: access.dashboardUnits || false,
      };
    }

    const subUser = await SubUser.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!subUser) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      data: subUser,
      message: "Team member updated successfully" 
    });
  } catch (error: any) {
    console.error("Error updating subuser:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to update team member" 
    }, { status: 500 });
  }
}

// DELETE a subuser
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'company' && user.role !== 'subuser')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const subUser = await SubUser.findByIdAndDelete(params.id);
    
    if (!subUser) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Team member deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting subuser:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to delete team member" 
    }, { status: 500 });
  }
}
