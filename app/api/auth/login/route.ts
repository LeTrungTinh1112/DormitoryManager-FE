
import { NextRequest, NextResponse } from 'next/server';
import { getUsers, loginUser, User } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' }, 
        { status: 400 }
      );
    }

    // Check against mock database
    const allUsers = getUsers();
    
    // Normalize input
    const normalizedEmail = email.trim().toLowerCase();
    
    // @ts-ignore
    const user = allUsers.find(u => 
      u.email.toLowerCase() === normalizedEmail && 
      u.password === password
    );

    if (user) {
       loginUser(user);
       const userResponse = { ...user };
       // @ts-ignore
       delete userResponse.password;

       return NextResponse.json({
         token: `mock_token_${user.id}_${Date.now()}`,
         user: userResponse
       });
    }

    return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
  }
}
