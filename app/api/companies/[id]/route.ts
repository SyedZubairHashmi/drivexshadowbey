import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company } from '@/lib/models';

// GET /api/companies/[id] - Get a specific company by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const company = await Company.findById(params.id).lean();
    
    if (!company) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company not found' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: company
    });

  } catch (error: any) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch company',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT /api/companies/[id] - Update a company
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Get fields from body
    const { ownerName, companyName, companyEmail, password, pin, recoveryEmail, image } = body;
    
    // Check if company exists first
    const existingCompany = await Company.findById(params.id);
    if (!existingCompany) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company not found' 
        },
        { status: 404 }
      );
    }

    // Check if another company with same email already exists (only if email is being updated)
    if (companyEmail && companyEmail !== existingCompany.companyEmail) {
      const duplicateCompany = await Company.findOne({ 
        companyEmail, 
        _id: { $ne: params.id } 
      });
      if (duplicateCompany) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Company with this email already exists' 
          },
          { status: 409 }
        );
      }
    }

    // Prepare update data - only include fields that are provided
    const updateData: any = {};

    // Add fields only if they are provided in the request
    if (ownerName !== undefined) {
      updateData.ownerName = ownerName;
    }
    if (companyName !== undefined) {
      updateData.companyName = companyName;
    }
    if (companyEmail !== undefined) {
      updateData.companyEmail = companyEmail;
    }
    if (password !== undefined) {
      updateData.password = password;
    }
    if (pin !== undefined) {
      updateData.pin = pin;
    }
    if (recoveryEmail !== undefined) {
      updateData.recoveryEmail = recoveryEmail;
    }
    if (image !== undefined) {
      updateData.image = image;
    }
    if (body.status !== undefined) {
      updateData.status = body.status;
    }

    // Update company
    const updatedCompany = await Company.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedCompany,
      message: 'Company updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating company:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update company',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/companies/[id] - Delete a company
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const company = await Company.findById(params.id);
    
    if (!company) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company not found' 
        },
        { status: 404 }
      );
    }

    await Company.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete company',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
