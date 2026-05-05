import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/drizzle/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// PATCH update order status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedOrder = await db.update(orders)
      .set({
        status,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, parseInt(id)))
      .returning();

    if (updatedOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
