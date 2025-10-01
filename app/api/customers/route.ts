import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// GET /api/customers - Get all customers with optional filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get company ID from authentication
    const companyId = getCompanyIdFromRequest(request);
    console.log('Customers API: Company ID from auth:', companyId);
    
    if (!companyId) {
      console.log('Customers API: No company ID found');
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Subuser RBAC removed
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const paymentStatus = searchParams.get('paymentStatus');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build filter object - always filter by companyId for multi-tenant isolation
    const filter: any = { companyId };
    
    if (search) {
      filter.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.phoneNumber': { $regex: search, $options: 'i' } },
        { 'vehicle.chassisNumber': { $regex: search, $options: 'i' } },
        { 'vehicle.companyName': { $regex: search, $options: 'i' } },
        { 'vehicle.model': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      filter['sale.paymentStatus'] = paymentStatus;
    }

    // Execute query with pagination
    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Customer.countDocuments(filter);
    
    console.log('Customers API: Found', customers.length, 'customers for company:', companyId);
    console.log('Customers API: Filter used:', filter);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
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

    // Subuser RBAC removed
    
    const body = await request.json();
    
    console.log('Received customer data:', JSON.stringify(body, null, 2));
    console.log('Payments array:', JSON.stringify(body.payments, null, 2));
    
    // Validate required fields
    const requiredFields = [
      'vehicle.companyName', 'vehicle.model', 'vehicle.chassisNumber',
      'customer.name', 'customer.phoneNumber',
      'sale.salePrice'
    ];
    
    for (const field of requiredFields) {
      const value = field.split('.').reduce((obj, key) => obj?.[key], body);
      if (!value) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate payment method type from payments array
    if (body.payments && body.payments.length > 0) {
      const validPaymentMethods = ['Cash', 'Bank', 'Cheque', 'BankDeposit'];
      const firstPayment = body.payments[0];
      if (firstPayment.paymentMethod && !validPaymentMethods.includes(firstPayment.paymentMethod.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid payment method type' },
          { status: 400 }
        );
      }
    }

    // Validate payment status
    const validPaymentStatuses = ['Completed', 'Pending'];
    if (body.sale.paymentStatus && !validPaymentStatuses.includes(body.sale.paymentStatus)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment status' },
        { status: 400 }
      );
    }

    // Validate sale price and paid amount
    if (isNaN(Number(body.sale.salePrice)) || Number(body.sale.salePrice) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Sale price must be a valid positive number' },
        { status: 400 }
      );
    }

    const paidAmount = Number(body.sale.paidAmount) || 0;
    const salePrice = Number(body.sale.salePrice);
    
    if (paidAmount > salePrice) {
      return NextResponse.json(
        { success: false, error: 'Paid amount cannot exceed sale price' },
        { status: 400 }
      );
    }

    // Check if customer with same chassis number already exists for this company
    const existingCustomer = await Customer.findOne({ 
      companyId,
      'vehicle.chassisNumber': body.vehicle.chassisNumber 
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this chassis number already exists for your company' },
        { status: 409 }
      );
    }

    // Create new customer
    const customerData = {
      companyId,
      vehicle: {
        companyName: body.vehicle.companyName,
        model: body.vehicle.model,
        chassisNumber: body.vehicle.chassisNumber,
      },
      customer: {
        name: body.customer.name,
        phoneNumber: body.customer.phoneNumber,
        email: body.customer.email,
        address: body.customer.address,
      },
      sale: {
        saleDate: body.sale.saleDate || new Date(),
        salePrice: salePrice,
        paidAmount: paidAmount,
        paymentStatus: body.sale.paymentStatus || 'Pending',
        note: body.sale.note,
        document: body.sale.document,
      },
      payments: body.payments || [],
    };

    console.log('Customer data to save:', JSON.stringify(customerData, null, 2));
    
    const customer = new Customer(customerData);
    const savedCustomer = await customer.save();

    return NextResponse.json({
      success: true,
      data: savedCustomer,
      message: 'Customer created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating customer:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      console.error('Validation errors:', validationErrors);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'vehicle.chassisNumber') {
        return NextResponse.json(
          { success: false, error: 'Customer with this chassis number already exists' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Duplicate key error', field },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to create customer: ${error.message}` },
      { status: 500 }
    );
  }
}
