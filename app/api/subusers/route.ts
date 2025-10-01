import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubUser from '@/lib/models/SubUser';
import { getCompanyIdFromRequest, getUserFromRequest } from '@/lib/auth-utils';

// GET /api/subusers - list team members for current company
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const companyId = getCompanyIdFromRequest(request);
    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const user = getUserFromRequest(request);
    // Only company or admin can list subusers
    if (user?.role !== 'company' && user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const members = await SubUser.find({ companyId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    console.error('Error fetching subusers:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch subusers' }, { status: 500 });
  }
}

// POST /api/subusers - create a new team member for current company
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const companyId = getCompanyIdFromRequest(request);
    if (!companyId) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const user = getUserFromRequest(request);
    // Only company or admin can create subusers
    if (user?.role !== 'company' && user?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, password, role, branch, access } = body || {};

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    // Enforce unique email per system
    const existing = await SubUser.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, error: 'A user with this email already exists' }, { status: 409 });
    }

    const subUserDoc = new SubUser({
      companyId,
      name,
      email,
      password,
      role,
      branch,
      access: {
        carManagement: access?.carManagement === true,
        analytics: access?.analytics === true,
        setting: access?.setting === true,
        salesAndPayments: access?.salesAndPayments === true,
        investors: access?.investors === true,
        dashboardUnits: access?.dashboardUnits === true,
      },
    });

    const saved = await subUserDoc.save();
    return NextResponse.json({ success: true, data: saved, message: 'Subuser created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subuser:', error);
    if (error?.code === 11000) {
      return NextResponse.json({ success: false, error: 'Duplicate email' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: 'Failed to create subuser' }, { status: 500 });
  }
}


