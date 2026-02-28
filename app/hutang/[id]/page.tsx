import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarkAsPaidButton from '@/components/MarkAsPaidButton'

export default async function ReceivableDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const receivable = await prisma.receivable.findFirst({
    where: { id, userId: user.id }
  })

  if (!receivable) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Rekod tidak dijumpai</p>
        <Link href="/hutang" style={{ color: '#0d7a5f' }}>Kembali</Link>
      </div>
    )
  }

  const toRM = (sen: number) => (sen / 100).toFixed(2)
  const now = new Date()
  const isOverdue = receivable.dueDate && new Date(receivable.dueDate) < now
  const isPaid = receivable.status === 'PAID'

// WhatsApp link
const whatsappLink = receivable.phoneNumber
  ? (() => {
      let cleaned = receivable.phoneNumber.replace(/[^0-9]/g, '')

      // Buang 0 depan kalau ada
      if (cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1)
      }

      // Tambah 60 kalau belum ada
      if (!cleaned.startsWith('60')) {
        cleaned = '60' + cleaned
      }

      return `https://wa.me/${cleaned}?text=${encodeURIComponent(
        `Assalamualaikum ${receivable.customerName}, ini peringatan untuk bayaran RM ${toRM(receivable.amount)}. Terima kasih.`
      )}`
    })()
  : null

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
        <Link href="/hutang" style={{
          width: '36px', height: '36px', background: 'white',
          border: '2px solid #e8eeec', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', textDecoration: 'none', flexShrink: 0,
          color: 'inherit'
        }}>
          ←
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
          Detail Hutang
        </h1>
      </div>

      {/* Status card */}
      <div style={{
        background: isPaid
          ? 'linear-gradient(135deg, #0d7a5f 0%, #0a5f4a 100%)'
          : isOverdue
          ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        borderRadius: '24px', padding: '24px',
        color: 'white', marginBottom: '16px', textAlign: 'center'
      }}>
        <p style={{ fontSize: '11px', opacity: 0.7, marginBottom: '8px' }}>
          {isPaid ? 'SUDAH DIBAYAR' : isOverdue ? 'LEWAT BAYARAN' : 'BELUM BAYAR'}
        </p>
        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '4px' }}>
          RM {toRM(receivable.amount)}
        </h2>
        {!isPaid && isOverdue && (
          <p style={{ fontSize: '12px', opacity: 0.8 }}>
            ⚠️ Tarikh jatuh tempo telah lepas
          </p>
        )}
      </div>

      {/* Customer info */}
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '16px', marginBottom: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <p style={{
          fontSize: '10px', fontWeight: 700, color: '#888',
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px'
        }}>
          MAKLUMAT PELANGGAN
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Nama</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1f1a' }}>
              {receivable.customerName}
            </p>
          </div>

          {receivable.phoneNumber && (
            <div>
              <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>No. Telefon</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1f1a' }}>
                {receivable.phoneNumber}
              </p>
            </div>
          )}

          {receivable.dueDate && (
            <div>
              <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Tarikh Jatuh Tempo</p>
              <p style={{
                fontSize: '14px', fontWeight: 700,
                color: isOverdue ? '#dc2626' : '#0f1f1a'
              }}>
                {new Date(receivable.dueDate).toLocaleDateString('ms-MY', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
                {isOverdue && !isPaid && (
                  <span style={{
                    marginLeft: '8px', background: '#dc2626',
                    color: 'white', padding: '2px 8px',
                    borderRadius: '6px', fontSize: '10px'
                  }}>
                    LEWAT
                  </span>
                )}
              </p>
            </div>
          )}

          {receivable.note && (
            <div>
              <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Nota</p>
              <p style={{ fontSize: '13px', color: '#0f1f1a', lineHeight: '1.6' }}>
                {receivable.note}
              </p>
            </div>
          )}

          <div>
            <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Tarikh Rekod</p>
            <p style={{ fontSize: '13px', color: '#0f1f1a' }}>
              {new Date(receivable.createdAt).toLocaleDateString('ms-MY', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </p>
          </div>

          {isPaid && receivable.paidAt && (
            <div>
              <p style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>Tarikh Dibayar</p>
              <p style={{ fontSize: '13px', color: '#0d7a5f', fontWeight: 700 }}>
                {new Date(receivable.paidAt).toLocaleDateString('ms-MY', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions - only show if unpaid */}
      {!isPaid && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Mark as Paid button */}
          <MarkAsPaidButton receivableId={receivable.id} amount={receivable.amount} />

          {/* WhatsApp reminder button */}
          {whatsappLink && (
            
               <a
                href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', textAlign: 'center',
                background: '#25D366', color: 'white',
                padding: '14px', borderRadius: '14px',
                fontSize: '14px', fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(37,211,102,0.3)'
              }}
            >
              📱 Hantar Peringatan WhatsApp
            </a>
          )}
        </div>
      )}

    </div>
  )
}