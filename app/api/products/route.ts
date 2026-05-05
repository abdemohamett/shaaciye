import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        name: products.name,
        weight: products.weight,
        price: products.price,
        originalPrice: products.originalPrice,
        image: products.image,
        badge: products.badge,
        categoryId: products.categoryId,
        inStock: products.inStock,
        category: {
          name: categories.name,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id));

    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
