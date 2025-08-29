import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Batch } from '@/lib/models';
import { CreateBatchInput } from '@/lib/models/types';

// GET /api/batches/[id] - Get a specific batch by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const batch = await Batch.findById(params.id)
      .populate('investors', 'name emailAddress investorId investAmount percentageShare amountPaid remainingAmount')
      .populate('cars', 'carName company status')
      .lean();

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: batch
    });

  } catch (error) {
    console.error('Error fetching batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch batch' },
      { status: 500 }
    );
  }
}

// PUT /api/batches/[id] - Update a specific batch
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body: Partial<CreateBatchInput> = await request.json();
    
    // Check if batch exists
    const existingBatch = await Batch.findById(params.id);
    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Check if batch number is being updated and if it already exists
    if (body.batchNo && body.batchNo !== existingBatch.batchNo) {
      const duplicateBatch = await Batch.findOne({ 
        batchNo: body.batchNo,
        _id: { $ne: params.id }
      });
      
      if (duplicateBatch) {
        return NextResponse.json(
          { success: false, error: 'Batch with this number already exists' },
          { status: 409 }
        );
      }
    }

    // Update batch
    const updatedBatch = await Batch.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    )
    .populate('investors', 'name emailAddress investorId investAmount percentageShare amountPaid remainingAmount')
    .populate('cars', 'carName company status');

    return NextResponse.json({
      success: true,
      data: updatedBatch,
      message: 'Batch updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating batch:', error);
    
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
        { success: false, error: 'Batch with this number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update batch' },
      { status: 500 }
    );
  }
}

// DELETE /api/batches/[id] - Delete a specific batch
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const deletedBatch = await Batch.findByIdAndDelete(params.id);
    
    if (!deletedBatch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Batch deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting batch:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete batch' },
      { status: 500 }
    );
  }
}
