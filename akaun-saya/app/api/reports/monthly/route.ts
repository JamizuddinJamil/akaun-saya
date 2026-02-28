// app/api/reports/monthly/route.ts
// GET /api/reports/monthly?month=2025-02
// Returns full P&L breakdown for the month — used on the Laporan screen

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })
  }

  // 2. Parse month
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month') ?? new Date().toISOString().slice(0, 7)
  const [year, monthNum] = month.split('-').map(Number)
  const startDate = new Date(year, monthNum - 1, 1)
  const endDate   = new Date(year, monthNum, 0, 23, 59, 59)

  // 3. Fetch all transactions for this period
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate, lte: endDate },
    },
    include: {
      category: { select: { id: true, name: true, icon: true, type: true } },
    },
    orderBy: { date: 'desc' },
  })

  // 4. Build category breakdown
  const categoryMap = new Map<string, {
    categoryId: string
    name: string
    icon: string
    type: string
    total: number
    count: number
  }>()

  let totalIncome  = 0
  let totalExpense = 0

  for (const tx of transactions) {
    const key = tx.categoryId
    const existing = categoryMap.get(key)

    if (existing) {
      existing.total += tx.amount
      existing.count += 1
    } else {
      categoryMap.set(key, {
        categoryId: tx.category.id,
        name:       tx.category.name,
        icon:       tx.category.icon,
        type:       tx.category.type,
        total:      tx.amount,
        count:      1,
      })
    }

    if (tx.type === 'INCOME')  totalIncome  += tx.amount
    else                       totalExpense += tx.amount
  }

  // 5. Sort categories by total descending
  const categories = Array.from(categoryMap.values())
    .sort((a, b) => b.total - a.total)
    .map(cat => ({
      ...cat,
      totalRM:     (cat.total / 100).toFixed(2),
      percentage:  cat.type === 'EXPENSE' && totalExpense > 0
                     ? Math.round((cat.total / totalExpense) * 100)
                     : cat.type === 'INCOME' && totalIncome > 0
                       ? Math.round((cat.total / totalIncome) * 100)
                       : 0,
    }))

  // 6. Compare with previous month
  const prevStart = new Date(year, monthNum - 2, 1)
  const prevEnd   = new Date(year, monthNum - 1, 0, 23, 59, 59)

  const prevResult = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      userId: user.id,
      date: { gte: prevStart, lte: prevEnd },
    },
    _sum: { amount: true },
  })

  const prevIncome  = prevResult.find(r => r.type === 'INCOME')?._sum.amount  ?? 0
  const prevExpense = prevResult.find(r => r.type === 'EXPENSE')?._sum.amount ?? 0
  const prevProfit  = prevIncome - prevExpense

  const netProfit = totalIncome - totalExpense

  return Response.json({
    month,
    summary: {
      totalIncome,
      totalExpense,
      netProfit,
      transactionCount: transactions.length,
      // For display (RM strings)
      totalIncomeRM:  (totalIncome  / 100).toFixed(2),
      totalExpenseRM: (totalExpense / 100).toFixed(2),
      netProfitRM:    (netProfit    / 100).toFixed(2),
    },
    // Month-over-month change
    vsLastMonth: {
      incomeChange:  prevIncome  > 0 ? Math.round(((totalIncome  - prevIncome)  / prevIncome)  * 100) : null,
      expenseChange: prevExpense > 0 ? Math.round(((totalExpense - prevExpense) / prevExpense) * 100) : null,
      profitChange:  prevProfit  > 0 ? Math.round(((netProfit    - prevProfit)  / Math.abs(prevProfit)) * 100) : null,
    },
    categories: {
      expense: categories.filter(c => c.type === 'EXPENSE'),
      income:  categories.filter(c => c.type === 'INCOME'),
    },
    // Recent transactions for the feed
    recentTransactions: transactions.slice(0, 20).map(tx => ({
      id:         tx.id,
      type:       tx.type,
      amount:     tx.amount,
      amountRM:   (tx.amount / 100).toFixed(2),
      date:       tx.date.toISOString().split('T')[0],
      note:       tx.note,
      receiptUrl: tx.receiptUrl,
      category:   { name: tx.category.name, icon: tx.category.icon },
    })),
  })
}
