import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Investor from '@/lib/models/Investor';

// POST /api/batches/[id]/calculate-total-investment - Calculate and update batch total investment
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

    // Get all investors in this batch
    const investors = await Investor.find({ 
      companyId: batch.companyId,
      batchNo: batch.batchNo 
    });

    if (investors.length === 0) {
      return NextResponse.json({
        success: true,
        data: { totalInvestment: 0 },
        message: 'No investors found in batch'
      });
    }

    // Calculate total investment
    const totalInvestment = investors.reduce((total, investor) => {
      return total + (investor.investAmount || 0);
    }, 0);

    // Update batch total investment
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { totalInvestment },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        totalInvestment,
        investorsCount: investors.length,
        batch: updatedBatch
      },
      message: 'Batch total investment calculated and updated successfully'
    });

  } catch (error: any) {
    console.error('Error calculating batch total investment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

