import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Car } from '@/lib/models';
import { CreateCarInput } from '@/lib/models/types';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// Helper function to save uploaded files
async function saveUploadedFile(file: File, folder: string): Promise<string> {
  if (!file) return '';
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadsDir, { recursive: true });
  
  // Generate unique filename
  const timestamp = Date.now();
  const originalName = file.name;
  const extension = path.extname(originalName);
  const filename = `${timestamp}_${originalName}`;
  
  // Save file
  const filePath = path.join(uploadsDir, filename);
  await writeFile(filePath, buffer);
  
  // Return public URL
  return `/uploads/${folder}/${filename}`;
}

// GET /api/cars - Get all cars with optional filtering
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
    
    const { searchParams } = new URL(request.url);
    const batchNo = searchParams.get('batchNo');
    const status = searchParams.get('status');
    const company = searchParams.get('company');
    const auctionGrade = searchParams.get('auctionGrade');
    const isFeatured = searchParams.get('isFeatured');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build filter object - always filter by companyId for multi-tenant isolation
    const filter: any = { companyId };
    
    if (batchNo) {
      filter.batchNo = batchNo;
    }
    
    if (status) {
      // Handle new status values
      const validStatuses = ['sold', 'transit', 'warehouse', 'showroom'];
      if (validStatuses.includes(status)) {
        filter.status = status;
      }
    }
    
    if (company) {
      filter.company = { $regex: company, $options: 'i' };
    }
    
    if (auctionGrade) {
      filter.auctionGrade = parseInt(auctionGrade);
    }
    
    if (isFeatured !== null) {
      filter.isFeatured = isFeatured === 'true';
    }

    // Execute query with pagination
    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Car.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cars' },
      { status: 500 }
    );
  }
}

