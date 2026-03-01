 'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Transaction {
  id:         string
  type:       string
  amount:     number
  date:       string
  note:       string | null
  category:   { name: string; icon: string }
}

export default function SwipeableTransaction({ tx }: { tx: Transaction }) {
  const router        = useRouter()
  const [offset,      setOffset]      = useState(0)
  const [deleting,    setDeleting]    = useState(false)
  const [confirming,  setConfirming]  = useState(false)
  const startX        = useRef(0)
  const isDragging    = useRef(false)
  const THRESHOLD     = 80  // how far to swipe to reveal delete

  const toRM = (sen: number) => (sen / 100).toFixed(2)

  // ── Touch handlers ─────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    startX.current  = e.touches[0].clientX
    isDragging.current = true
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!isDragging.current) return
    const diff = e.touches[0].clientX - startX.current
    // Only allow swiping left (negative diff)
    if (diff < 0) setOffset(Math.max(diff, -THRESHOLD - 20))
  }

  function onTouchEnd() {
    isDragging.current = false
    // Snap to revealed or closed position
    if (offset < -THRESHOLD / 2) {
      setOffset(-THRESHOLD)
      setConfirming(true)
    } else {
      setOffset(0)
      setConfirming(false)
    }
  }

  // ── Delete ──────────────────────────────────────
  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/transactions/${tx.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal padam')
      router.refresh()  // refresh dashboard data
    } catch (err) {
      setDeleting(false)
      setOffset(0)
      setConfirming(false)
      alert('Gagal padam. Cuba lagi.')
    }
  }

  function cancelDelete() {
    setOffset(0)
    setConfirming(false)
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '0' }}>

      {/* Delete button behind the row */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: `${THRESHOLD}px`,
        background: '#d94f3d',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '14px',
      }}>
        {deleting ? (
          <span style={{ fontSize: '20px' }}>⏳</span>
        ) : (
          <button onClick={handleDelete} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '2px'
          }}>
            <span style={{ fontSize: '22px' }}>🗑️</span>
            <span style={{ fontSize: '10px', color: 'white', fontWeight: 700 }}>Padam</span>
          </button>
        )}
      </div>

      {/* Transaction row — slides left on swipe */}
      <Link
        href={`/transaksi/${tx.id}`}
        style={{ textDecoration: 'none' }}
      >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform:  `translateX(${offset}px)`,
          transition: isDragging.current ? 'none' : 'transform 0.2s ease',
background: deleting ? '#fee2e2' : 'white',
          borderRadius: '0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Category icon */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: tx.type === 'INCOME' ? '#e6f5f1' : '#fdf0ee',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px'
        }}>
          {tx.category.icon}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f1f1a' }}>
            {tx.category.name}
          </p>
          <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
            {tx.note || new Date(tx.date).toLocaleDateString('ms-MY')}
          </p>
        </div>

        {/* Amount */}
        <p style={{
          fontSize: '13px', fontWeight: 800, flexShrink: 0,
          color: tx.type === 'INCOME' ? '#0d7a5f' : '#d94f3d'
        }}>
          {tx.type === 'INCOME' ? '+' : '-'} RM {toRM(tx.amount)}
        </p>

        {/* Swipe hint — only shows when not swiped */}
        {offset === 0 && (
          <span style={{ fontSize: '12px', color: '#ccc', flexShrink: 0 }}>←</span>
        )}
      </div>
      </Link>

      {/* Confirm bar — appears when fully swiped */}
      {confirming && !deleting && (
        <div style={{
          position: 'absolute', bottom: '-40px', left: 0, right: 0,
          background: '#fdf0ee', border: '1px solid #fca5a5',
          borderRadius: '10px', padding: '8px 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 2
        }}>
          <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
            Sure nak padam rekod ini?
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={cancelDelete} style={{
              background: 'white', border: '1px solid #e8eeec',
              borderRadius: '8px', padding: '4px 10px',
              fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              color: '#666'
            }}>
              Batal
            </button>
            <button onClick={handleDelete} style={{
              background: '#d94f3d', border: 'none',
              borderRadius: '8px', padding: '4px 10px',
              fontSize: '11px', fontWeight: 700, cursor: 'pointer',
              color: 'white'
            }}>
              Ya, Padam
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
