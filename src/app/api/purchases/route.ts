import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'
import { verifyTransaction } from '@/lib/solana'

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseId, txHash } = await request.json()

    if (!courseId || !txHash) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check if already purchased or being verified
    const existingPurchase = await prisma.purchase.findUnique({
      where: { txHash },
    })

    if (existingPurchase) {
      return NextResponse.json({ error: 'This transaction hash has already been submitted' }, { status: 400 })
    }

    // Immediate verification
    const verification = await verifyTransaction(txHash, course.priceSOL)

    const purchase = await prisma.purchase.create({
      data: {
        userId: user.id,
        courseId: course.id,
        txHash,
        amountSOL: course.priceSOL,
        status: verification.verified ? 'VERIFIED' : 'PENDING',
        verifiedAt: verification.verified ? new Date() : null,
      },
    })

    if (verification.verified) {
      return NextResponse.json({ 
        message: 'Payment verified and course unlocked!', 
        purchase,
        verified: true 
      })
    } else {
      return NextResponse.json({ 
        message: 'Payment submitted. Our team will verify it manually if on-chain check fails.', 
        error: verification.error,
        purchase,
        verified: false 
      })
    }
  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const purchases = await prisma.purchase.findMany({
      where: { userId: user.id },
      include: {
        course: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ purchases })
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
