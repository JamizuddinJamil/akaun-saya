import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import KategoriClient from '@/components/KategoriClient'

export default async function KategoriPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const categories = await prisma.category.findMany({
    where:   { userId: user.id },
    orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
    include: {
      _count: { select: { transactions: true } }
    }
  })

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 0 16px'
      }}>
        <Link href="/dashboard" style={{
          width: '36px', height: '36px', background: 'white',
          border: '2px solid #e8eeec', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', textDecoration: 'none', flexShrink: 0,
          color: 'inherit'
        }}>
          ←
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
          Urus Kategori
        </h1>
      </div>

      <KategoriClient categories={categories} />
    </div>
  )
} 
