import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/drizzle/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, totalAmount, notes, items } = body;

    if (!customerName || !customerPhone || !totalAmount || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create order
    const newOrder = await db.insert(orders).values({
      customerName,
      customerEmail: 'no-email@example.com', // Default email since not collected in checkout form
      customerPhone,
      totalAmount: totalAmount.toString(),
      notes: notes || null,
    }).returning();

    // Create order items
    const orderId = newOrder[0].id;
    const orderItemsData = items.map((item: any) => ({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price.toString(),
    }));

    await db.insert(orderItems).values(orderItemsData);

    return NextResponse.json(newOrder[0]);
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
