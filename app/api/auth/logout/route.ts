
import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function POST() {
    logoutUser();
    
    const response = NextResponse.json({ success: true });
    
    // Xóa cookie auth_token bằng cách đặt maxAge về 0
    response.cookies.set({
      name: 'auth_token',
      value: '',
      httpOnly: false,
      path: '/',
      maxAge: 0,
    });

    return response;
}
