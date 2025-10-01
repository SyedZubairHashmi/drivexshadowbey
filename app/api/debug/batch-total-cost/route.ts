import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Batch from '@/lib/models/Batch';
import Car from '@/lib/models/Car';

// POST /api/debug/batch-total-cost - Debug batch total cost calculation
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
      currentTotalCost: batch.totalCost 
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
      company: car.company,
      model: car.carName,
      financing: car.financing ? 'Present' : 'Missing'
    })));

    if (cars.length === 0) {
      return NextResponse.json({
        success: true,
        data: { 
          batch: batch,
          cars: [],
          totalCost: 0,
          message: 'No cars found in batch'
        }
      });
    }

    // Calculate total cost using the same logic as the virtual field
    const totalCost = cars.reduce((total, car) => {
      const f = car.financing;
      if (!f) {
        console.log(`Car ${car._id} has no financing data`);
        return total;
      }
      
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
      
      console.log(`Car ${car._id} total cost: ${carTotalCost}`);
      return total + carTotalCost;
    }, 0);

    console.log('Total cost calculated:', totalCost);

    // Update batch with calculated total cost
    const updatedBatch = await Batch.findByIdAndUpdate(
      batchId,
      { totalCost },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        batch: {
          id: batch._id,
          batchNo: batch.batchNo,
          companyId: batch.companyId,
          oldTotalCost: batch.totalCost,
          newTotalCost: totalCost
        },
        cars: cars.map(car => {
          const f = car.financing;
          const carTotalCost = f ? (
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
          ) : 0;
          
          return {
            id: car._id,
            chasisNumber: car.chasisNumber,
            company: car.company,
            model: car.carName,
            totalCost: carTotalCost,
            hasFinancing: !!f
          };
        }),
        totalCost,
        carsCount: cars.length,
        updatedBatch: updatedBatch
      },
      message: 'Batch total cost debug completed'
    });

  } catch (error: any) {
    console.error('Error in batch total cost debug:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}











