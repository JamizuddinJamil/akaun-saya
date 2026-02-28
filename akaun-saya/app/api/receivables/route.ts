import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })

    const { customerName, phoneNumber, amount, dueDate, note } = await req.json()

    if (!customerName || amount <= 0) {
      return Response.json({ error: 'Data tidak lengkap' }, { status: 422 })
    }

    const receivable = await prisma.receivable.create({
      data: {
        userId: user.id,
        customerName,
        phoneNumber: phoneNumber || null,
        amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        note: note || null,
        status: 'UNPAID',
      }
    })

    return Response.json(receivable, { status: 201 })
  } catch (err: any) {
    console.error('Receivable create error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}