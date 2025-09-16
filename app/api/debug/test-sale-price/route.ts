import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth';

// GET /api/debug/test-sale-price - Test sale price calculation
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

    // Get all batches
    const batches = await Batch.find({ companyId });
    console.log('Total batches found:', batches.length);

    const results = [];

    for (const batch of batches) {
      console.log(`\n--- Processing Batch ${batch.batchNo} ---`);
      
      // Get all cars in this batch
      const cars = await Car.find({ 
        companyId: batch.companyId,
        batchNo: batch.batchNo 
      });
      
      console.log(`Cars in batch ${batch.batchNo}:`, cars.length);
      
      if (cars.length > 0) {
        // Get chassis numbers of all cars in the batch
        const chassisNumbers = cars.map(car => car.chasisNumber);
        console.log('Chassis numbers from cars:', chassisNumbers);
        
        // Find customers for these cars (by chassis number)
        const customers = await Customer.find({
          companyId: batch.companyId,
          'vehicle.chassisNumber': { $in: chassisNumbers }
        });
        
        console.log(`Customers found for batch ${batch.batchNo}:`, customers.length);
        
        if (customers.length > 0) {
          console.log('Customer details:', customers.map(c => ({
            name: c.customer.name,
            chassisNumber: c.vehicle.chassisNumber,
            salePrice: c.sale.salePrice
          })));
        }
        
        // Calculate total sale price
        const totalSalePrice = customers.reduce((total, customer) => {
          return total + (customer.sale.salePrice || 0);
        }, 0);
        
        console.log(`Total sale price for batch ${batch.batchNo}:`, totalSalePrice);
        
        results.push({
          batchNo: batch.batchNo,
          batchId: batch._id,
          carsCount: cars.length,
          customersCount: customers.length,
          totalSalePrice,
          currentBatchSalePrice: batch.totalSalePrice,
          chassisNumbers,
          customers: customers.map(c => ({
            name: c.customer.name,
            chassisNumber: c.vehicle.chassisNumber,
            salePrice: c.sale.salePrice
          }))
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalBatches: batches.length,
        results
      }
    });

  } catch (error: any) {
    console.error('Error testing sale price calculation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


