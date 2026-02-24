import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function HutangPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const receivables = await prisma.receivable.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' }
  })

  const unpaid = receivables.filter(r => r.status === 'UNPAID')
  const paid = receivables.filter(r => r.status === 'PAID')

  const now = new Date()
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
          fontSize: '16px', textDecoration: 'none', flexShrink: 0,
          color: 'inherit'
        }}>
          ←
        </Link>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
            Hutang Pelanggan
          </h1>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            {receivables.length} jumlah rekod
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <div style={{
          background: 'white', borderRadius: '16px', padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
        }}>
          <p style={{ fontSize: '9px', color: '#888', fontWeight: 700, marginBottom: '4px' }}>
            📋 BELUM BAYAR
          </p>
          <p style={{ fontSize: '16px', fontWeight: 900, color: '#92400e' }}>
            RM {toRM(unpaid.reduce((sum, r) => sum + r.amount, 0))}
          </p>
          <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
            {unpaid.length} pelanggan
          </p>
        </div>

        <div style={{
          background: 'white', borderRadius: '16px', padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
        }}>
          <p style={{ fontSize: '9px', color: '#888', fontWeight: 700, marginBottom: '4px' }}>
            ✅ SUDAH BAYAR
          </p>
          <p style={{ fontSize: '16px', fontWeight: 900, color: '#0d7a5f' }}>
            RM {toRM(paid.reduce((sum, r) => sum + r.amount, 0))}
          </p>
          <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
            {paid.length} pelanggan
          </p>
        </div>
      </div>

      {/* Unpaid list */}
      {unpaid.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '8px', paddingLeft: '4px'
          }}>
            BELUM BAYAR
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {unpaid.map(r => {
              const isOverdue = r.dueDate && new Date(r.dueDate) < now
              return (
                <Link key={r.id} href={`/hutang/${r.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white', borderRadius: '16px', padding: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: isOverdue ? '1.5px solid #fca5a5' : '1.5px solid #e8eeec'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        background: isOverdue ? '#fee2e2' : '#fef3c7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', flexShrink: 0
                      }}>
                        {isOverdue ? '⚠️' : '📋'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 800, color: '#0f1f1a' }}>
                          {r.customerName}
                        </p>
                        <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                          {r.dueDate ? (
                            <>
                              Jatuh tempo: {new Date(r.dueDate).toLocaleDateString('ms-MY', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                              {isOverdue && (
                                <span style={{
                                  marginLeft: '6px', background: '#dc2626',
                                  color: 'white', padding: '1px 6px',
                                  borderRadius: '4px', fontSize: '9px', fontWeight: 700
                                }}>
                                  LEWAT
                                </span>
                              )}
                            </>
                          ) : (
                            'Tiada tarikh jatuh tempo'
                          )}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: '14px', fontWeight: 900,
                          color: isOverdue ? '#dc2626' : '#92400e'
                        }}>
                          RM {toRM(r.amount)}
                        </p>
                        <span style={{ fontSize: '12px', color: '#ccc' }}>›</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Paid list */}
      {paid.length > 0 && (
        <div>
          <p style={{
            fontSize: '10px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase',
            marginBottom: '8px', paddingLeft: '4px'
          }}>
            SUDAH BAYAR
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {paid.map(r => (
              <div key={r.id} style={{
                background: 'white', borderRadius: '16px', padding: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', opacity: 0.7
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: '#e6f5f1', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '20px', flexShrink: 0
                  }}>
                    ✅
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#0f1f1a' }}>
                      {r.customerName}
                    </p>
                    <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                      Dibayar: {r.paidAt ? new Date(r.paidAt).toLocaleDateString('ms-MY') : '-'}
                    </p>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 900, color: '#0d7a5f' }}>
                    RM {toRM(r.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {receivables.length === 0 && (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '48px',
          textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1f1a' }}>
            Tiada rekod hutang
          </p>
          <p style={{ fontSize: '12px', marginTop: '6px', color: '#888' }}>
            Hutang pelanggan akan muncul di sini
          </p>
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
          { href: '/laporan',   icon: '📊', label: 'Laporan' },
          { href: '/tetapan',   icon: '⚙️', label: 'Tetapan' },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '2px', textDecoration: 'none',
            color: '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}