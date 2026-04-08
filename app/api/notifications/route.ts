import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markNotificationRead, getCurrentUser } from '@/lib/mock-db';

export async function GET() {
  const user = getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get notifications for this user (or 'all')
  // In a real app, user.id would be extracted from session/token
  const notifications = await getNotifications(user.id);
  
  // Sort by date desc
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ data: notifications });
}

export async function PUT(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = await markNotificationRead(id);
  return NextResponse.json({ success });
}