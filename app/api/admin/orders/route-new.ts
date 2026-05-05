import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/drizzle/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface OrderWithItems {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: string;
  total: string;
  createdAt: Date;
  notes: string;
  items: OrderItem[];
}

// GET all orders
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all orders
    const allOrders = await db.select().from(orders).orderBy(orders.createdAt);
    
    // Get all order items with product info
    const allOrderItems = await db
      .select({
        orderId: orderItems.orderId,
        id: orderItems.id,
        name: products.name,
        image: products.image,
        quantity: orderItems.quantity,
        price: orderItems.price,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id));

    // Group items by order
    const ordersWithItems: OrderWithItems[] = [];
    
    for (const order of allOrders) {
      const items = allOrderItems
        .filter((item: any) => item.orderId === order.id)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
        }));

      ordersWithItems.push({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        status: order.status,
        total: order.totalAmount,
        createdAt: order.createdAt,
        notes: order.notes || '',
        items,
      });
    }

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(
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

    const updatedOrder = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
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

// POST create order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, totalAmount, notes, items } = body;

    if (!customerName || !customerEmail || !customerPhone || !totalAmount || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create order
    const newOrder = await db.insert(orders).values({
      customerName,
      customerEmail,
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
