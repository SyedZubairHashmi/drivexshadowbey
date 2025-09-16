import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';

// PUT /api/batches/[id]/financial - Update batch financial values
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const { totalCost, totalSalePrice, totalInvestment, totalExpense } = await request.json();
    
    // Validate required fields
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

    // Update financial fields (only update provided fields)
    const updateData: any = {};
    if (totalCost !== undefined) updateData.totalCost = totalCost;
    if (totalSalePrice !== undefined) updateData.totalSalePrice = totalSalePrice;
    if (totalInvestment !== undefined) updateData.totalInvestment = totalInvestment;
    if (totalExpense !== undefined) updateData.totalExpense = totalExpense;

    // Update the batch
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedBatch,
      message: 'Batch financial values updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating batch financial values:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/batches/[id]/financial - Get batch financial values
export async function GET(
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
    const batch = await Batch.findById(id).select('totalCost totalSalePrice totalInvestment totalExpense profit');

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        totalCost: batch.totalCost,
        totalSalePrice: batch.totalSalePrice,
        totalInvestment: batch.totalInvestment,
        totalExpense: batch.totalExpense,
        profit: batch.profit
      }
    });

  } catch (error: any) {
    console.error('Error fetching batch financial values:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

