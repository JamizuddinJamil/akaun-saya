import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SwipeableTransaction from '@/components/SwipeableTransaction'


export const dynamic = 'force-dynamic'
export default async function Dashboard() {
  // 1. Get logged in user
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Get current month range
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

// 3. Load ALL this month's transactions for correct totals
const allTransactions = await prisma.transaction.findMany({
  where: {
    userId: user.id,
    date: { gte: startDate, lte: endDate }
  },
  include: { category: true },
  orderBy: { date: 'desc' },
})

// 4. Calculate totals from ALL transactions
let totalIncome  = 0
let totalExpense = 0
for (const tx of allTransactions) {
  if (tx.type === 'INCOME') totalIncome  += tx.amount
  else                      totalExpense += tx.amount
}

const netProfit = totalIncome - totalExpense

// 5. Only show 5 most recent on dashboard
const transactions = allTransactions.slice(0, 5)

// 6. Format to RM
const toRM = (sen: number) => (sen / 100).toFixed(2)

// 7. Month name in BM
const monthNames = [
    'Januari','Februari','Mac','April','Mei','Jun',
    'Julai','Ogos','September','Oktober','November','Disember'
  ]
  const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '24px 16px 100px', fontFamily: 'sans-serif'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f1f1a' }}>
            🧾 AkaunSaya.my
          </h1>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            {currentMonth}
          </p>
        </div>
      </div>

      {/* Profit card */}
      <div style={{
        background: netProfit >= 0 ? '#0d7a5f' : '#d94f3d',
        borderRadius: '20px', padding: '20px',
        color: 'white', marginBottom: '16px'
      }}>
        <p style={{ opacity: 0.7, fontSize: '11px', marginBottom: '4px', letterSpacing: '1px' }}>
          UNTUNG BERSIH
        </p>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px' }}>
          RM {toRM(Math.abs(netProfit))}
          {netProfit < 0 && <span style={{ fontSize: '14px' }}> (rugi)</span>}
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '10px'
          }}>
            <p style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>PENDAPATAN</p>
            <p style={{ fontWeight: 700, fontSize: '15px' }}>RM {toRM(totalIncome)}</p>
          </div>
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.15)',
            borderRadius: '12px', padding: '10px'
          }}>
            <p style={{ fontSize: '10px', opacity: 0.7, marginBottom: '2px' }}>PERBELANJAAN</p>
            <p style={{ fontWeight: 700, fontSize: '15px' }}>RM {toRM(totalExpense)}</p>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '10px'
        }}>
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0f1f1a' }}>
            TRANSAKSI TERKINI
          </h3>
          <Link href="/rekod" style={{
            fontSize: '12px', color: '#0d7a5f',
            fontWeight: 600, textDecoration: 'none'
          }}>
            Semua →
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            textAlign: 'center', color: '#666'
          }}>
            <p style={{ fontSize: '32px', marginBottom: '8px' }}>📭</p>
            <p style={{ fontSize: '13px', fontWeight: 600 }}>Tiada rekod lagi</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Tekan + untuk tambah perbelanjaan
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {transactions.map((tx: any) => (
              <SwipeableTransaction key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>

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
            color: item.active ? '#0d7a5f' : '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}