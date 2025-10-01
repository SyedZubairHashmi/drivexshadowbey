import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Batch } from '@/lib/models';
import { CreateBatchInput } from '@/lib/models/types';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get company ID from authentication
    const companyId = getCompanyIdFromRequest(request);
    console.log('Batches API: Company ID from auth:', companyId);
    
    if (!companyId) {
      console.log('Batches API: No company ID found');
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const batchNo = searchParams.get('batchNo');
    const countryOfOrigin = searchParams.get('countryOfOrigin');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build filter object - always filter by companyId for multi-tenant isolation
    const filter: any = { companyId };
    
    if (batchNo) {
      filter.batchNo = batchNo;
    }
    
    if (countryOfOrigin) {
      filter.countryOfOrigin = { $regex: countryOfOrigin, $options: 'i' };
    }

    // Execute query with pagination
    const batches = await Batch.find(filter)
      .populate('investors', 'name emailAddress investorId investAmount percentageShare amountPaid remainingAmount')
      .populate('cars', 'carName company status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Batch.countDocuments(filter);
    
    console.log('Batches API: Found', batches.length, 'batches for company:', companyId);
    console.log('Batches API: Filter used:', filter);

    return NextResponse.json({
      success: true,
      data: batches,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching batches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch batches' },
      { status: 500 }
    );
  }
}

// POST /api/batches - Create a new batch
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
    
    const body: CreateBatchInput = await request.json();
    
    console.log('Received batch data:', JSON.stringify(body, null, 2));
    
    // Basic validation - only check required fields
    if (!body.batchNo || !body.countryOfOrigin || !body.flagImage) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: batchNo, countryOfOrigin, flagImage' },
        { status: 400 }
      );
    }

    console.log('Validation passed, creating batch...');

    // Check if batch number already exists for this company
    const existingBatch = await Batch.findOne({ batchNo: body.batchNo, companyId });
    if (existingBatch) {
      return NextResponse.json(
        { success: false, error: 'Batch with this number already exists for your company' },
        { status: 409 }
      );
    }

    // Create new batch with explicit data mapping
    const batchData = {
      companyId,
      batchNo: body.batchNo,
      countryOfOrigin: body.countryOfOrigin,
      flagImage: body.flagImage,
      investors: body.investors || [],
      cars: body.cars || [],
      notes: body.notes || ""
    };

    console.log('Creating batch with data:', JSON.stringify(batchData, null, 2));
    
    const batch = new Batch(batchData);
    console.log('Batch instance created, saving...');
    
    const savedBatch = await batch.save({ validateBeforeSave: true });
    console.log('Batch saved successfully:', savedBatch._id);
    
    // Populate the saved batch
    await savedBatch.populate('investors', 'name emailAddress investorId');
    await savedBatch.populate('cars', 'carName company status');

    return NextResponse.json({
      success: true,
      data: savedBatch,
      message: 'Batch created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating batch:', error);
    
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
        { success: false, error: 'Batch with this number already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to create batch: ${error.message}` },
      { status: 500 }
    );
  }
}
