
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


    const allUsers = getUsers();


    const normalizedEmail = email.trim().toLowerCase();


    const user = allUsers.find(u =>
      u.email.toLowerCase() === normalizedEmail &&
      u.password === password
    );

    if (user) {
      loginUser(user);
      const userResponse = { ...user };
      // @ts-ignore
      delete userResponse.password;

      const token = `mock_token_${user.id}_${Date.now()}`;
      const response = NextResponse.json({
        token: token,
        user: userResponse
      });

      // Set cookie that the middleware uses
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: false, // false is useful if client needs to read it
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return response;
    }

    return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác' }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: 'Đã xảy ra lỗi' }, { status: 500 });
  }
}
