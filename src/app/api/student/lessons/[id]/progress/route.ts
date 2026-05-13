import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { completed } = await request.json();

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId
        }
      },
      update: {
        completed,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        lessonId,
        completed
      }
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
