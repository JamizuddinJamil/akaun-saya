export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { month: monthParam } = await searchParams
  const now       = new Date()
  const month     = monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const [year, monthNum] = month.split('-').map(Number)

  const startDate = new Date(year, monthNum - 1, 1)
  const endDate   = new Date(year, monthNum, 0, 23, 59, 59)

  const transactions = await prisma.transaction.findMany({
    where:   { userId: user.id, date: { gte: startDate, lte: endDate } },
    include: { category: true },
    orderBy: { date: 'desc' }
  })

  let totalIncome  = 0
  let totalExpense = 0
  for (const tx of transactions) {
    if (tx.type === 'INCOME') totalIncome  += tx.amount
    else                      totalExpense += tx.amount
  }
  const netProfit = totalIncome - totalExpense

  // Category breakdown
  const categoryMap = new Map<string, {
    name: string; icon: string; type: string; total: number; count: number
  }>()
  for (const tx of transactions) {
    const existing = categoryMap.get(tx.categoryId)
    if (existing) { existing.total += tx.amount; existing.count += 1 }
    else categoryMap.set(tx.categoryId, {
      name: tx.category.name, icon: tx.category.icon,
      type: tx.type, total: tx.amount, count: 1
    })
  }
  const categories = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total)
  const expenseCategories = categories.filter(c => c.type === 'EXPENSE')
  const incomeCategories  = categories.filter(c => c.type === 'INCOME')

  // Daily totals for bar chart (expense only)
  const daysInMonth   = new Date(year, monthNum, 0).getDate()
  const dailyExpense  = Array(daysInMonth).fill(0)
  const dailyIncome   = Array(daysInMonth).fill(0)
  for (const tx of transactions) {
    const day = new Date(tx.date).getDate() - 1
    if (tx.type === 'EXPENSE') dailyExpense[day] += tx.amount
    else                       dailyIncome[day]  += tx.amount
  }
  const maxDaily = Math.max(...dailyExpense, ...dailyIncome, 1)

  const monthNames = [
    'Januari','Februari','Mac','April','Mei','Jun',
    'Julai','Ogos','September','Oktober','November','Disember'
  ]
  const monthLabel = `${monthNames[monthNum - 1]} ${year}`

  const prevDate  = new Date(year, monthNum - 2, 1)
  const nextDate  = new Date(year, monthNum, 1)
  const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
  const nextMonth = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = month === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const toRM = (sen: number) => (sen / 100).toFixed(2)

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px',
      background: '#f5f7f6', minHeight: '100vh'
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
          fontSize: '16px', textDecoration: 'none', flexShrink: 0, color: 'inherit'
        }}>
          ←
        </Link>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
            Laporan Kewangan
          </h1>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            {transactions.length} transaksi
          </p>
        </div>
      </div>

      {/* Month selector */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'white', borderRadius: '16px', padding: '10px 16px',
        marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <Link href={`/laporan?month=${prevMonth}`} style={{
          width: '32px', height: '32px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px', textDecoration: 'none',
          color: '#0d7a5f', fontWeight: 800, borderRadius: '8px',
          background: '#f0faf7'
        }}>
          ‹
        </Link>
        <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f1f1a' }}>
          {monthLabel}
        </p>
        <Link href={`/laporan?month=${nextMonth}`} style={{
          width: '32px', height: '32px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '20px', textDecoration: 'none',
          color: isCurrentMonth ? '#ccc' : '#0d7a5f', fontWeight: 800,
          borderRadius: '8px', background: isCurrentMonth ? '#f5f5f5' : '#f0faf7',
          pointerEvents: isCurrentMonth ? 'none' : 'auto'
        }}>
          ›
        </Link>
      </div>

      {transactions.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '48px',
          textAlign: 'center', color: '#666',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
          <p style={{ fontSize: '14px', fontWeight: 700 }}>Tiada rekod untuk bulan ini</p>
          <p style={{ fontSize: '12px', marginTop: '6px', color: '#888' }}>
            Cuba pilih bulan lain atau tambah rekod baru
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

          {/* Summary 3-col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
            }}>
              <p style={{ fontSize: '9px', color: '#888', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
                💰 MASUK
              </p>
              <p style={{ fontSize: '13px', fontWeight: 900, color: '#0d7a5f' }}>
                RM {toRM(totalIncome)}
              </p>
            </div>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
            }}>
              <p style={{ fontSize: '9px', color: '#888', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
                💸 KELUAR
              </p>
              <p style={{ fontSize: '13px', fontWeight: 900, color: '#d94f3d' }}>
                RM {toRM(totalExpense)}
              </p>
            </div>
            <div style={{
              background: netProfit >= 0 ? '#0d7a5f' : '#d94f3d',
              borderRadius: '16px', padding: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '4px' }}>
                {netProfit >= 0 ? '✨ UNTUNG' : '⚠️ RUGI'}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 900, color: 'white' }}>
                RM {toRM(Math.abs(netProfit))}
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{
              fontSize: '10px', fontWeight: 700, color: '#888',
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px'
            }}>
              📊 ALIRAN HARIAN
            </p>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#d94f3d' }} />
                <span style={{ fontSize: '10px', color: '#888' }}>Belanja</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0d7a5f' }} />
                <span style={{ fontSize: '10px', color: '#888' }}>Pendapatan</span>
              </div>
            </div>

            {/* Bars */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: '2px',
              height: '80px', overflowX: 'auto', paddingBottom: '4px'
            }}>
              {dailyExpense.map((exp, i) => {
                const inc    = dailyIncome[i]
                const expPct = Math.round((exp / maxDaily) * 100)
                const incPct = Math.round((inc / maxDaily) * 100)
                const hasData = exp > 0 || inc > 0
                return (
                  <div key={i} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '1px',
                    flex: '0 0 auto', width: `${Math.max(100 / daysInMonth, 2.5)}%`,
                    minWidth: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1px', height: '72px' }}>
                      {/* Expense bar */}
                      <div style={{
                        width: '4px', borderRadius: '2px 2px 0 0',
                        height: `${expPct}%`, minHeight: hasData && exp > 0 ? '3px' : '0',
                        background: exp > 0 ? '#d94f3d' : 'transparent'
                      }} />
                      {/* Income bar */}
                      <div style={{
                        width: '4px', borderRadius: '2px 2px 0 0',
                        height: `${incPct}%`, minHeight: hasData && inc > 0 ? '3px' : '0',
                        background: inc > 0 ? '#0d7a5f' : 'transparent'
                      }} />
                    </div>
                    {/* Day label — only show every 5 days */}
                    <span style={{
                      fontSize: '7px', color: '#ccc', fontWeight: 600
                    }}>
                      {(i + 1) % 5 === 0 ? i + 1 : ''}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Expense breakdown */}
          {expenseCategories.length > 0 && (
            <div>
              <p style={{
                fontSize: '10px', fontWeight: 700, color: '#888',
                letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: '8px', paddingLeft: '4px'
              }}>
                💸 PERBELANJAAN MENGIKUT KATEGORI
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {expenseCategories.map((cat, i) => {
                  const pct = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
                  return (
                    <div key={i} style={{
                      background: 'white', borderRadius: '16px', padding: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: '#fdf0ee', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '18px', flexShrink: 0
                        }}>
                          {cat.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f1f1a' }}>
                            {cat.name}
                          </p>
                          <p style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>
                            {cat.count} transaksi
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: '#d94f3d' }}>
                            RM {toRM(cat.total)}
                          </p>
                          <p style={{ fontSize: '10px', color: '#888' }}>{pct}%</p>
                        </div>
                      </div>
                      <div style={{ height: '4px', background: '#f5f5f5', borderRadius: '2px' }}>
                        <div style={{
                          height: '100%', borderRadius: '2px', width: `${pct}%`,
                          background: 'linear-gradient(90deg, #d94f3d, #e8765f)'
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Income breakdown */}
          {incomeCategories.length > 0 && (
            <div>
              <p style={{
                fontSize: '10px', fontWeight: 700, color: '#888',
                letterSpacing: '1px', textTransform: 'uppercase',
                marginBottom: '8px', paddingLeft: '4px'
              }}>
                💰 PENDAPATAN MENGIKUT KATEGORI
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {incomeCategories.map((cat, i) => {
                  const pct = totalIncome > 0 ? Math.round((cat.total / totalIncome) * 100) : 0
                  return (
                    <div key={i} style={{
                      background: 'white', borderRadius: '16px', padding: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '10px',
                          background: '#e6f5f1', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: '18px', flexShrink: 0
                        }}>
                          {cat.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f1f1a' }}>
                            {cat.name}
                          </p>
                          <p style={{ fontSize: '10px', color: '#888', marginTop: '1px' }}>
                            {cat.count} transaksi
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '13px', fontWeight: 800, color: '#0d7a5f' }}>
                            RM {toRM(cat.total)}
                          </p>
                          <p style={{ fontSize: '10px', color: '#888' }}>{pct}%</p>
                        </div>
                      </div>
                      <div style={{ height: '4px', background: '#f5f5f5', borderRadius: '2px' }}>
                        <div style={{
                          height: '100%', borderRadius: '2px', width: `${pct}%`,
                          background: 'linear-gradient(90deg, #0d7a5f, #2aa87e)'
                        }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e8eeec',
        display: 'flex', padding: '10px 0',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        zIndex: 10
      }}>
        {[
{ href: '/dashboard', icon: '🏠', label: 'Utama' },
          { href: '/rekod',     icon: '📋', label: 'Rekod' },
          { href: '/laporan',   icon: '📊', label: 'Laporan', active: true },
          { href: '/tetapan',   icon: '⚙️', label: 'Tetapan' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '2px', textDecoration: 'none',
            color: item.active ? '#0d7a5f' : '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}
