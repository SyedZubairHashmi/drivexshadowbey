import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth';

// GET /api/debug/customers - Debug customer data
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

    // Get all customers for this company
    const customers = await Customer.find({ companyId }).select('vehicle.chassisNumber sale.salePrice customer.name');
    
    console.log('Debug - Total customers found:', customers.length);
    console.log('Debug - Customer data:', customers.map(c => ({
      name: c.customer.name,
      chassisNumber: c.vehicle.chassisNumber,
      salePrice: c.sale.salePrice
    })));

    return NextResponse.json({
      success: true,
      data: {
        totalCustomers: customers.length,
        customers: customers.map(c => ({
          name: c.customer.name,
          chassisNumber: c.vehicle.chassisNumber,
          salePrice: c.sale.salePrice
        }))
      }
    });

  } catch (error: any) {
    console.error('Error debugging customers:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

