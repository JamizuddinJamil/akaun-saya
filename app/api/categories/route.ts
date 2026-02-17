 import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const categorySchema = z.object({
  name:      z.string().min(1).max(50),
  icon:      z.string().min(1).max(10),
  type:      z.enum(['EXPENSE', 'INCOME']),
  sortOrder: z.number().int().optional(),
})

// GET — list all categories
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    const categories = await prisma.category.findMany({
      where:   { userId: user.id },
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }]
    })

    return Response.json({ categories })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// POST — create new category
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    const body   = await req.json()
    const result = categorySchema.safeParse(body)
    if (!result.success) {
      return Response.json({ error: 'Data tidak sah' }, { status: 422 })
    }

    // Get highest sortOrder for this user+type
    const last = await prisma.category.findFirst({
      where:   { userId: user.id, type: result.data.type },
      orderBy: { sortOrder: 'desc' }
    })

    const category = await prisma.category.create({
      data: {
        userId:    user.id,
        name:      result.data.name,
        icon:      result.data.icon,
        type:      result.data.type,
        sortOrder: (last?.sortOrder ?? 0) + 1,
        isDefault: false,
      }
    })

    return Response.json(category, { status: 201 })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
