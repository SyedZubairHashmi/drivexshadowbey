import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth';

// GET /api/debug/chassis-fields - Debug chassis field names
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

    // Get sample cars and customers
    const cars = await Car.find({ companyId }).limit(3).select('chasisNumber carName');
    const customers = await Customer.find({ companyId }).limit(3).select('vehicle.chassisNumber customer.name');
    
    console.log('Sample cars chassis fields:', cars.map(c => ({ 
      carName: c.carName, 
      chasisNumber: c.chasisNumber,
      hasChassisNumber: 'chassisNumber' in c 
    })));
    
    console.log('Sample customers chassis fields:', customers.map(c => ({ 
      name: c.customer.name, 
      chassisNumber: c.vehicle.chassisNumber,
      hasChasisNumber: 'chasisNumber' in c.vehicle 
    })));

    return NextResponse.json({
      success: true,
      data: {
        cars: cars.map(c => ({ 
          carName: c.carName, 
          chasisNumber: c.chasisNumber,
          hasChassisNumber: 'chassisNumber' in c 
        })),
        customers: customers.map(c => ({ 
          name: c.customer.name, 
          chassisNumber: c.vehicle.chassisNumber,
          hasChasisNumber: 'chasisNumber' in c.vehicle 
        }))
      }
    });

  } catch (error: any) {
    console.error('Error debugging chassis fields:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


