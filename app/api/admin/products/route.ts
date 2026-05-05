import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// GET all products
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const productList = await db.select().from(products).orderBy(products.createdAt);
    return NextResponse.json(productList);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create product
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, weight, price, originalPrice, image, categoryId, badge, inStock } = body;

    if (!name || !weight || !price || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await db.insert(products).values({
      name,
      weight,
      price: price.toString(),
      originalPrice: originalPrice ? originalPrice.toString() : null,
      image,
      categoryId: categoryId || null,
      badge: badge || null,
      inStock: inStock !== undefined ? inStock : true,
    }).returning();

    return NextResponse.json(newProduct[0]);
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
