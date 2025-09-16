import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// PUT /api/customers/[id]/payments/[paymentId] - Update a specific payment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; paymentId: string } }
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
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.amountPaid || isNaN(Number(body.amountPaid)) || Number(body.amountPaid) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid payment amount is required' },
        { status: 400 }
      );
    }

    if (!body.paymentMethod?.type) {
      return NextResponse.json(
        { success: false, error: 'Payment method type is required' },
        { status: 400 }
      );
    }

    // Validate payment method type
    const validPaymentMethods = ['Cash', 'Bank', 'Cheque', 'BankDeposit'];
    if (!validPaymentMethods.includes(body.paymentMethod.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment method type' },
        { status: 400 }
      );
    }

    // Find the customer
    const customer = await Customer.findOne({ _id: params.id, companyId });
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Find the specific payment
    const paymentIndex = customer.payments.findIndex(
      (payment: any) => payment._id?.toString() === params.paymentId
    );

    if (paymentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Update the payment
    customer.payments[paymentIndex].amountPaid = Number(body.amountPaid);
    customer.payments[paymentIndex].paymentMethod = {
      type: body.paymentMethod.type,
      details: body.paymentMethod.details || {}
    };

    // Save the customer (this will trigger the middleware to recalculate totals)
    const updatedCustomer = await customer.save();

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'Payment updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating payment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to update payment: ${error.message}` },
      { status: 500 }
    );
  }
}



