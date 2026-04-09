import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Lấy token từ cookies
    const token = request.cookies.get('auth_token')?.value;

    // Kiểm tra nếu người dùng đang cố truy cập vào các route bắt đầu bằng /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!token) {
            // Nếu không có token, chuyển hướng về trang đăng nhập
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // Cho phép tiếp tục request nếu đã có token hoặc không nằm trong các route cần bảo vệ
    return NextResponse.next();
}

// Cấu hình các route mà middleware sẽ được áp dụng
export const config = {
    matcher: [
        // Áp dụng cho tất cả các route bắt đầu bằng /dashboard
        '/dashboard/:path*',
    ],
};