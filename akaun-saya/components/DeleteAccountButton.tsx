"use client"

import { useState } from 'react'
import { deleteUserAction } from '@/app/actions/delete-account'

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false)

  const handlePress = async () => {
    if (!confirm('Adakah anda pasti? Semua data akan dipadam selamanya!')) return
    
    setLoading(true)
    try {
      await deleteUserAction()
    } catch (err: any) {
      alert('Gagal padam: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div 
      onClick={loading ? undefined : handlePress}
      style={{
        background: '#fee2e2', borderRadius: '14px',
        padding: '16px', textAlign: 'center',
        cursor: loading ? 'default' : 'pointer', 
        color: '#b91c1c', fontWeight: 700,
        opacity: loading ? 0.6 : 1
      }}
    >
      {loading ? 'Memproses...' : '🗑️ Padam Akaun Saya'}
    </div>
  )
}