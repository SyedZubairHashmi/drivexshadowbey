import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth';

// GET /api/debug/batch-03 - Debug specific batch 03
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

    const batchId = '68c87a3f31c9a718a62cc110';
    const batchNo = '03';

    console.log('=== DEBUGGING BATCH 03 ===');
    console.log('Batch ID:', batchId);
    console.log('Batch Number:', batchNo);
    console.log('Company ID:', companyId);

    // 1. Find the specific batch
    const batch = await Batch.findById(batchId);
    console.log('Batch found:', batch ? {
      id: batch._id,
      batchNo: batch.batchNo,
      companyId: batch.companyId,
      totalSalePrice: batch.totalSalePrice,
      totalCost: batch.totalCost
    } : 'null');

    if (!batch) {
      return NextResponse.json({
        success: false,
        error: 'Batch not found'
      });
    }

    // 2. Find all cars in this batch
    const cars = await Car.find({ 
      companyId: batch.companyId,
      batchNo: batch.batchNo 
    });

    console.log('Cars in batch:', cars.length);
    console.log('Car details:', cars.map(car => ({
      id: car._id,
      carName: car.carName,
      chasisNumber: car.chasisNumber,
      company: car.company
    })));

    if (cars.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          batch: batch,
          cars: [],
          customers: [],
          totalSalePrice: 0,
          message: 'No cars found in batch'
        }
      });
    }

    // 3. Get chassis numbers of all cars in the batch
    const chassisNumbers = cars.map(car => car.chasisNumber);
    console.log('Chassis numbers from cars:', chassisNumbers);

    // 4. Find customers for these cars (by chassis number)
    const customers = await Customer.find({
      companyId: batch.companyId,
      'vehicle.chassisNumber': { $in: chassisNumbers }
    });

    console.log('Customers found for chassis numbers:', customers.length);
    console.log('Customer details:', customers.map(customer => ({
      id: customer._id,
      name: customer.customer.name,
      chassisNumber: customer.vehicle.chassisNumber,
      salePrice: customer.sale.salePrice,
      saleDate: customer.sale.saleDate
    })));

    // 5. Also check if there are customers with chasisNumber (1 s) instead of chassisNumber (2 s)
    const customersAlt = await Customer.find({
      companyId: batch.companyId,
      'vehicle.chasisNumber': { $in: chassisNumbers }
    });

    console.log('Customers found with chasisNumber (1 s):', customersAlt.length);

    // 6. Check all customers for this company to see what chassis numbers exist
    const allCustomers = await Customer.find({ companyId }).select('vehicle.chassisNumber customer.name sale.salePrice');
    console.log('All customers in company:', allCustomers.map(c => ({
      name: c.customer.name,
      chassisNumber: c.vehicle.chassisNumber,
      salePrice: c.sale.salePrice
    })));

    // 7. Calculate total sale price
    const totalSalePrice = customers.reduce((total, customer) => {
      return total + (customer.sale.salePrice || 0);
    }, 0);

    console.log('Total sale price calculated:', totalSalePrice);

    return NextResponse.json({
      success: true,
      data: {
        batch: {
          id: batch._id,
          batchNo: batch.batchNo,
          companyId: batch.companyId,
          totalSalePrice: batch.totalSalePrice,
          totalCost: batch.totalCost
        },
        cars: cars.map(car => ({
          id: car._id,
          carName: car.carName,
          chasisNumber: car.chasisNumber,
          company: car.company
        })),
        customers: customers.map(customer => ({
          id: customer._id,
          name: customer.customer.name,
          chassisNumber: customer.vehicle.chassisNumber,
          salePrice: customer.sale.salePrice,
          saleDate: customer.sale.saleDate
        })),
        customersAlt: customersAlt.map(customer => ({
          id: customer._id,
          name: customer.customer.name,
          chasisNumber: customer.vehicle.chasisNumber,
          salePrice: customer.sale.salePrice
        })),
        allCustomers: allCustomers.map(c => ({
          name: c.customer.name,
          chassisNumber: c.vehicle.chassisNumber,
          salePrice: c.sale.salePrice
        })),
        totalSalePrice,
        chassisNumbers
      }
    });

  } catch (error: any) {
    console.error('Error debugging batch 03:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

