'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id:   string
  name: string
  icon: string
  type: string
}

interface Props {
  categories: Category[]
}

function parseAmountToSen(val: string): number {
  const cleaned = val.replace(/[^0-9.]/g, '')
  return Math.round((parseFloat(cleaned) || 0) * 100)
}

export default function AddExpenseForm({ categories }: Props) {
  const router = useRouter()

  const [type,          setType]          = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'RECEIVABLE'>('CASH')
  const [amount,        setAmount]        = useState('')
  const [categoryId,    setCategoryId]    = useState('')
  const [note,          setNote]          = useState('')
  const [date,          setDate]          = useState(new Date().toISOString().split('T')[0])
  const [receiptUrl,    setReceiptUrl]    = useState<string | null>(null)
  const [uploading,     setUploading]     = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  // Receivable fields
  const [customerName,  setCustomerName]  = useState('')
  const [phoneNumber,   setPhoneNumber]   = useState('')
  const [dueDate,       setDueDate]       = useState('')

  const cameraRef  = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('receipt', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReceiptUrl(data.url)
    } catch (err: any) {
      setError(err.message ?? 'Gagal muat naik resit')
    } finally {
      setUploading(false)
      if (cameraRef.current)  cameraRef.current.value  = ''
      if (galleryRef.current) galleryRef.current.value = ''
    }
  }

  async function handleSave() {
    setError(null)
    const amountSen = parseAmountToSen(amount)
    if (amountSen <= 0)  { setError('Sila masukkan jumlah yang betul'); return }
    
    // If INCOME + RECEIVABLE, validate customer fields
    if (type === 'INCOME' && paymentMethod === 'RECEIVABLE') {
      if (!customerName.trim()) { setError('Sila masukkan nama pelanggan'); return }
      
      setSaving(true)
      try {
        const res = await fetch('/api/receivables', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerName: customerName.trim(),
            phoneNumber: phoneNumber.trim() || undefined,
            amount: amountSen,
            dueDate: dueDate || undefined,
            note: note.trim() || undefined,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        router.push('/dashboard')
        router.refresh()
      } catch (err: any) {
        setError(err.message ?? 'Gagal simpan. Cuba lagi.')
      } finally {
        setSaving(false)
      }
      return
    }

    // Normal transaction flow (EXPENSE or INCOME + CASH)
    if (!categoryId) { setError('Sila pilih kategori'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/transactions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type, categoryId,
          amount: amountSen,
          date, note: note.trim() || undefined,
          receiptUrl: receiptUrl || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'Gagal simpan. Cuba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = categories.filter(c => c.type === type)
  const isReceivable = type === 'INCOME' && paymentMethod === 'RECEIVABLE'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>

      {/* Type toggle */}
      <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '16px', padding: '4px', gap: '4px' }}>
        {(['EXPENSE', 'INCOME'] as const).map(t => (
          <button key={t} onClick={() => { setType(t); setCategoryId(''); setPaymentMethod('CASH') }} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
            borderRadius: '12px', fontWeight: 800, fontSize: '14px', transition: 'all 0.2s',
            background: type === t ? 'white' : 'transparent',
            color: type === t ? (t === 'EXPENSE' ? '#d94f3d' : '#0d7a5f') : '#888',
            boxShadow: type === t ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
          }}>
            {t === 'EXPENSE' ? '💸 Perbelanjaan' : '💰 Pendapatan'}
          </button>
        ))}
      </div>

      {/* Payment Method - only for INCOME */}
      {type === 'INCOME' && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
          }}>
            Kaedah Bayaran
          </p>
          <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '16px', padding: '4px', gap: '4px' }}>
            {([
              { value: 'CASH', label: '💵 Tunai / Transfer', subtitle: 'Sudah Terima' },
              { value: 'RECEIVABLE', label: '📋 Hutang', subtitle: 'Belum Bayar' }
            ] as const).map(pm => (
              <button key={pm.value} onClick={() => setPaymentMethod(pm.value)} style={{
                flex: 1, padding: '10px 8px', border: 'none', cursor: 'pointer',
                borderRadius: '12px', fontWeight: 700, fontSize: '12px', transition: 'all 0.2s',
                background: paymentMethod === pm.value ? 'white' : 'transparent',
                color: paymentMethod === pm.value ? '#0d7a5f' : '#888',
                boxShadow: paymentMethod === pm.value ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                display: 'flex', flexDirection: 'column', gap: '2px'
              }}>
                <span>{pm.label}</span>
                <span style={{ fontSize: '9px', opacity: 0.7 }}>{pm.subtitle}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Customer Info - only for RECEIVABLE */}
      {isReceivable && (
        <div style={{
          background: '#fffbeb', border: '1.5px solid #fbbf24',
          borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>📋</span>
            <p style={{ fontSize: '12px', fontWeight: 800, color: '#92400e' }}>
              Maklumat Pelanggan
            </p>
          </div>

          {/* Customer Name */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#78350f', marginBottom: '6px' }}>
              NAMA PELANGGAN *
            </p>
            <input
              type="text"
              placeholder="Cth: Ahmad bin Ali"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', fontSize: '13px',
                border: '2px solid #fbbf24', borderRadius: '10px', outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#78350f', marginBottom: '6px' }}>
              NO. TELEFON (Pilihan)
            </p>
            <input
              type="tel"
              placeholder="Cth: 0123456789"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', fontSize: '13px',
                border: '2px solid #fbbf24', borderRadius: '10px', outline: 'none',
                background: 'white'
              }}
            />
          </div>

          {/* Due Date */}
          <div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#78350f', marginBottom: '6px' }}>
              TARIKH JATUH TEMPO (Pilihan)
            </p>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px', fontSize: '13px',
                border: '2px solid #fbbf24', borderRadius: '10px', outline: 'none',
                background: 'white'
              }}
            />
          </div>
        </div>
      )}

      {/* Receipt upload - hide for receivables */}
      {!isReceivable && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
          }}>
            Resit (Pilihan)
          </p>

          {receiptUrl ? (
            <div style={{
              background: 'white', border: '1.5px solid #b2dfdb',
              borderRadius: '16px', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                <img src={receiptUrl} alt="Receipt preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', top: '8px', left: '8px',
                  background: '#0d7a5f', color: 'white',
                  borderRadius: '8px', padding: '4px 8px',
                  fontSize: '11px', fontWeight: 700
                }}>
                  ✅ Resit disimpan
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', padding: '10px' }}>
                <button onClick={() => cameraRef.current?.click()} disabled={uploading} style={{
                  flex: 1, padding: '8px', border: '1.5px solid #e8eeec',
                  borderRadius: '10px', background: '#f9f9f9', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 700, color: '#666'
                }}>
                  📷 Kamera
                </button>
                <button onClick={() => galleryRef.current?.click()} disabled={uploading} style={{
                  flex: 1, padding: '8px', border: '1.5px solid #e8eeec',
                  borderRadius: '10px', background: '#f9f9f9', cursor: 'pointer',
                  fontSize: '11px', fontWeight: 700, color: '#666'
                }}>
                  🖼️ Galeri
                </button>
                <button onClick={() => setReceiptUrl(null)} style={{
                  padding: '8px 12px', border: '1.5px solid #fca5a5',
                  borderRadius: '10px', background: '#fff5f5', cursor: 'pointer', fontSize: '14px'
                }}>
                  🗑️
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => cameraRef.current?.click()} disabled={uploading} style={{
                flex: 1, border: '2px dashed #b2dfdb', borderRadius: '16px',
                padding: '20px 8px', background: '#f0faf7', cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ fontSize: '28px' }}>{uploading ? '⏳' : '📷'}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d7a5f' }}>
                  {uploading ? 'Uploading...' : 'Kamera'}
                </span>
              </button>
              <button onClick={() => galleryRef.current?.click()} disabled={uploading} style={{
                flex: 1, border: '2px dashed #b2dfdb', borderRadius: '16px',
                padding: '20px 8px', background: '#f0faf7', cursor: uploading ? 'not-allowed' : 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ fontSize: '28px' }}>🖼️</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d7a5f' }}>Galeri</span>
              </button>
            </div>
          )}

          <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} style={{ display: 'none' }} />
          <input ref={galleryRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </div>
      )}

      {/* Amount */}
      <div>
        <p style={{
          fontSize: '11px', fontWeight: 700, color: '#888',
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
        }}>
          Jumlah (RM)
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'white', border: '2px solid #e8eeec',
          borderRadius: '16px', padding: '12px 16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#888' }}>RM</span>
          <input
            type="number" inputMode="decimal" placeholder="0.00"
            value={amount} onChange={e => setAmount(e.target.value)}
            style={{
              flex: 1, fontSize: '24px', fontWeight: 800, color: '#0f1f1a',
              border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'monospace'
            }}
          />
        </div>
      </div>

      {/* Categories - hide for receivables */}
      {!isReceivable && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
          }}>
            Kategori
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {filtered.map(cat => (
              <button key={cat.id} onClick={() => setCategoryId(cat.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '4px', padding: '10px 4px', cursor: 'pointer',
                border: `2px solid ${categoryId === cat.id ? '#0d7a5f' : '#e8eeec'}`,
                borderRadius: '14px',
                background: categoryId === cat.id ? '#e6f5f1' : 'white',
                transition: 'all 0.15s'
              }}>
                <span style={{ fontSize: '22px' }}>{cat.icon}</span>
                <span style={{
                  fontSize: '9px', fontWeight: 700, textAlign: 'center',
                  color: categoryId === cat.id ? '#0d7a5f' : '#666',
                  lineHeight: '1.2'
                }}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date - hide for receivables (uses dueDate instead) */}
      {!isReceivable && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#888',
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
          }}>
            Tarikh
          </p>
          <input
            type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px', fontSize: '14px', fontWeight: 600,
              border: '2px solid #e8eeec', borderRadius: '14px', outline: 'none',
              background: 'white', color: '#0f1f1a'
            }}
          />
        </div>
      )}

      {/* Note */}
      <div>
        <p style={{
          fontSize: '11px', fontWeight: 700, color: '#888',
          letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px'
        }}>
          Nota (Pilihan)
        </p>
        <textarea
          placeholder={isReceivable ? 'Cth: Deposit majlis 50%, baki bayar selepas event' : 'Cth: Bayar sewa kedai untuk bulan April'}
          value={note} onChange={e => setNote(e.target.value)}
          maxLength={500} rows={3}
          style={{
            width: '100%', padding: '12px 16px', fontSize: '13px',
            border: '2px solid #e8eeec', borderRadius: '14px', outline: 'none',
            background: 'white', color: '#0f1f1a', resize: 'none'
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fdf0ee', border: '1px solid #fca5a5',
          color: '#dc2626', padding: '12px 16px',
          borderRadius: '12px', fontSize: '13px', fontWeight: 500
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Save button */}
      <button onClick={handleSave} disabled={saving || uploading} style={{
        position: 'fixed', bottom: '24px', left: '16px', right: '16px',
        maxWidth: '398px', margin: '0 auto',
        padding: '16px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
        background: saving ? '#9ca3af' : (isReceivable ? '#fbbf24' : '#0d7a5f'),
        color: 'white', borderRadius: '18px', fontSize: '16px',
        fontWeight: 800,
        boxShadow: isReceivable ? '0 4px 20px rgba(251,191,36,0.35)' : '0 4px 20px rgba(13,122,95,0.35)'
      }}>
        {saving ? '⏳ Sedang simpan...' : (isReceivable ? '📋 Simpan Hutang Pelanggan' : `💾 Simpan ${type === 'EXPENSE' ? 'Perbelanjaan' : 'Pendapatan'}`)}
      </button>

    </div>
  )
}