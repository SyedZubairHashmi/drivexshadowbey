import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';

// POST /api/batches/[id]/calculate-total-cost - Calculate and update batch total cost
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
        data: { totalCost: 0 },
        message: 'No cars found in batch'
      });
    }

    // Calculate total cost using the same logic as the virtual field
    const totalCost = cars.reduce((total, car) => {
      const f = car.financing;
      if (!f) return total;
      
      const carTotalCost = (
        (f.auctionPrice?.totalAmount || 0) +
        (f.auctionExpenses?.totalAmount || 0) +
        (f.inlandCharges?.totalAmount || 0) +
        (f.loadingCharges?.totalAmount || 0) +
        (f.containerCharges?.totalAmount || 0) +
        (f.freightSea?.totalAmount || 0) +
        (f.variantDuty || 0) +
        (f.passportCharges || 0) +
        (f.servicesCharges || 0) +
        (f.transportCharges || 0) +
        (f.repairCharges || 0) +
        (f.miscellaneousCharges || 0) +
        (f.vehicleValueCif || 0) +
        (f.landingCharges || 0) +
        (f.customsDuty || 0) +
        (f.salesTax || 0) +
        (f.federalExciseDuty || 0) +
        (f.incomeTax || 0) +
        (f.freightAndStorageCharges || 0) +
        (f.demurrage || 0) +
        (f.ageOfVehicle || 0)
      );
      
      return total + carTotalCost;
    }, 0);

    // Update batch total cost
    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { totalCost },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        totalCost,
        carsCount: cars.length,
        batch: updatedBatch
      },
      message: 'Batch total cost calculated and updated successfully'
    });

  } catch (error: any) {
    console.error('Error calculating batch total cost:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

