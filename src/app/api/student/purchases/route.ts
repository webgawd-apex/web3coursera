import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: user.id
      },
      include: {
        course: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ purchases });
  } catch (error) {
    console.error('Error fetching student purchases:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
