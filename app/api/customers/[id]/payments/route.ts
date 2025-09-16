import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Customer from '@/lib/models/Customer';
import { getCompanyIdFromRequest } from '@/lib/auth-utils';

// POST /api/customers/[id]/payments - Add a new payment installment
export async function POST(
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

    // Validate payment status
    const validPaymentStatuses = ['Completed', 'Pending', 'Failed'];
    if (body.status && !validPaymentStatuses.includes(body.status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment status' },
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

    // Check if payment amount doesn't exceed remaining balance
    const currentRemaining = customer.sale.remainingAmount || 0;
    const paymentAmount = Number(body.amountPaid);
    
    if (paymentAmount > currentRemaining) {
      return NextResponse.json(
        { success: false, error: 'Payment amount cannot exceed remaining balance' },
        { status: 400 }
      );
    }

    // Calculate payment tracking fields
    const currentTotalPaid = customer.sale.paidAmount || 0;
    const newTotalPaid = currentTotalPaid + paymentAmount;
    const salePrice = customer.sale.salePrice || 0;
    const newRemainingAmount = salePrice - newTotalPaid;
    const installmentNumber = (customer.payments?.length || 0) + 1;

    // Create new payment object
    const newPayment = {
      paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
      amountPaid: paymentAmount,
      remainingAfterPayment: newRemainingAmount,
      totalPaidUpToDate: newTotalPaid,
      installmentNumber: installmentNumber,
      paymentMethod: {
        type: body.paymentMethod.type,
        details: body.paymentMethod.details || {}
      },
      status: body.status || 'Completed',
      note: body.note || ''
    };

    // Add payment to the payments array
    const updatedCustomer = await Customer.findByIdAndUpdate(
      params.id,
      { $push: { payments: newPayment } },
      { new: true, runValidators: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { success: false, error: 'Failed to add payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'Payment added successfully'
    });

  } catch (error: any) {
    console.error('Error adding payment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Failed to add payment: ${error.message}` },
      { status: 500 }
    );
  }
}

// GET /api/customers/[id]/payments - Get all payments for a customer
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
    
    const customer = await Customer.findOne({ _id: params.id, companyId }).select('payments').lean();
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer.payments || []
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}