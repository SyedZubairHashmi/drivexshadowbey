import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

// GET /api/test-connection - Test MongoDB connection
export async function GET(request: NextRequest) {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('MongoDB connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'MongoDB connection failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}





