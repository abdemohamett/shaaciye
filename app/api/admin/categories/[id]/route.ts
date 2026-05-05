import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/drizzle/schema';
import { getAdminSession } from '@/lib/auth';
import { eq } from 'drizzle-orm';

// DELETE category
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
    const deletedCategory = await db.delete(categories)
      .where(eq(categories.id, parseInt(id)))
      .returning();

    if (deletedCategory.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
