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

  const [type,       setType]       = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [amount,     setAmount]     = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [note,       setNote]       = useState('')
  const [date,       setDate]       = useState(new Date().toISOString().split('T')[0])
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [uploading,  setUploading]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)

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
    }
  }

  async function handleSave() {
    setError(null)
    const amountSen = parseAmountToSen(amount)
    if (amountSen <= 0)  { setError('Sila masukkan jumlah yang betul'); return }
    if (!categoryId)     { setError('Sila pilih kategori'); return }

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>

      {/* Type toggle */}
      <div style={{ display: 'flex', background: '#f0f0f0', borderRadius: '16px', padding: '4px', gap: '4px' }}>
        {(['EXPENSE', 'INCOME'] as const).map(t => (
          <button key={t} onClick={() => { setType(t); setCategoryId('') }} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer',
            borderRadius: '12px', fontWeight: 800, fontSize: '14px',
            fontFamily: 'sans-serif', transition: 'all 0.2s',
            background: type === t ? 'white' : 'transparent',
            color: type === t ? (t === 'EXPENSE' ? '#d94f3d' : '#0d7a5f') : '#888',
            boxShadow: type === t ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
          }}>
            {t === 'EXPENSE' ? '💸 Perbelanjaan' : '💰 Pendapatan'}
          </button>
        ))}
      </div>

      {/* Receipt upload */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Resit (Pilihan)
        </p>
        {receiptUrl ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#e6f5f1', border: '1.5px solid #b2dfdb',
            borderRadius: '16px', padding: '14px'
          }}>
            <span style={{ fontSize: '24px' }}>✅</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1f1a' }}>Resit disimpan</p>
              <p style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>Tekan untuk tukar</p>
            </div>
            <button onClick={() => fileRef.current?.click()} style={{
              background: 'none', border: 'none', color: '#0d7a5f',
              fontWeight: 700, fontSize: '12px', cursor: 'pointer'
            }}>Tukar</button>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            width: '100%', border: '2px dashed #b2dfdb', borderRadius: '16px',
            padding: '24px', background: '#f0faf7', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px'
          }}>
            <span style={{ fontSize: '32px' }}>{uploading ? '⏳' : '📷'}</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d7a5f' }}>
              {uploading ? 'Sedang muat naik...' : 'Ambil gambar resit'}
            </span>
            <span style={{ fontSize: '11px', color: '#888' }}>JPG atau PNG, maksimum 5MB</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" capture="environment"
          onChange={handleUpload} style={{ display: 'none' }} />
      </div>

      {/* Amount */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
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

      {/* Categories */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Kategori
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {filtered.map(cat => (
            <button key={cat.id} onClick={() => setCategoryId(cat.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', padding: '10px 4px', cursor: 'pointer',
              border: `2px solid ${categoryId === cat.id ? '#0d7a5f' : '#e8eeec'}`,
              borderRadius: '14px', fontFamily: 'sans-serif',
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

      {/* Date */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Tarikh
        </p>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
          width: '100%', padding: '12px 16px', fontSize: '14px', fontWeight: 600,
          border: '2px solid #e8eeec', borderRadius: '14px', outline: 'none',
          background: 'white', fontFamily: 'sans-serif', color: '#0f1f1a'
        }} />
      </div>

      {/* Note */}
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#888', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Nota (Pilihan)
        </p>
        <textarea
          placeholder="Contoh: 'Bayar sewa kedai untuk bulan April/ Majlis kenduri keluarga'"
          value={note} onChange={e => setNote(e.target.value)}
          maxLength={500} rows={3}
          style={{
            width: '100%', padding: '12px 16px', fontSize: '13px',
            border: '2px solid #e8eeec', borderRadius: '14px', outline: 'none',
            background: 'white', fontFamily: 'sans-serif', color: '#0f1f1a',
            resize: 'none'
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
        background: saving ? '#9ca3af' : '#0d7a5f',
        color: 'white', borderRadius: '18px', fontSize: '16px',
        fontWeight: 800, fontFamily: 'sans-serif',
        boxShadow: '0 4px 20px rgba(13,122,95,0.35)'
      }}>
        {saving ? '⏳ Sedang simpan...' : `💾 Simpan ${type === 'EXPENSE' ? 'Perbelanjaan' : 'Pendapatan'}`}
      </button>

    </div>
  )
}