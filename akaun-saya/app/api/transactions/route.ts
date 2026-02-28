import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const createTransactionSchema = z.object({
  categoryId: z.string(),
  type:       z.enum(['EXPENSE', 'INCOME']),
  amount:     z.number().int().positive(),
  date:       z.string(),
  note:       z.string().max(500).optional(),
  receiptUrl: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const month    = searchParams.get('month') ?? new Date().toISOString().slice(0, 7)
    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate   = new Date(year, monthNum, 0, 23, 59, 59)

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      include: { category: true },
      orderBy: { date: 'desc' },
    })

const totalIncome  = transactions.filter((t: any) => t.type === 'INCOME').reduce((s: any, t: any) => s + t.amount, 0)
const totalExpense = transactions.filter((t: any) => t.type === 'EXPENSE').reduce((s: any, t: any) => s + t.amount, 0)

    return Response.json({
transactions: transactions.map((tx: any) => ({
        id:         tx.id,
        type:       tx.type,
        amount:     tx.amount,
        amountRM:   (tx.amount / 100).toFixed(2),
        date:       tx.date.toISOString().split('T')[0],
        note:       tx.note,
        receiptUrl: tx.receiptUrl,
        category:   { name: tx.category.name, icon: tx.category.icon },
      })),
      summary: {
        totalIncome,
        totalExpense,
        netProfit: totalIncome - totalExpense,
        month,
      }
    })
  } catch (err: any) {
    console.error('GET /api/transactions error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })
    }

    const body   = await req.json()
    const result = createTransactionSchema.safeParse(body)
    if (!result.success) {
      return Response.json(
        { error: 'Data tidak sah', details: result.error.flatten() },
        { status: 422 }
      )
    }

    const { categoryId, type, amount, date, note, receiptUrl } = result.data

    // Make sure user exists in our DB
    await prisma.user.upsert({
      where:  { id: user.id },
      update: {},
      create: {
        id:    user.id,
        email: user.email!,
        name:  user.email!.split('@')[0],
      }
    })

    // Make sure category belongs to this user
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId: user.id }
    })
    if (!category) {
      return Response.json({ error: 'Kategori tidak dijumpai' }, { status: 404 })
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        categoryId,
        type,
        amount,
        date:       new Date(date),
        note,
        receiptUrl,
      },
      include: { category: true }
    })

    return Response.json({
      id:       transaction.id,
      type:     transaction.type,
      amount:   transaction.amount,
      amountRM: (transaction.amount / 100).toFixed(2),
      date:     transaction.date.toISOString().split('T')[0],
      note:     transaction.note,
      category: { name: transaction.category.name, icon: transaction.category.icon }
    }, { status: 201 })

  } catch (err: any) {
    console.error('POST /api/transactions error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}