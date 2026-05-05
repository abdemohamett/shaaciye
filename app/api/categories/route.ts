import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, products } from '@/drizzle/schema';
import { eq, count } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const includeCount = searchParams.get('includeCount') === 'true';

    let query = db.select().from(categories);

    // Add search functionality
    if (search) {
      // This would need to be adapted based on your actual schema
      // For now, we'll handle it in the frontend
    }

    let allCategories = await query;

    // Include product count if requested
    if (includeCount) {
      const categoriesWithCount = await Promise.all(
        allCategories.map(async (category) => {
          const productCount = await db
            .select({ count: count() })
            .from(products)
            .where(eq(products.categoryId, category.id));
          
          return {
            ...category,
            count: productCount[0]?.count || 0
          };
        })
      );
      
      return NextResponse.json(categoriesWithCount);
    }

    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
