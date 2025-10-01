import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// GET /api/debug/test-db - Test database connection and Customer model
export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connected successfully');

    // Get company ID from authentication
    const companyId = getCompanyIdFromRequest(request);
    console.log('Company ID from request:', companyId);

    if (!companyId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        },
        { status: 401 }
      );
    }

    // Test Customer model
    console.log('Testing Customer model...');
    const customerCount = await Customer.countDocuments({ companyId });
    console.log('Customer count for company:', customerCount);

    // Try to find customers
    const customers = await Customer.find({ companyId }).limit(5).lean();
    console.log('Found customers:', customers.length);

    return NextResponse.json({
      success: true,
      data: {
        companyId,
        customerCount,
        sampleCustomers: customers,
        message: 'Database and Customer model working correctly'
      }
    });

  } catch (error: any) {
    console.error('Error in test-db endpoint:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database test failed',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}

