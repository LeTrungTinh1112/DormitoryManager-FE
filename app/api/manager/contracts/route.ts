
import { NextRequest, NextResponse } from 'next/server';
import { getContracts, deleteContract, addContract, updateContract, addNotification } from '@/lib/mock-db';

export async function GET() {
  // In a real app, verify Manager role here
  const contracts = await getContracts();
  return NextResponse.json({ data: contracts });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Validation could be added here
        const newContract = await addContract(body);

        await addNotification({
            userId: 'resident',
            title: 'Hợp đồng mới được tạo',
            description: `Bạn có hợp đồng thuê mới cho phòng ${newContract.roomName}. Vui lòng kiểm tra.`,
            type: 'contract'
        });

        return NextResponse.json({ success: true, data: newContract }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        
        if (!id) {
             return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const updatedContract = await updateContract(id, updates);
        
        if (updatedContract) {
            await addNotification({
                userId: 'resident',
                title: 'Hợp đồng cập nhật',
                description: `Thông tin hợp đồng ${updatedContract.id} của bạn đã được cập nhật.`,
                type: 'contract'
            });

            return NextResponse.json({ success: true, data: updatedContract });
        }
        
        return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = await deleteContract(id);
  return NextResponse.json({ success });
}
