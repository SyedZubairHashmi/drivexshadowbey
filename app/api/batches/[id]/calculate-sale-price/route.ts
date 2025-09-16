import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';
import Customer from '@/lib/models/Customer';

// POST /api/batches/[id]/calculate-sale-price - Calculate and update batch total sale price
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    // Find batch by ID
    const batch = await Batch.findById(id);
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

    if (cars.length === 0) {
      return NextResponse.json({
        success: true,
        data: { totalSalePrice: 0 },
        message: 'No cars found in batch'
      });
    }

    // Get chassis numbers of all cars in the batch
    const chassisNumbers = cars.map(car => car.chasisNumber);
    console.log('Cars in batch:', cars.length);
    console.log('Chassis numbers from cars:', chassisNumbers);

    // Find customers for these cars (by chassis number)
    // Note: Car model uses 'chasisNumber' (1 s), Customer model uses 'chassisNumber' (2 s)
    // We need to check both field names to handle the mismatch
    const customers = await Customer.find({
      companyId: batch.companyId,
      $or: [
        { 'vehicle.chassisNumber': { $in: chassisNumbers } },
        { 'vehicle.chasisNumber': { $in: chassisNumbers } }
      ]
    });

    console.log('Customers found for chassis numbers:', customers.length);
    console.log('Customer chassis numbers:', customers.map(c => c.vehicle.chassisNumber));
    console.log('Customer sale prices:', customers.map(c => c.sale.salePrice));

    // Calculate total sale price
    const totalSalePrice = customers.reduce((total, customer) => {
      return total + (customer.sale.salePrice || 0);
    }, 0);

    console.log('Total sale price calculated:', totalSalePrice);

    // Update batch total sale price
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { totalSalePrice },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        totalSalePrice,
        carsCount: cars.length,
        customersCount: customers.length,
        batch: updatedBatch
      },
      message: 'Batch total sale price calculated and updated successfully'
    });

  } catch (error: any) {
    console.error('Error calculating batch total sale price:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
