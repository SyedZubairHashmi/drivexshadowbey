import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth';

// POST /api/debug/test-batch-03-sale-price - Test sale price calculation for batch 03
export async function POST(request: NextRequest) {
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

    const batchId = '68c87a3f31c9a718a62cc110';

    console.log('=== TESTING SALE PRICE CALCULATION FOR BATCH 03 ===');

    // Find batch by ID
    const batch = await Batch.findById(batchId);
    console.log('Batch found:', batch ? { id: batch._id, batchNo: batch.batchNo, companyId: batch.companyId } : 'null');

    if (!batch) {
      return NextResponse.json(
        { success: false, error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Get all cars in this batch
    const cars = await Car.find({ 
      companyId: batch.companyId,
      batchNo: batch.batchNo 
    });

    console.log('Cars in batch:', cars.length);
    console.log('Car details:', cars.map(car => ({
      id: car._id,
      carName: car.carName,
      chasisNumber: car.chasisNumber
    })));

    if (cars.length === 0) {
      return NextResponse.json({
        success: true,
        data: { totalSalePrice: 0 },
        message: 'No cars found in batch'
      });
    }

    // Get chassis numbers of all cars in the batch
    const chassisNumbers = cars.map(car => car.chasisNumber);
    console.log('Chassis numbers from cars:', chassisNumbers);

    // Find customers for these cars (by chassis number) - using the fixed query
    const customers = await Customer.find({
      companyId: batch.companyId,
      $or: [
        { 'vehicle.chassisNumber': { $in: chassisNumbers } },
        { 'vehicle.chasisNumber': { $in: chassisNumbers } }
      ]
    });

    console.log('Customers found for chassis numbers:', customers.length);
    console.log('Customer details:', customers.map(customer => ({
      id: customer._id,
      name: customer.customer.name,
      chassisNumber: customer.vehicle.chassisNumber,
      chasisNumber: customer.vehicle.chasisNumber,
      salePrice: customer.sale.salePrice
    })));

    // Calculate total sale price
    const totalSalePrice = customers.reduce((total, customer) => {
      return total + (customer.sale.salePrice || 0);
    }, 0);

    console.log('Total sale price calculated:', totalSalePrice);

    // Update batch total sale price
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { totalSalePrice },
      { new: true, runValidators: true }
    );

    console.log('Batch updated with totalSalePrice:', updatedBatch?.totalSalePrice);

    return NextResponse.json({
      success: true,
      data: {
        totalSalePrice,
        carsCount: cars.length,
        customersCount: customers.length,
        batch: updatedBatch,
        chassisNumbers,
        customers: customers.map(customer => ({
          id: customer._id,
          name: customer.customer.name,
          chassisNumber: customer.vehicle.chassisNumber,
          chasisNumber: customer.vehicle.chasisNumber,
          salePrice: customer.sale.salePrice
        }))
      },
      message: 'Batch total sale price calculated and updated successfully'
    });

  } catch (error: any) {
    console.error('Error testing batch 03 sale price calculation:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}








