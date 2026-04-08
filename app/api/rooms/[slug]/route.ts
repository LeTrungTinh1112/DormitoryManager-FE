
import { NextRequest, NextResponse } from 'next/server';
import { rooms } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const room = rooms.find((r) => r.slug === slug);

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }

  // Find related rooms (same type, exclude current)
  const relatedRooms = rooms
    .filter((r) => r.type === room.type && r.id !== room.id)
    .slice(0, 3);

  return NextResponse.json({
      data: room,
      related: relatedRooms
  });
}

