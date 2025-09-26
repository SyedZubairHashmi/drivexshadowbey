import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SubUser from '@/lib/models/SubUser';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the company ID from the request headers or session
    const companyId = request.headers.get('x-company-id');
    
    if (!companyId) {
      return NextResponse.json(
        { success: false, message: 'Company ID not found' },
        { status: 400 }
      );
    }

    // Fetch all subusers for this company
    const teamMembers = await SubUser.find({
      companyId: companyId
    }).select('_id name email role branch password createdAt');

    return NextResponse.json({
      success: true,
      data: teamMembers
    });

  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
