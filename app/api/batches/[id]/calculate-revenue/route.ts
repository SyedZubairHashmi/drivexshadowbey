import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';

// POST /api/batches/[id]/calculate-revenue - Calculate and update batch revenue
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
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

    // Calculate revenue: totalSalePrice - totalCost
    const totalRevenue = (batch.totalSalePrice || 0) - (batch.totalCost || 0);

    // Update batch total revenue
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { totalRevenue },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        totalSalePrice: batch.totalSalePrice,
        totalCost: batch.totalCost,
        batch: updatedBatch
      },
      message: 'Batch revenue calculated and updated successfully'
    });

  } catch (error: any) {
    console.error('Error calculating batch revenue:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

