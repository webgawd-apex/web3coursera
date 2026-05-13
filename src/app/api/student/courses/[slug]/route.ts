import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Verify purchase
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        status: 'VERIFIED'
      }
    });

    // If not verified, check if user is admin (allow admin to view all)
    if (!purchase && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch completed lessons
    const progress = await prisma.progress.findMany({
      where: {
        userId: user.id,
        lesson: { courseId: course.id },
        completed: true
      },
      select: { lessonId: true }
    });

    return NextResponse.json({ 
      course,
      completedLessons: progress.map(p => p.lessonId)
    });
  } catch (error) {
    console.error('Error fetching study course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