// POST /api/cars - Create a new car
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
    
    let body: CreateCarInput;
    let coverPhoto: File | null = null;
    let invoiceReceipt: File | null = null;
    let auctionSheet: File | null = null;
    let carPictures: File[] = [];

    // Check content type to determine how to parse the request
    const contentType = request.headers.get("content-type") || "";
    
    if (contentType.includes("application/json")) {
      // Handle JSON request
      body = await request.json();

      console.log("🚀 UI Sent Data (JSON):", JSON.stringify(body, null, 2));
  
      // Check specifically for financeTotalAmount
      console.log("👉 financeTotalAmount at top level:", body.financeTotalAmount);
      console.log("👉 financeTotalAmount inside financing:", body.financing?.financeTotalAmount);
      
      // Initialize images object for JSON requests
      body.images = {
        coverPhoto: undefined,
        invoiceReceipt: undefined,
        auctionSheet: undefined,
        carPictures: []
      };
    } else if (contentType.includes("multipart/form-data")) {
      // Handle FormData request
      const formData = await request.formData();
      
      // Extract JSON data
      const carDataJson = formData.get('carData') as string;
      if (!carDataJson) {
        return NextResponse.json(
          { success: false, error: 'Missing carData in FormData' },
          { status: 400 }
        );
      }
      
      body = JSON.parse(carDataJson);
      
      // Extract file data (all optional)
      coverPhoto = formData.get('coverPhoto') as File | null;
      invoiceReceipt = formData.get('invoiceReceipt') as File | null;
      auctionSheet = formData.get('auctionSheet') as File | null;
      carPictures = formData.getAll('carPictures').filter(f => f instanceof File) as File[];
      
      console.log('Received car data:', JSON.stringify(body, null, 2));
      console.log('Files received:', {
        coverPhoto: coverPhoto?.name || 'not provided',
        invoiceReceipt: invoiceReceipt?.name || 'not provided',
        auctionSheet: auctionSheet?.name || 'not provided',
        carPictures: carPictures.map(f => f.name)
      });

      // Save uploaded files only if they exist
      const coverPhotoPath = coverPhoto ? await saveUploadedFile(coverPhoto, 'cover-photos') : undefined;
      const invoiceReceiptPath = invoiceReceipt ? await saveUploadedFile(invoiceReceipt, 'invoices') : undefined;
      const auctionSheetPath = auctionSheet ? await saveUploadedFile(auctionSheet, 'auction-sheets') : undefined;
      
      const carPicturesPaths = carPictures.length > 0
        ? await Promise.all(carPictures.map(file => saveUploadedFile(file, 'car-pictures')))
        : [];
      
      // Update body with file paths (all optional)
      body.images = {
        coverPhoto: coverPhotoPath,
        invoiceReceipt: invoiceReceiptPath,
        auctionSheet: auctionSheetPath,
        carPictures: carPicturesPaths
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported content type. Use application/json or multipart/form-data' },
        { status: 400 }
      );
    }
    
    // Validate required fields (excluding images since they're optional)
    const requiredFields = [
      'carName', 'company', 'carSegment', 'engineNumber', 'chasisNumber', 
      'auctionGrade', 'importYear', 'manufacturingYear', 'assembly', 'engineCapacity', 'engineType',
      'interiorColor', 'mileage', 'exteriorColor',
      'batchNo', 'description', 'financing'
    ];
    
    for (const field of requiredFields) {
      if (!body[field as keyof CreateCarInput]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate financing fields
    const simpleFinancingFields = [
      'originCity', 'destinationCity', 'variantDuty', 'passportCharges', 
      'servicesCharges', 'transportCharges', 'repairCharges', 'miscellaneousCharges',
      'vehicleValueCif', 'landingCharges', 'customsDuty', 'salesTax', 
      'federalExciseDuty', 'incomeTax', 'freightAndStorageCharges', 'demurrage', 'ageOfVehicle','financeTotalAmount'
    ];
    
    for (const field of simpleFinancingFields) {
      if (!(field in body.financing)) {
        return NextResponse.json(
          { success: false, error: `Missing required financing field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Additional validation for financeTotalAmount
    if (typeof body.financing.financeTotalAmount !== 'number' || body.financing.financeTotalAmount < 0) {
      return NextResponse.json(
        { success: false, error: 'financeTotalAmount must be a valid non-negative number' },
        { status: 400 }
      );
    }

    // Validate complex financing fields (objects with amount, currency, rate, totalAmount)
    const complexFinancingFields = [
      'auctionPrice', 'auctionExpenses', 'inlandCharges', 'loadingCharges', 
      'containerCharges', 'freightSea'
    ];
    
    for (const field of complexFinancingFields) {
      const fieldData = body.financing[field as keyof typeof body.financing];
      if (!fieldData || typeof fieldData !== 'object') {
        return NextResponse.json(
          { success: false, error: `Missing required financing field: ${field}` },
          { status: 400 }
        );
      }
      
      const requiredSubFields = ['amount', 'rate', 'totalAmount'];
      for (const subField of requiredSubFields) {
        if (!(subField in fieldData)) {
          return NextResponse.json(
            { success: false, error: `Missing required sub-field: ${field}.${subField}` },
            { status: 400 }
          );
        }
      }
    }

    // Find the batch by batch number and companyId
    const Batch = (await import('@/lib/models')).Batch;
    const existingBatch = await Batch.findOne({ batchNo: body.batchNo, companyId });
    
    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: `Batch with number "${body.batchNo}" not found for your company. Please create the batch first.` },
        { status: 404 }
      );
    }

    // Add companyId to the car data
    body.companyId = companyId;

    // Create new car
    console.log('Creating car with data:', JSON.stringify(body, null, 2));
    console.log('Finance Total Amount received:', body.financing?.financeTotalAmount);
    const car = new Car(body);
    console.log('Car instance created:', car);
    console.log('Car financing data:', JSON.stringify(car.financing, null, 2));
    
    const savedCar = await car.save();
    console.log('Car saved successfully:', savedCar);
    console.log('Saved car financing data:', JSON.stringify(savedCar.financing, null, 2));

    // Add the car to the batch's cars array
    await Batch.findByIdAndUpdate(
      existingBatch._id,
      { $push: { cars: savedCar._id } }
    );

    console.log(`Car ${savedCar._id} added to batch ${existingBatch.batchNo}`);

    return NextResponse.json({
      success: true,
      data: savedCar,
      message: 'Car created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating car:', error);
    
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
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'chasisNumber') {
        return NextResponse.json(
          { success: false, error: 'A car with this chassis number already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Car with this engine number or chassis number already exists' },
        { status: 409 }
      );
    }

    // Handle cast errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { success: false, error: 'Invalid data format provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to create car: ${error.message}` },
      { status: 500 }
    );
  }
}
