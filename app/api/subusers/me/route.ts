import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import SubUser from '@/lib/models/SubUser';
import { getUserFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const auth = getUserFromRequest(request);
    if (!auth || auth.role !== 'subuser' || !auth._id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const subuser = await SubUser.findById(auth._id).populate('companyId').lean();
    if (!subuser) {
      return NextResponse.json({ success: false, error: 'Subuser not found' }, { status: 404 });
    }

    // Return normalized payload
    const company: any = subuser.companyId;
    const data = {
      _id: subuser._id,
      name: subuser.name,
      email: subuser.email,
      role: 'subuser' as const,
      userRole: subuser.role || 'Staff',
      companyId: company?._id || subuser.companyId,
      companyName: company?.companyName,
      branch: subuser.branch,
      access: subuser.access,
      createdAt: subuser.createdAt,
      updatedAt: subuser.updatedAt,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to load subuser data' }, { status: 500 });
  }
}


