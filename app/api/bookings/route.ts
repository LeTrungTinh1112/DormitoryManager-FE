
import { NextRequest, NextResponse } from 'next/server';
import { getBookings, addBooking, getCurrentUser, updateBookingStatus, addNotification } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const allBookings = await getBookings();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If manager, return all bookings
  if (currentUser.roles.includes('manager')) {
    return NextResponse.json({ data: allBookings });
  }

  // If resident/student, filter by email
  // Note: Booking has email field
  const userBookings = allBookings.filter(b => b.email === currentUser.email);
  
  return NextResponse.json({ data: userBookings });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.fullName || !body.phone || !body.roomType) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    const newBooking = await addBooking(body);
    
    return NextResponse.json({ 
      success: true, 
      data: newBooking,
      message: 'Đăng ký thành công' 
    }, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Lỗi xử lý đăng ký' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updated = await updateBookingStatus(id, status);
    
    if (updated) {
       if (updated.status === 'confirmed' || updated.status === 'completed' || updated.status === 'cancelled') {
           const titleMap: Record<string, string> = {
               'confirmed': 'Lịch xem phòng đã được xác nhận',
               'completed': 'Hoàn tất thủ tục xem phòng',
               'cancelled': 'Lịch xem phòng đã bị hủy'
           };
           await addNotification({
               userId: 'resident', // Target the main demo user
               title: titleMap[updated.status] || 'Cập nhật trạng thái đặt lịch',
               description: `Lịch hẹn xem phòng ${updated.roomName} của bạn đã chuyển sang trạng thái: ${updated.status}`,
               type: 'booking'
           });
       }
       return NextResponse.json({ success: true, data: updated });
    }
    
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  } catch (error) {
     return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
