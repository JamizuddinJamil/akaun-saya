import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Load transaction
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId: user.id },
    include: { category: true }
  })

  if (!transaction) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Transaction not found</p>
        <Link href="/dashboard" style={{ color: '#0d7a5f' }}>Back to Dashboard</Link>
      </div>
    )
  }

  const toRM = (sen: number) => (sen / 100).toFixed(2)

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 40px'
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
          Detail Transaksi
        </h1>
      </div>

      {/* Amount card */}
      <div style={{
        background: transaction.type === 'INCOME' ? '#0d7a5f' : '#d94f3d',
        borderRadius: '20px', padding: '24px',
        color: 'white', marginBottom: '16px', textAlign: 'center'
      }}>
        <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '8px' }}>
          {transaction.type === 'INCOME' ? 'PENDAPATAN' : 'PERBELANJAAN'}
        </p>
        <h2 style={{ fontSize: '36px', fontWeight: 800 }}>
          {transaction.type === 'INCOME' ? '+' : '-'} RM {toRM(transaction.amount)}
        </h2>
      </div>

      {/* Details */}
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '16px', marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          paddingBottom: '12px', borderBottom: '1px solid #e8eeec'
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: transaction.type === 'INCOME' ? '#e6f5f1' : '#fdf0ee',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px'
          }}>
            {transaction.category?.icon || '💰'}
          </div>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f1f1a' }}>
              {transaction.category?.name || 'Uncategorized'}
            </p>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
              {new Date(transaction.date).toLocaleDateString('ms-MY', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {transaction.note && (
          <div style={{ paddingTop: '12px' }}>
            <p style={{
              fontSize: '11px', fontWeight: 700, color: '#888',
              marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              Nota
            </p>
            <p style={{ fontSize: '13px', color: '#0f1f1a', lineHeight: '1.6' }}>
              {transaction.note}
            </p>
          </div>
        )}
      </div>

      {/* Receipt */}
      {transaction.receiptUrl && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#888',
            marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            Resit
          </p>
          <div style={{
            background: 'white', borderRadius: '16px',
            padding: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <a 
              href={transaction.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', position: 'relative', width: '100%', height: '300px' }}
            >
              <img
                src={transaction.receiptUrl}
                alt="Receipt"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'contain', borderRadius: '12px'
                }}
              />
            </a>
            
            <a 
              href={transaction.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                padding: '8px', fontSize: '12px',
                color: '#0d7a5f', fontWeight: 700,
                textDecoration: 'none', marginTop: '8px'
              }}
            >
              Lihat Saiz Penuh →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}