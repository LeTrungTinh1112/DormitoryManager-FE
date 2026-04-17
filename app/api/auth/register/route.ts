
import { NextRequest, NextResponse } from 'next/server';
import { User, getUsers, addUser, findUserByEmail } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, confirmPassword, gender, school } = body;

    if (!fullName || !email || !password || !phone) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Mật khẩu xác nhận không khớp' },
        { status: 400 }
      );
    }

    // Initialize mock db array if not done yet
    getUsers();

    const existingUser = findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: `USER_${Date.now()}`,
      name: fullName,
      email,
      phone,
      password: password, // Store plain text for demo only!
      gender: gender as any || 'other',
      school: school || 'N/A',
      roles: ['student'], // Mới đăng ký chỉ là student, chưa thuê phòng thì chưa là resident
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
      accountStatus: 'active',
      joinDate: new Date().toISOString(),
      studentId: `SV${Math.floor(Math.random() * 10000)}`, // Generate random student ID
      address: 'Chưa cập nhật',
      major: 'Chưa cập nhật',
      birthDate: 'Chưa cập nhật' // Adding missing property
    };
    
    // Add to global store
    addUser(newUser);

    return NextResponse.json({ 
      success: true, 
      message: 'Đăng ký thành công',
      user: { ...newUser, password: undefined } // Don't return password
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
        { error: 'Lỗi xử lý đăng ký' },
        { status: 500 }
    );
  }
}
