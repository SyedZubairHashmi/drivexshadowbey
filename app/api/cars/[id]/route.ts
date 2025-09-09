import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Car } from '@/lib/models';
import { UpdateCarInput } from '@/lib/models/types';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// GET /api/cars/[id] - Get a specific car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const car = await Car.findOne({ _id: params.id, companyId }).lean();

    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: car
    });

  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch car' },
      { status: 500 }
    );
  }
}

// PUT /api/cars/[id] - Update a specific car
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const body: UpdateCarInput = await request.json();
    
    // Check if car exists and belongs to the company
    const existingCar = await Car.findOne({ _id: params.id, companyId });
    if (!existingCar) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Validate images if provided
    // if (body.images?.carPictures && body.images.carPictures.length < 4) {
    //   return NextResponse.json(
    //     { success: false, error: 'At least 4 car pictures are required' },
    //     { status: 400 }
    //   );
    // }

    // Handle batch number change
    if (body.batchNo && body.batchNo !== existingCar.batchNo) {
      const Batch = (await import('@/lib/models')).Batch;
      
      // Check if new batch exists and belongs to the company
      const newBatch = await Batch.findOne({ batchNo: body.batchNo, companyId });
      if (!newBatch) {
        return NextResponse.json(
          { success: false, error: `Batch with number "${body.batchNo}" not found for your company. Please create the batch first.` },
          { status: 404 }
        );
      }

      // Remove car from old batch
      await Batch.updateMany(
        { cars: params.id },
        { $pull: { cars: params.id } }
      );

      // Add car to new batch
      await Batch.findByIdAndUpdate(
        newBatch._id,
        { $push: { cars: params.id } }
      );
    }

    // Update car
    const updatedCar = await Car.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedCar,
      message: 'Car updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating car:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Car with this engine number or chassis number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update car' },
      { status: 500 }
    );
  }
}

// DELETE /api/cars/[id] - Delete a specific car
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Check if car exists and belongs to the company
    const car = await Car.findOne({ _id: params.id, companyId });
    if (!car) {
      return NextResponse.json(
        { success: false, error: 'Car not found' },
        { status: 404 }
      );
    }

    // Remove car from batch's cars array
    const Batch = (await import('@/lib/models')).Batch;
    await Batch.updateMany(
      { cars: params.id },
      { $pull: { cars: params.id } }
    );

    // Delete car
    await Car.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Car deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete car' },
      { status: 500 }
    );
  }
}
