 import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    const { companyName, businessType, expenseCategories, incomeCategories } = await req.json()

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        businessName: companyName,
        businessType,
        onboardingCompleted: true,
      }
    })

    // Create expense categories
    const expenseCats = expenseCategories.map((name: string, i: number) => ({
      userId: user.id,
      name,
      icon: '💸',
      type: 'EXPENSE',
      sortOrder: i,
      isDefault: false,
    }))

    // Create income categories
    const incomeCats = incomeCategories.map((name: string, i: number) => ({
      userId: user.id,
      name,
      icon: '💰',
      type: 'INCOME',
      sortOrder: i,
      isDefault: false,
    }))

    await prisma.category.createMany({
      data: [...expenseCats, ...incomeCats]
    })

    return Response.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Onboarding error:', err)
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
