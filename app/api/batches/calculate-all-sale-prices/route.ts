import { NextRequest, NextResponse } from 'next/server';
import { calculateAllBatchesTotalSalePrice } from '@/lib/utils/batchCalculations';

// POST /api/batches/calculate-all-sale-prices - Calculate and update total sale price for all batches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyId } = body;

    const result = await calculateAllBatchesTotalSalePrice(companyId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'All batches total sale price calculated successfully'
    });

  } catch (error: any) {
    console.error('Error in calculate-all-sale-prices API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/batches/calculate-all-sale-prices - Get current total sale price data for all batches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    const result = await calculateAllBatchesTotalSalePrice(companyId || undefined);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Batch sale price data retrieved successfully'
    });

  } catch (error: any) {
    console.error('Error in calculate-all-sale-prices GET API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
