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
        userId: user.id,
        status: 'VERIFIED'
      },
      include: {
        course: {
          include: {
            lessons: {
              select: { id: true }
            }
          }
        }
      }
    });

    const courses = purchases.map(p => p.course);

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching student courses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
