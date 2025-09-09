import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Investor } from '@/lib/models';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// GET /api/investors/[id] - Get a specific investor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Get company ID from authentication
    const companyId = getCompanyIdFromRequest(request);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const investor = await Investor.findOne({ _id: params.id, companyId }).lean();

    if (!investor) {
      return NextResponse.json(
        { success: false, error: 'Investor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: investor
    });

  } catch (error) {
    console.error('Error fetching investor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investor' },
      { status: 500 }
    );
  }
}

// PUT /api/investors/[id] - Update a specific investor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Get company ID from authentication
    const companyId = getCompanyIdFromRequest(request);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Check if investor exists and belongs to the company
    const existingInvestor = await Investor.findOne({ _id: params.id, companyId });
    if (!existingInvestor) {
      return NextResponse.json(
        { success: false, error: 'Investor not found' },
        { status: 404 }
      );
    }

    // Handle batch number change
    if (body.batchNo && body.batchNo !== existingInvestor.batchNo) {
      const Batch = (await import('@/lib/models')).Batch;
      
      // Check if new batch exists and belongs to the company
      const newBatch = await Batch.findOne({ batchNo: body.batchNo, companyId });
      if (!newBatch) {
        return NextResponse.json(
          { success: false, error: `Batch with number "${body.batchNo}" not found for your company. Please create the batch first.` },
          { status: 404 }
        );
      }

      // Remove investor from old batch
      await Batch.updateMany(
        { investors: params.id },
        { $pull: { investors: params.id } }
      );

      // Add investor to new batch
      await Batch.findByIdAndUpdate(
        newBatch._id,
        { $push: { investors: params.id } }
      );
    }

    // Update investor - remainingAmount will be calculated automatically by the model
    const updatedInvestor = await Investor.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedInvestor,
      message: 'Investor updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating investor:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Investor with this email or ID already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update investor' },
      { status: 500 }
    );
  }
}

// DELETE /api/investors/[id] - Delete a specific investor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Get company ID from authentication
    const companyId = getCompanyIdFromRequest(request);
    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if investor exists and belongs to the company
    const investor = await Investor.findOne({ _id: params.id, companyId });
    if (!investor) {
      return NextResponse.json(
        { success: false, error: 'Investor not found' },
        { status: 404 }
      );
    }

    // Remove investor from batch's investors array
    const Batch = (await import('@/lib/models')).Batch;
    await Batch.updateMany(
      { investors: params.id },
      { $pull: { investors: params.id } }
    );

    // Delete investor
    await Investor.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Investor deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting investor:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete investor' },
      { status: 500 }
    );
  }
}
