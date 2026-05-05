import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/drizzle/schema';
import { getAdminSession } from '@/lib/auth';

// GET all categories
export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categoryList = await db.select().from(categories).orderBy(categories.createdAt);
    return NextResponse.json(categoryList);
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create category
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, image } = body;

    if (!name || !image) {
      return NextResponse.json({ error: 'Name and image are required' }, { status: 400 });
    }

    const newCategory = await db.insert(categories).values({
      name,
      image,
    }).returning();

    return NextResponse.json(newCategory[0]);
  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
