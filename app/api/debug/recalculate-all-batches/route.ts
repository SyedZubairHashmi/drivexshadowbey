import { NextRequest, NextResponse } from 'next/server';
import { calculateAllBatchesTotalSalePrice } from '@/lib/utils/batchCalculations';

// POST /api/debug/recalculate-all-batches - Manually recalculate all batch sale prices
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    console.log('Starting manual recalculation of all batch sale prices...');
    const result = await calculateAllBatchesTotalSalePrice(companyId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    console.log('Manual recalculation completed:', result);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'All batches total sale price recalculated successfully'
    });

  } catch (error: any) {
    console.error('Error in manual batch recalculation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


