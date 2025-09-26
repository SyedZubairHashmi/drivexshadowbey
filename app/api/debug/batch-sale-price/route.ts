import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';

// POST /api/debug/batch-sale-price - Debug batch sale price calculation
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { batchId, companyId } = body;
    
    if (!batchId) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    // Find batch by ID
    const batch = await Batch.findById(batchId);
    console.log('Batch found:', batch ? { 
      id: batch._id, 
      batchNo: batch.batchNo, 
      companyId: batch.companyId,
      currentTotalSalePrice: batch.totalSalePrice 
    } : 'null');

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
    console.log('Cars details:', cars.map(car => ({
      id: car._id,
      chasisNumber: car.chasisNumber,
      status: car.status,
      company: car.company,
      model: car.carName
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

    // Get chassis numbers of all cars in the batch
    const chassisNumbers = cars.map(car => car.chasisNumber);
    console.log('Chassis numbers from cars:', chassisNumbers);

    // Find customers for these cars (by chassis number)
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
      salePrice: customer.sale.salePrice,
      saleDate: customer.sale.saleDate,
      paymentStatus: customer.sale.paymentStatus
    })));

    // Also check all customers for this company to see what exists
    const allCustomers = await Customer.find({ companyId: batch.companyId });
    console.log('All customers in company:', allCustomers.map(c => ({
      name: c.customer.name,
      chassisNumber: c.vehicle.chassisNumber,
      chasisNumber: c.vehicle.chasisNumber,
      salePrice: c.sale.salePrice
    })));

    // Calculate total sale price
    const totalSalePrice = customers.reduce((total, customer) => {
      return total + (customer.sale.salePrice || 0);
    }, 0);

    console.log('Total sale price calculated:', totalSalePrice);

    // Update batch with calculated total sale price
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { totalSalePrice },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        batch: {
          id: batch._id,
          batchNo: batch.batchNo,
          companyId: batch.companyId,
          oldTotalSalePrice: batch.totalSalePrice,
          newTotalSalePrice: totalSalePrice
        },
        cars: cars.map(car => ({
          id: car._id,
          chasisNumber: car.chasisNumber,
          status: car.status,
          company: car.company,
          model: car.carName
        })),
        customers: customers.map(customer => ({
          id: customer._id,
          name: customer.customer.name,
          chassisNumber: customer.vehicle.chassisNumber,
          chasisNumber: customer.vehicle.chasisNumber,
          salePrice: customer.sale.salePrice,
          saleDate: customer.sale.saleDate,
          paymentStatus: customer.sale.paymentStatus
        })),
        totalSalePrice,
        carsCount: cars.length,
        customersCount: customers.length,
        updatedBatch: updatedBatch
      },
      message: 'Batch sale price debug completed'
    });

  } catch (error: any) {
    console.error('Error in batch sale price debug:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


