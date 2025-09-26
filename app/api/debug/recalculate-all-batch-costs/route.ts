import { NextRequest, NextResponse } from 'next/server';
import { calculateAllBatchesTotalCost } from '@/lib/utils/batchCalculations';

// POST /api/debug/recalculate-all-batch-costs - Manually recalculate all batch total costs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    console.log('Starting manual recalculation of all batch total costs...');
    const result = await calculateAllBatchesTotalCost(companyId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    console.log('Manual batch total cost recalculation completed:', result);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'All batches total cost recalculated successfully'
    });

  } catch (error: any) {
    console.error('Error in manual batch total cost recalculation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

