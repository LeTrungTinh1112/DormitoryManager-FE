import { NextResponse } from 'next/server';
import { getDiscounts } from '@/lib/mock-db';

export async function GET() {
  try {
    const discounts = await getDiscounts();
    return NextResponse.json({ data: discounts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}
