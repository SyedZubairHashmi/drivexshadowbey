import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';

// PUT /api/batches/[id]/update-expense - Update batch total expense
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const { totalExpense } = await request.json();
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    if (totalExpense === undefined || totalExpense === null) {
      return NextResponse.json(
        { success: false, error: 'Total expense amount is required' },
        { status: 400 }
      );
    }

    if (typeof totalExpense !== 'number' || totalExpense < 0) {
      return NextResponse.json(
        { success: false, error: 'Total expense must be a positive number' },
        { status: 400 }
      );
    }

    // Find batch by ID
    const batch = await Batch.findById(id);

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Update the batch total expense
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { totalExpense },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedBatch,
      message: 'Batch total expense updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating batch total expense:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

