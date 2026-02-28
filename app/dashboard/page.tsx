export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SwipeableTransaction from '@/components/SwipeableTransaction'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if user exists in database, create if not
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })
  
  if (!dbUser) {
    // First time login - create user record
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.email!.split('@')[0],
        onboardingCompleted: false,
      }
    })
  }
  
  if (!dbUser.onboardingCompleted) {
    redirect('/onboarding')
  }

  const now       = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

  // Today range
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  // All this month
  const allTransactions = await prisma.transaction.findMany({
    where: { userId: user.id, date: { gte: startDate, lte: endDate } },
    include: { category: true },
    orderBy: { date: 'desc' },
  })

  // Query unpaid receivables
const unpaidReceivables = await prisma.receivable.findMany({
  where: { userId: user.id, status: 'UNPAID' },
  orderBy: { dueDate: 'asc' }
})

const totalReceivables = unpaidReceivables.reduce((sum, r) => sum + r.amount, 0)
const overdueCount = unpaidReceivables.filter(r => r.dueDate && new Date(r.dueDate) < now).length

  // Today's transactions
  const todayTransactions = allTransactions.filter(tx =>
    tx.date >= todayStart && tx.date <= todayEnd
  )

  // Totals
  let totalIncome  = 0
  let totalExpense = 0
  for (const tx of allTransactions) {
    if (tx.type === 'INCOME') totalIncome  += tx.amount
    else                      totalExpense += tx.amount
  }
  const netProfit  = totalIncome - totalExpense

