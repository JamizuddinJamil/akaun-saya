 import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    // Check if already paid
    const receivable = await prisma.receivable.findFirst({
      where: { id, userId: user.id }
    })

    if (!receivable) {
      return Response.json({ error: 'Rekod tidak dijumpai' }, { status: 404 })
    }

    if (receivable.status === 'PAID') {
      return Response.json({ error: 'Sudah ditandakan sebagai dibayar' }, { status: 400 })
    }

    // Find a default income category
    const incomeCategory = await prisma.category.findFirst({
      where: { userId: user.id, type: 'INCOME' },
      orderBy: { isDefault: 'desc' }
    })

    if (!incomeCategory) {
      return Response.json({ error: 'Tiada kategori pendapatan dijumpai' }, { status: 400 })
    }

    // Create transaction and mark receivable as paid in one transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create cash in transaction
      const transaction = await tx.transaction.create({
        data: {
          userId: user.id,
          categoryId: incomeCategory.id,
          type: 'INCOME',
          amount: receivable.amount,
          date: new Date(),
          note: `Bayaran dari ${receivable.customerName}`,
        }
      })

      // Mark receivable as paid
      const updated = await tx.receivable.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          transactionId: transaction.id
        }
      })

      return { transaction, receivable: updated }
    })

    return Response.json(result, { status: 200 })
  } catch (err) {
    console.error('Mark as paid error:', err)
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
