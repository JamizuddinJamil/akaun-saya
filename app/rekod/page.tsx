 import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SwipeableTransaction from '@/components/SwipeableTransaction'

export default async function RekodPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  // 1. Auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Get month filter (or show all if no filter)
  const { month: monthParam } = await searchParams
  const now = new Date()

  let transactions
  let monthLabel = 'Semua Rekod'

  if (monthParam) {
    // Filtered by month
    const [year, monthNum] = monthParam.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate   = new Date(year, monthNum, 0, 23, 59, 59)

    transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date:   { gte: startDate, lte: endDate }
      },
      include: { category: true },
      orderBy: { date: 'desc' }
    })

    const monthNames = [
      'Januari','Februari','Mac','April','Mei','Jun',
      'Julai','Ogos','September','Oktober','November','Disember'
    ]
    monthLabel = `${monthNames[monthNum - 1]} ${year}`
  } else {
    // Show all transactions
    transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      include: { category: true },
      orderBy: { date: 'desc' },
      take: 100 // Limit to last 100 for performance
    })
  }

  // 3. Group by month for display
  const grouped = new Map<string, typeof transactions>()
  for (const tx of transactions) {
    const key = `${tx.date.getFullYear()}-${String(tx.date.getMonth() + 1).padStart(2, '0')}`
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(tx)
  }

  const monthNames = [
    'Januari','Februari','Mac','April','Mei','Jun',
    'Julai','Ogos','September','Oktober','November','Disember'
  ]

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px', fontFamily: 'sans-serif'
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
          fontSize: '16px', textDecoration: 'none', flexShrink: 0
        }}>
          ←
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
            {monthLabel}
          </h1>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            {transactions.length} transaksi
          </p>
        </div>
        {monthParam && (
          <Link href="/rekod" style={{
            fontSize: '11px', color: '#0d7a5f',
            fontWeight: 700, textDecoration: 'none'
          }}>
            Lihat Semua
          </Link>
        )}
      </div>

      {/* Summary stats */}
      {transactions.length > 0 && (
        <div style={{
          display: 'flex', gap: '8px', marginBottom: '16px'
        }}>
          <div style={{
            flex: 1, background: 'white', borderRadius: '14px',
            padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>
              💰 PENDAPATAN
            </p>
            <p style={{ fontSize: '15px', fontWeight: 800, color: '#0d7a5f' }}>
              RM {(transactions
                .filter((tx: any) => tx.type === 'INCOME')
                .reduce((sum: number, tx: any) => sum + tx.amount, 0) / 100
              ).toFixed(2)}
            </p>
          </div>
          <div style={{
            flex: 1, background: 'white', borderRadius: '14px',
            padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>
              💸 PERBELANJAAN
            </p>
            <p style={{ fontSize: '15px', fontWeight: 800, color: '#d94f3d' }}>
              RM {(transactions
                .filter((tx: any) => tx.type === 'EXPENSE')
                .reduce((sum: number, tx: any) => sum + tx.amount, 0) / 100
              ).toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Transactions grouped by month */}
      {grouped.size > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {Array.from(grouped.entries()).map(([monthKey, txs]) => {
            const [year, month] = monthKey.split('-').map(Number)
            const label = `${monthNames[month - 1]} ${year}`

            return (
              <div key={monthKey}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '10px'
                }}>
                  <h3 style={{
                    fontSize: '12px', fontWeight: 700, color: '#888',
                    letterSpacing: '1px', textTransform: 'uppercase'
                  }}>
                    {label}
                  </h3>
                  <Link href={`/laporan?month=${monthKey}`} style={{
                    fontSize: '11px', color: '#0d7a5f',
                    fontWeight: 600, textDecoration: 'none'
                  }}>
                    Laporan →
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {txs.map((tx: any) => (
                    <SwipeableTransaction key={tx.id} tx={tx} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{
          background: 'white', borderRadius: '16px', padding: '40px',
          textAlign: 'center', color: '#666'
        }}>
          <p style={{ fontSize: '36px', marginBottom: '8px' }}>📭</p>
          <p style={{ fontSize: '14px', fontWeight: 600 }}>Tiada rekod lagi</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Tekan + untuk tambah transaksi pertama
          </p>
        </div>
      )}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e8eeec',
        display: 'flex', padding: '10px 0 20px', zIndex: 10
      }}>
        {[
          { href: '/dashboard', icon: '🏠', label: 'Utama', active: true },
          { href: '/tambah',    icon: '➕', label: 'Tambah' },
          { href: '/laporan',   icon: '📊', label: 'Laporan' },
          { href: '/tetapan',   icon: '⚙️', label: 'Tetapan' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px', textDecoration: 'none',
            color: '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}
