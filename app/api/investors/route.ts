import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Investor from '@/lib/models/Investor';

// POST /api/investors - Create a new investor
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    console.log('Received investor data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'name', 'contactNumber', 'emailAddress', 'investorId',
      'investAmount', 'percentageShare', 'amountPaid',
      'paymentMethod'
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment method
    const validPaymentMethods = ['Cash', 'Bank', 'Cheque', 'BankDeposit'];
    if (!validPaymentMethods.includes(body.paymentMethod.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method type' },
        { status: 400 }
      );
    }

    // Validate payment method details based on type
    if (body.paymentMethod.type === 'Bank') {
      if (!body.paymentMethod.details?.bankName || !body.paymentMethod.details?.accountNo) {
        return NextResponse.json(
          { success: false, error: 'Bank payment method requires bankName and accountNo' },
          { status: 400 }
        );
      }
    }

    if (body.paymentMethod.type === 'Cheque') {
      if (!body.paymentMethod.details?.chequeNo) {
        return NextResponse.json(
          { success: false, error: 'Cheque payment method requires chequeNo' },
          { status: 400 }
        );
      }
    }

    if (body.paymentMethod.type === 'BankDeposit') {
      if (!body.paymentMethod.details?.slipNo) {
        return NextResponse.json(
          { success: false, error: 'Bank deposit payment method requires slipNo' },
          { status: 400 }
        );
      }
    }

    // For Cash payment method, no additional validation needed

    // Validate numeric fields
    const numericFields = ['investAmount', 'percentageShare', 'amountPaid'];
    for (const field of numericFields) {
      if (isNaN(Number(body[field])) || Number(body[field]) < 0) {
        return NextResponse.json(
          { success: false, error: `${field} must be a valid positive number` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.emailAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if investor with same email or ID already exists
    const existingInvestor = await Investor.findOne({
      $or: [
        { emailAddress: body.emailAddress },
        { investorId: body.investorId }
      ]
    });

    if (existingInvestor) {
      return NextResponse.json(
        { success: false, error: 'Investor with this email or ID already exists' },
        { status: 409 }
      );
    }

    // Find the batch by batch number and add investor to it
    const Batch = (await import('@/lib/models')).Batch;
    const existingBatch = await Batch.findOne({ batchNo: body.batchNo });
    
    if (!existingBatch) {
      return NextResponse.json(
        { success: false, error: `Batch with number "${body.batchNo}" not found. Please create the batch first.` },
        { status: 404 }
      );
    }

    // Create new investor
    const investor = new Investor({
      name: body.name,
      contactNumber: body.contactNumber,
      emailAddress: body.emailAddress,
      investorId: body.investorId,
      investAmount: Number(body.investAmount),
      percentageShare: Number(body.percentageShare),
      amountPaid: Number(body.amountPaid),
      // remainingAmount will be calculated automatically
      paymentDate: body.paymentDate || new Date(),
      batchNo: body.batchNo,
      paymentMethod: {
        type: body.paymentMethod.type,
        details: body.paymentMethod.details || {}
      }
    });

    const savedInvestor = await investor.save();

    // Add the investor to the batch's investors array
    await Batch.findByIdAndUpdate(
      existingBatch._id,
      { $push: { investors: savedInvestor._id } }
    );

    console.log(`Investor ${savedInvestor._id} added to batch ${existingBatch.batchNo}`);

    return NextResponse.json({
      success: true,
      data: savedInvestor,
      message: 'Investor created successfully'
    });

  } catch (error) {
    console.error('Error creating investor:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create investor' },
      { status: 500 }
    );
  }
}

// GET /api/investors - Get all investors with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const batchNo = searchParams.get('batchNo');
    const email = searchParams.get('email');
    const search = searchParams.get('search');
    const name = searchParams.get('name'); // Add name-specific search parameter
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    console.log('API received params:', { batchNo, email, search, name, limit, page });

    // Build filter object
    const filter: any = {};
    
    if (batchNo) {
      filter.batchNo = batchNo;
      console.log('Added batchNo filter:', batchNo);
    }
    
    if (email) {
      filter.emailAddress = { $regex: email, $options: 'i' };
    }

    if (name) {
      // Name-specific search (only searches by name)
      filter.name = { $regex: name, $options: 'i' };
    } else if (search) {
      // General search (searches across multiple fields)
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { investorId: { $regex: search, $options: 'i' } },
        { contactNumber: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Final filter object:', JSON.stringify(filter, null, 2));

    // Execute query with pagination
    const investors = await Investor.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    console.log('Query result count:', investors.length);
    if (investors.length > 0) {
      console.log('First investor batchNo:', investors[0].batchNo);
    }

    // Get total count for pagination
    const total = await Investor.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: investors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching investors:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investors' },
      { status: 500 }
    );
  }
}
