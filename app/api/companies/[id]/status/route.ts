import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Company } from '@/lib/models';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { status } = await request.json();
    const { id } = params;

    // Validate status
    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be "active" or "inactive"' },
        { status: 400 }
      );
    }

    // Validate company ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Find and update the company
    const updatedCompany = await Company.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedCompany) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: `Company status updated to ${status}`
    });

  } catch (error: any) {
    console.error('Error updating company status:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update company status' },
      { status: 500 }
    );
  }
}