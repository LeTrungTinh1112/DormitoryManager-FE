
import { NextRequest, NextResponse } from 'next/server';
import { rooms } from '@/lib/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.toLowerCase();
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '9');

  let filteredRooms = [...rooms];

  // Filter by search term (name or description)
  if (search) {
    filteredRooms = filteredRooms.filter(room => 
      room.name.toLowerCase().includes(search) || 
      room.description.toLowerCase().includes(search)
    );
  }

  // Filter by type
  if (type && type !== 'all') {
    filteredRooms = filteredRooms.filter(room => room.type === type);
  }

  // Filter by status
  if (status && status !== 'all') {
    filteredRooms = filteredRooms.filter(room => room.status === status);
  }

  // Filter by price range
  if (minPrice) {
    filteredRooms = filteredRooms.filter(room => room.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    filteredRooms = filteredRooms.filter(room => room.price <= parseInt(maxPrice));
  }

  // Pagination
  const total = filteredRooms.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedRooms = filteredRooms.slice(offset, offset + limit);

  return NextResponse.json({
    data: paginatedRooms,
    pagination: {
      total,
      totalPages,
      page,
      limit
    }
  });
}

