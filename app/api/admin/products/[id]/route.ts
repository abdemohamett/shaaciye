import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/drizzle/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const product = await db.select().from(products).where(eq(products.id, parseInt(id))).limit(1);
    
    if (product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product[0]);
  } catch (error) {
    console.error('Fetch product error:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT update product
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
    const { name, weight, price, originalPrice, image, categoryId, badge, inStock } = body;

    const updatedProduct = await db.update(products)
      .set({
        name,
        weight,
        price: price.toString(),
        originalPrice: originalPrice ? originalPrice.toString() : null,
        image,
        categoryId: categoryId && categoryId !== 'none' ? parseInt(categoryId) : null,
        badge: badge || null,
        inStock: inStock !== undefined ? inStock : true,
        updatedAt: new Date(),
      })
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct[0]);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deletedProduct = await db.delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
