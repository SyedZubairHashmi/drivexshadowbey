import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';

// GET /api/customers/[id] - Get a specific customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const customer = await Customer.findById(params.id).lean();
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer
    });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT /api/customers/[id] - Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'vehicle.companyName', 'vehicle.model', 'vehicle.chassisNumber',
      'customer.name', 'customer.phoneNumber',
      'sale.salePrice', 'sale.paymentMethod.type'
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

    // Validate payment method type
    const validPaymentMethods = ['Cash', 'Bank', 'Cheque', 'BankDeposit'];
    if (!validPaymentMethods.includes(body.sale.paymentMethod.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method type' },
        { status: 400 }
      );
    }

    // Validate payment status
    const validPaymentStatuses = ['Completed', 'Pending', 'inprogress'];
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

    // Check if chassis number already exists in another customer
    const existingCustomer = await Customer.findOne({ 
      'vehicle.chassisNumber': body.vehicle.chassisNumber,
      _id: { $ne: params.id }
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this chassis number already exists' },
        { status: 409 }
      );
    }

    // Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      params.id,
      {
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
          paymentMethod: {
            type: body.sale.paymentMethod.type,
            details: body.sale.paymentMethod.details || {},
          },
          paymentStatus: body.sale.paymentStatus || 'Pending',
          note: body.sale.note,
          document: body.sale.document,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating customer:', error);
    
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
      { success: false, error: `Failed to update customer: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/[id] - Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const deletedCustomer = await Customer.findByIdAndDelete(params.id);
    
    if (!deletedCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
