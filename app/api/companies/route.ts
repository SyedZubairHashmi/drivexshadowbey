import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company } from '@/lib/models';

// GET /api/companies - Get all companies with optional filters
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { ownerName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { companyEmail: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status && (status === 'active' || status === 'inactive')) {
      query.status = status;
    }

    // Get companies with pagination
    const companies = await Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Company.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: companies,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch companies',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create a new company
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields for multi-tenant platform
    const { ownerName, companyName, companyEmail, password, role } = body;
    
    if (!ownerName || !companyName || !companyEmail || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: ownerName, companyName, companyEmail, password' 
        },
        { status: 400 }
      );
    }

    // Check if company with same email already exists
    const existingCompany = await Company.findOne({ companyEmail });
    if (existingCompany) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Create new company for multi-tenant platform
    const companyData = {
      ownerName,
      companyName,
      companyEmail,
      password,
      role: role || 'company', // Default role is 'company'
      status: body.status || 'active',
      pin: body.pin || '123456', // Default PIN
      recoveryEmail: body.recoveryEmail || companyEmail // Use company email as recovery email
    };

    const company = new Company(companyData);
    await company.save();

    return NextResponse.json({
      success: true,
      data: company,
      message: 'Company created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create company',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