// Today's spending & income
  const todaySpend  = todayTransactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const todayIncome = todayTransactions
    .filter(tx => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.amount, 0)

  // Top spending category
  const categoryMap = new Map<string, { name: string; icon: string; total: number }>()
  for (const tx of allTransactions) {
    if (tx.type !== 'EXPENSE') continue
    const existing = categoryMap.get(tx.categoryId)
    if (existing) existing.total += tx.amount
    else categoryMap.set(tx.categoryId, {
      name: tx.category.name, icon: tx.category.icon, total: tx.amount
    })
  }
  const topCategory = Array.from(categoryMap.values())
    .sort((a, b) => b.total - a.total)[0] || null
  const topCategoryPct = topCategory && totalExpense > 0
    ? Math.round((topCategory.total / totalExpense) * 100) : 0

  // Recent 5
  const recentTransactions = allTransactions.slice(0, 5)

  const toRM = (sen: number) => (sen / 100).toFixed(2)

  const monthNames = [
    'Januari','Februari','Mac','April','Mei','Jun',
    'Julai','Ogos','September','Oktober','November','Disember'
  ]
  const currentMonth = `${monthNames[now.getMonth()]} ${now.getFullYear()}`
  const isProfit     = netProfit >= 0

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px',
      background: '#f5f7f6', minHeight: '100vh'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '20px 0 16px'
      }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
            🧾 AkaunSaya.my
          </h1>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            {currentMonth}
          </p>
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#0d7a5f', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '16px', color: 'white',
          fontWeight: 800
        }}>
          {user.email?.[0].toUpperCase()}
        </div>
      </div>

      {/* BENTO GRID */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Hero card — Net Profit */}
        <div style={{
          background: isProfit
            ? 'linear-gradient(135deg, #0d7a5f 0%, #0a5f4a 100%)'
            : 'linear-gradient(135deg, #d94f3d 0%, #b03d2d 100%)',
          borderRadius: '24px', padding: '24px',
          color: 'white', position: 'relative', overflow: 'hidden'
        }}>
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            width: '120px', height: '120px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)'
          }} />
          <div style={{
            position: 'absolute', bottom: '-40px', right: '40px',
            width: '160px', height: '160px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)'
          }} />

          <p style={{
            fontSize: '10px', opacity: 0.7, letterSpacing: '2px',
            textTransform: 'uppercase', marginBottom: '6px'
          }}>
            UNTUNG BERSIH — {currentMonth}
          </p>
          <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '4px', letterSpacing: '-1px' }}>
            RM {toRM(Math.abs(netProfit))}
          </h2>
          {!isProfit && (
            <p style={{ fontSize: '12px', opacity: 0.8, marginBottom: '16px' }}>
              ⚠️ Perbelanjaan melebihi pendapatan
            </p>
          )}
          {isProfit && (
            <p style={{ fontSize: '12px', opacity: 0.7, marginBottom: '16px' }}>
              ✨ Tahniah! Perniagaan untung bulan ini
            </p>
          )}

          {/* Income / Expense row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.12)',
              borderRadius: '14px', padding: '12px'
            }}>
              <p style={{ fontSize: '9px', opacity: 0.7, marginBottom: '4px', letterSpacing: '1px' }}>
                💰 PENDAPATAN
              </p>
              <p style={{ fontWeight: 800, fontSize: '16px' }}>
                RM {toRM(totalIncome)}
              </p>
            </div>
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.12)',
              borderRadius: '14px', padding: '12px'
            }}>
              <p style={{ fontSize: '9px', opacity: 0.7, marginBottom: '4px', letterSpacing: '1px' }}>
                💸 PERBELANJAAN
              </p>
              <p style={{ fontWeight: 800, fontSize: '16px' }}>
                RM {toRM(totalExpense)}
              </p>
            </div>
          </div>
        </div>

        {/* 2-col bento row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

{/* Today's spending */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <p style={{
              fontSize: '9px', fontWeight: 700, color: '#888',
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px'
            }}>
              📅 HARI INI
            </p>
            {/* Income & Expense row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <p style={{ fontSize: '9px', color: '#0d7a5f', fontWeight: 700, marginBottom: '2px' }}>
                  MASUK
                </p>
                <p style={{ fontSize: '12px', fontWeight: 800, color: '#0d7a5f' }}>
                  +{toRM(todayIncome)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '9px', color: '#d94f3d', fontWeight: 700, marginBottom: '2px' }}>
                  KELUAR
                </p>
                <p style={{ fontSize: '12px', fontWeight: 800, color: '#d94f3d' }}>
                  -{toRM(todaySpend)}
                </p>
              </div>
            </div>
            {/* Divider */}
            <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '6px' }} />
            {/* Net */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '9px', color: '#888', fontWeight: 700 }}>
                {todayTransactions.length} transaksi
              </p>
              <p style={{
                fontSize: '12px', fontWeight: 900,
                color: (todayIncome - todaySpend) >= 0 ? '#0d7a5f' : '#d94f3d'
              }}>
                RM {toRM(Math.abs(todayIncome - todaySpend))}
              </p>
            </div>
          </div>

          {/* Monthly transaction count */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <p style={{
              fontSize: '9px', fontWeight: 700, color: '#888',
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
            }}>
              📆 BULAN INI
            </p>
            <p style={{ fontSize: '20px', fontWeight: 900, color: '#0f1f1a', marginBottom: '2px' }}>
              {allTransactions.length}
            </p>
            <p style={{ fontSize: '10px', color: '#888' }}>
              rekod disimpan
            </p>
          </div>
        </div>

        </div>

        {/* Hutang Pelanggan card */}
        <Link href="/hutang" style={{ textDecoration: 'none' }}>
          <div style={{
            background: totalReceivables === 0 ? 'white' : (overdueCount > 0 ? '#fef2f2' : '#fffbeb'),
            border: totalReceivables === 0 ? '1.5px solid #e8eeec' : (overdueCount > 0 ? '1.5px solid #fca5a5' : '1.5px solid #fbbf24'),
            borderRadius: '20px', padding: '16px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: totalReceivables === 0 ? '#f5f5f5' : (overdueCount > 0 ? '#fee2e2' : '#fef3c7'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', flexShrink: 0
              }}>
                📋
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '10px', fontWeight: 700,
                  color: totalReceivables === 0 ? '#888' : (overdueCount > 0 ? '#dc2626' : '#92400e'),
                  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px'
                }}>
                  HUTANG PELANGGAN
                </p>
                {totalReceivables === 0 ? (
                  <p style={{ fontSize: '11px', color: '#888' }}>
                    Tiada hutang 🎉
                  </p>
                ) : (
                  <>
                    <p style={{
                      fontSize: '18px', fontWeight: 900,
                      color: overdueCount > 0 ? '#dc2626' : '#92400e',
                      marginBottom: '2px'
                    }}>
                      RM {toRM(totalReceivables)}
                    </p>
                    <p style={{ fontSize: '10px', color: '#888' }}>
                      {unpaidReceivables.length} pelanggan
                      {overdueCount > 0 && (
                        <span style={{
                          marginLeft: '6px', background: '#dc2626',
                          color: 'white', padding: '2px 6px',
                          borderRadius: '4px', fontSize: '9px', fontWeight: 700
                        }}>
                          {overdueCount} LEWAT
                        </span>
                      )}
                    </p>
                  </>
                )}
              </div>
              <span style={{ color: '#ccc', fontSize: '18px' }}>›</span>
            </div>
          </div>
        </Link>

        {/* Top spending category */}
        {topCategory && (
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <p style={{
              fontSize: '9px', fontWeight: 700, color: '#888',
              letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px'
            }}>
              🔥 PERBELANJAAN TERTINGGI
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: '#fdf0ee', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px', flexShrink: 0
              }}>
                {topCategory.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 800, color: '#0f1f1a' }}>
                  {topCategory.name}
                </p>
                <p style={{ fontSize: '11px', color: '#888', marginTop: '1px' }}>
                  {topCategoryPct}% daripada jumlah belanja
                </p>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 800, color: '#d94f3d' }}>
                RM {toRM(topCategory.total)}
              </p>
            </div>
            {/* Progress bar */}
            <div style={{
              height: '6px', background: '#f0f0f0',
              borderRadius: '3px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                width: `${topCategoryPct}%`,
                background: 'linear-gradient(90deg, #d94f3d, #e8765f)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}

        {/* Recent transactions */}
        <div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '10px', paddingTop: '4px'
          }}>
            <p style={{
              fontSize: '10px', fontWeight: 700, color: '#888',
              letterSpacing: '1px', textTransform: 'uppercase'
            }}>
              TRANSAKSI TERKINI
            </p>
            <Link href="/rekod" style={{
              fontSize: '11px', color: '#0d7a5f',
              fontWeight: 700, textDecoration: 'none'
            }}>
              Semua →
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: '20px', padding: '32px',
              textAlign: 'center', color: '#666',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
              <p style={{ fontSize: '36px', marginBottom: '8px' }}>📭</p>
              <p style={{ fontSize: '13px', fontWeight: 600 }}>Tiada rekod lagi</p>
              <p style={{ fontSize: '11px', marginTop: '4px', color: '#888' }}>
                Tekan ➕ untuk tambah perbelanjaan pertama
              </p>
            </div>
          ) : (
            <div style={{
              background: 'white', borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}>
{recentTransactions.map((tx: any, index: number) => (
                <div key={tx.id} style={{
                  borderBottom: index < recentTransactions.length - 1
                    ? '1px solid #f0f0f0' : 'none',
                  padding: '0 4px'
                }}>
                  <SwipeableTransaction tx={tx} />
                </div>
              ))}
            </div>
          )}
            
        </div>

      {/* FAB */}
      <Link href="/tambah" style={{
        position: 'fixed', bottom: '80px', right: '20px',
        width: '56px', height: '56px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #0d7a5f, #0a5f4a)',
        color: 'white', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '28px', fontWeight: 300,
        textDecoration: 'none', zIndex: 20,
        boxShadow: '0 4px 20px rgba(13,122,95,0.45)'
      }}>
        +
      </Link>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e8eeec',
        display: 'flex', padding: '10px 0',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        zIndex: 10
      }}>
        {[
          { href: '/dashboard', icon: '🏠', label: 'Utama',   active: true },
          { href: '/rekod',     icon: '📋', label: 'Rekod' },
          { href: '/laporan',   icon: '📊', label: 'Laporan' },
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