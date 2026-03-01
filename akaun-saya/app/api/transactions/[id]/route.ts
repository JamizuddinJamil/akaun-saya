import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params — required in Next.js 16
    const { id } = await params

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })
    }

    // Make sure this transaction belongs to this user
    const transaction = await prisma.transaction.findFirst({
      where: { id, userId: user.id }
    })

    if (!transaction) {
      return Response.json({ error: 'Rekod tidak dijumpai' }, { status: 404 })
    }

    await prisma.transaction.delete({
      where: { id }
    })

    return Response.json({ success: true })

  } catch (err: any) {
    console.error('DELETE /api/transactions/[id] error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}