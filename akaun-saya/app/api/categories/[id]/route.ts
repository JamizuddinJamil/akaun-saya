 import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { NextRequest } from 'next/server'

const updateSchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().min(1).max(10),
})

// PATCH — update category name/icon
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    const body   = await req.json()
    const result = updateSchema.safeParse(body)
    if (!result.success) {
      return Response.json({ error: 'Data tidak sah' }, { status: 422 })
    }

    // Make sure category belongs to this user
    const existing = await prisma.category.findFirst({
      where: { id, userId: user.id }
    })
    if (!existing) {
      return Response.json({ error: 'Kategori tidak dijumpai' }, { status: 404 })
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: result.data.name,
        icon: result.data.icon,
      }
    })

    return Response.json(updated)
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}

// DELETE — delete category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    // Make sure category belongs to this user
    const existing = await prisma.category.findFirst({
      where: { id, userId: user.id }
    })
    if (!existing) {
      return Response.json({ error: 'Kategori tidak dijumpai' }, { status: 404 })
    }

    // Check if category is used in any transactions
    const usageCount = await prisma.transaction.count({
      where: { categoryId: id }
    })

    if (usageCount > 0) {
      return Response.json({
        error: `Kategori ini digunakan dalam ${usageCount} transaksi. Padam transaksi dahulu.`,
        usageCount
      }, { status: 409 })
    }

    await prisma.category.delete({ where: { id } })

    return Response.json({ success: true })
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
