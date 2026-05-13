import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const purchase = await prisma.purchase.update({
      where: { id },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
      },
    })

    return NextResponse.json({ message: 'Purchase verified successfully', purchase })
  } catch (error) {
    console.error('Error verifying purchase:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
