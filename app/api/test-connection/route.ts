import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Test MongoDB connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB coection successful',
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





