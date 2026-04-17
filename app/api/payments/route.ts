
import { NextRequest, NextResponse } from 'next/server';
import { getPayments, submitPaymentProof, updatePaymentStatus, approvePayment, getCurrentUser } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const allPayments = await getPayments();
  const currentUser = getCurrentUser();

  if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // If manager, return all payments
  if (currentUser.roles.includes('manager')) {
      return NextResponse.json({ data: allPayments });
  }

  // If resident/student, filter by email instead of ID since ID depends on mock setup
  // and bookings use email to generate first payment
  const userPayments = allPayments.filter(p => p.userId === currentUser.id || p.userId === currentUser.email);

  return NextResponse.json({ data: userPayments });
}

export async function POST(request: NextRequest) {
    // This could be used by Manager to create a new payment request
    // or by User to submit proof (if we design it that way, but for proof submission we might use specific endpoint or PUT)
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, action, ...data } = body;

        if (action === 'submit_proof') {
            const upatedPayment = await submitPaymentProof(id, data);
            return NextResponse.json({ success: true, data: upatedPayment });
        }
        
        if (action === 'approve_payment') {
            const { status } = data; // 'paid' or 'rejected'
            const upatedPayment = await approvePayment(id, status);
            return NextResponse.json({ success: true, data: upatedPayment });
        }

        if (action === 'update_status') {
            const { status, role, userId } = data;
            const upatedPayment = await updatePaymentStatus(id, status, role, userId);
             return NextResponse.json({ success: true, data: upatedPayment });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Payment update error:", error);
         return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
    }
}
