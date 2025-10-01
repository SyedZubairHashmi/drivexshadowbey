import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const authCookie = cookieStore.get('auth');
    if (!authCookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    try {
      const auth = JSON.parse(authCookie.value || '{}');
      if (!auth || !auth._id || !auth.role) {
        return NextResponse.json({ authenticated: false }, { status: 200 });
      }
      return NextResponse.json({ authenticated: true, auth }, { status: 200 });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}




