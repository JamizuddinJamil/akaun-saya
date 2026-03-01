import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import AddExpenseForm from '@/components/AddExpenseForm'
import { seedDefaultCategories } from '@/prisma/seed'

export default async function TambahPage() {
  // 1. Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Make sure user exists in OUR database
  // Supabase Auth and our Prisma DB are separate — we need to sync them
  await prisma.user.upsert({
    where:  { id: user.id },
    update: {},  // don't update anything if exists
    create: {
      id:    user.id,  // use same ID as Supabase Auth
      email: user.email!,
      name:  user.email!.split('@')[0],  // use email prefix as default name
    }
  })

  // 3. Load this user's categories
  const categories = await prisma.category.findMany({
    where:   { userId: user.id },
    orderBy: { sortOrder: 'asc' }
  })

// 4. If no categories yet, seed defaults based on their business type
if (categories.length === 0) {
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  
  })
  const businessType = dbUser?.businessType || 'generic'
  await seedDefaultCategories(user.id, businessType)
  redirect('/tambah')
}

  return (
    <div style={{
      maxWidth: '430px',
      margin: '0 auto',
      padding: '0 16px',
      
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 0 12px'
      }}>
        <a href="/dashboard" style={{
          width: '36px', height: '36px',
          background: 'white', border: '2px solid #e8eeec',
          borderRadius: '10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', textDecoration: 'none',
          flexShrink: 0
        }}>
          ←
        </a>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
          Tambah Rekod
        </h1>
      </div>

      {/* Form */}
      <AddExpenseForm categories={categories} />
    </div>
  )
}
