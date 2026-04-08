
import { NextResponse } from 'next/server';
import { getCurrentUser, updateUser } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  // In a real app, we would verify the session token here
  const user = getCurrentUser();
  return NextResponse.json({ data: user });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const updatedUser = updateUser(body);
        
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ data: updatedUser, message: 'Profile updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
