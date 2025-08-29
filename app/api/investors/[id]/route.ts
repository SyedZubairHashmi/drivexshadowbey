import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Investor } from '@/lib/models';

// GET /api/investors/[id] - Get a specific investor by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const investor = await Investor.findById(params.id).lean();

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
    
    const body = await request.json();
    
    // Check if investor exists
    const existingInvestor = await Investor.findById(params.id);
    if (!existingInvestor) {
      return NextResponse.json(
        { success: false, error: 'Investor not found' },
        { status: 404 }
      );
    }

    // Handle batch number change
    if (body.batchNo && body.batchNo !== existingInvestor.batchNo) {
      const Batch = (await import('@/lib/models')).Batch;
      
      // Check if new batch exists
      const newBatch = await Batch.findOne({ batchNo: body.batchNo });
      if (!newBatch) {
        return NextResponse.json(
          { success: false, error: `Batch with number "${body.batchNo}" not found. Please create the batch first.` },
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
    
    // Check if investor exists
    const investor = await Investor.findById(params.id);
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
