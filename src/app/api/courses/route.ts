import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthUser();
    
    const courses = await prisma.course.findMany({
      where: user?.role === 'ADMIN' ? {} : {
        status: 'PUBLISHED',
      },
      include: {
        _count: {
          select: { lessons: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priceSOL, category, level, thumbnail } = body;

    if (!title || !description || priceSOL === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        priceSOL: parseFloat(priceSOL),
        category,
        level,
        thumbnail,
        instructor: user.name || 'Admin',
        status: 'DRAFT',
      }
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
