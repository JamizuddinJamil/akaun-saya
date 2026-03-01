 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MarkAsPaidButton({
  receivableId,
  amount
}: {
  receivableId: string
  amount: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleMarkAsPaid() {
    if (!confirm('Tandakan sebagai dibayar? Ini akan mencipta transaksi pendapatan baru.')) return

    setLoading(true)
    try {
      const res = await fetch(`/api/receivables/${receivableId}/mark-paid`, {
        method: 'POST'
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      alert('✅ Hutang ditandakan sebagai dibayar!')
      router.push('/hutang')
      router.refresh()
    } catch (err) {
      alert('Gagal: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleMarkAsPaid}
      disabled={loading}
      style={{
        background: loading ? '#9ca3af' : '#0d7a5f',
        color: 'white', padding: '14px', borderRadius: '14px',
        fontSize: '14px', fontWeight: 700, border: 'none',
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 12px rgba(13,122,95,0.3)'
      }}
    >
      {loading ? '⏳ Memproses...' : '✅ Tandakan Sebagai Dibayar'}
    </button>
  )
}
