import { NextRequest, NextResponse } from 'next/server';
import { applyDiscountToPayment, getCurrentUser } from '@/lib/mock-db';

export async function POST(request: NextRequest) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { paymentId, discountCode } = await request.json();

    if (!paymentId || !discountCode) {
      return NextResponse.json({ error: 'Payment ID and discount code are required' }, { status: 400 });
    }

    const result = await applyDiscountToPayment(paymentId, discountCode, currentUser.id);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message, data: result.payment });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
  } catch (error) {
    console.error('Apply discount error:', error);
    return NextResponse.json({ error: 'Failed to apply discount' }, { status: 500 });
  }
}
