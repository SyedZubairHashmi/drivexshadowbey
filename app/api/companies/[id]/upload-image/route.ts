import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Company } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth-utils';

// POST /api/companies/[id]/upload-image - Upload profile picture
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Check if user is authenticated and authorized
    const user = getUserFromRequest(request);
    if (!user || (user.role !== 'company' && user.role !== 'admin')) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if company exists
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

    // Check if user is authorized to update this company
    if (user.role === 'company' && user._id !== params.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No image file provided' 
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File must be an image' 
        },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File size must be less than 5MB' 
        },
        { status: 400 }
      );
    }

    // Convert file to base64 for storage (in production, you'd upload to cloud storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const imageUrl = `data:${file.type};base64,${base64}`;

    // Update company with new image
    const updatedCompany = await Company.findByIdAndUpdate(
      params.id,
      { image: imageUrl },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        _id: updatedCompany._id,
        image: updatedCompany.image
      },
      message: 'Profile picture updated successfully'
    });

  } catch (error: any) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload profile picture',
        details: error.message 
      },
      { status: 500 }
    );
  }
}








