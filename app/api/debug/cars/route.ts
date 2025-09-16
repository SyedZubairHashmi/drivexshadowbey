import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/lib/models/Car';
import { getCompanyIdFromRequest } from '@/lib/auth';

// GET /api/debug/cars - Debug car data
export async function GET(request: NextRequest) {
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

    // Get all cars for this company
    const cars = await Car.find({ companyId }).select('carName chasisNumber batchNo');
    
    console.log('Debug - Total cars found:', cars.length);
    console.log('Debug - Car data:', cars.map(c => ({
      carName: c.carName,
      chassisNumber: c.chasisNumber,
      batchNo: c.batchNo
    })));

    return NextResponse.json({
      success: true,
      data: {
        totalCars: cars.length,
        cars: cars.map(c => ({
          carName: c.carName,
          chassisNumber: c.chasisNumber,
          batchNo: c.batchNo
        }))
      }
    });

  } catch (error: any) {
    console.error('Error debugging cars:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

