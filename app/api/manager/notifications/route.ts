import { NextRequest, NextResponse } from 'next/server';
import { addNotification, getCurrentUser } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.roles.includes('manager')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Return all notifications history from manager side
  // The global store is mockNotificationsStore
  const allNotifications = global.mockNotificationsStore || [];
  
  return NextResponse.json({ data: allNotifications });
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.roles.includes('manager')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, type, userId } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const notif = await addNotification({
      title,
      description,
      type: type || 'system',
      userId: userId || 'all'
    });

    return NextResponse.json({ success: true, data: notif }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'System error' }, { status: 500 });
  }
}
