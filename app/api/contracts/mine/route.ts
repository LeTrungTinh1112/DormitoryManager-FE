
import { NextResponse } from 'next/server';
import { getCurrentUser, getContracts } from '@/lib/mock-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentUser = getCurrentUser();
    
    // Check if user is authenticated
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only residents can view contracts, not guests/students
    if (!currentUser.roles.includes('resident')) {
      return NextResponse.json({ data: [] });
    }
    
    const contracts = await getContracts();
    
    // Filter contracts where studentEmail equals currentUser.email
    const myContracts = contracts.filter(c => c.studentEmail === currentUser.email);
    
    return NextResponse.json({ data: myContracts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
