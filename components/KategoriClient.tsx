 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Common emojis for category icons
const EMOJI_OPTIONS = [
  '🥩','🍱','🎉','🚗','⛽','🔧','📋','🧹','🛠️',
  '🎨','🚚','🏪','📦','💡','👤','📱','💰','💵',
  '📅','🛒','👩‍🍳','🔨','📌','✨','🏢','🍽️','📄',
  '💼','🎁','🌟','🏆','📊','🔑','🌈','❤️','⭐',
]

interface Category {
  id:        string
  name:      string
  icon:      string
  type:      string
  isDefault: boolean
  sortOrder: number
  _count:    { transactions: number }
}

export default function KategoriClient({
  categories
}: {
  categories: Category[]
}) {
  const router = useRouter()

  const [tab,         setTab]         = useState<'EXPENSE' | 'INCOME'>('EXPENSE')
  const [editing,     setEditing]     = useState<string | null>(null)
  const [editName,    setEditName]    = useState('')
  const [editIcon,    setEditIcon]    = useState('')
  const [showAdd,     setShowAdd]     = useState(false)
  const [newName,     setNewName]     = useState('')
  const [newIcon,     setNewIcon]     = useState('📌')
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState<string | null>(null)

  const filtered = categories.filter(c => c.type === tab)

  // ── Edit category ──────────────────────────────
  function startEdit(cat: Category) {
    setEditing(cat.id)
    setEditName(cat.name)
    setEditIcon(cat.icon)
    setError(null)
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) { setError('Nama kategori diperlukan'); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: editName.trim(), icon: editIcon })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEditing(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Delete category ────────────────────────────
  async function deleteCategory(cat: Category) {
    if (cat._count.transactions > 0) {
      alert(`Kategori ini ada ${cat._count.transactions} transaksi. Tidak boleh dipadam.`)
      return
    }
    if (!confirm(`Sure nak padam "${cat.name}"?`)) return

    setLoading(true)
    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.refresh()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Add category ───────────────────────────────
  async function addCategory() {
    if (!newName.trim()) { setError('Nama kategori diperlukan'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/categories', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: newName.trim(), icon: newIcon, type: tab })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setShowAdd(false)
      setNewName('')
      setNewIcon('📌')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Tab toggle */}
      <div style={{
        display: 'flex', background: '#f0f0f0',
        borderRadius: '16px', padding: '4px', gap: '4px', marginBottom: '16px'
      }}>
        {(['EXPENSE', 'INCOME'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setEditing(null); setShowAdd(false) }} style={{
            flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
            borderRadius: '12px', fontWeight: 800, fontSize: '13px',
            fontFamily: 'sans-serif',
            background: tab === t ? 'white' : 'transparent',
            color: tab === t ? (t === 'EXPENSE' ? '#d94f3d' : '#0d7a5f') : '#888',
            boxShadow: tab === t ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
          }}>
            {t === 'EXPENSE' ? '💸 Perbelanjaan' : '💰 Pendapatan'}
          </button>
        ))}
      </div>

      {/* Category list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {filtered.map(cat => (
          <div key={cat.id} style={{
            background: 'white', borderRadius: '14px',
            padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            {editing === cat.id ? (
              // Edit mode
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Icon picker */}
                <div>
                  <p style={{
                    fontSize: '11px', fontWeight: 700, color: '#888',
                    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px'
                  }}>
                    Pilih Icon
                  </p>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '4px'
                  }}>
                    {EMOJI_OPTIONS.map(emoji => (
                      <button key={emoji} onClick={() => setEditIcon(emoji)} style={{
                        padding: '6px', fontSize: '18px', border: 'none',
                        cursor: 'pointer', borderRadius: '8px',
                        background: editIcon === emoji ? '#e6f5f1' : 'transparent',
                        outline: editIcon === emoji ? '2px solid #0d7a5f' : 'none'
                      }}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name input */}
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Nama kategori"
                  style={{
                    padding: '10px 14px', border: '2px solid #e8eeec',
                    borderRadius: '10px', fontSize: '13px',
                    fontFamily: 'sans-serif', outline: 'none'
                  }}
                />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditing(null)} style={{
                    flex: 1, padding: '10px', border: '2px solid #e8eeec',
                    borderRadius: '10px', background: 'white', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 700, fontFamily: 'sans-serif', color: '#666'
                  }}>
                    Batal
                  </button>
                  <button onClick={() => saveEdit(cat.id)} disabled={loading} style={{
                    flex: 2, padding: '10px', border: 'none',
                    borderRadius: '10px', background: '#0d7a5f', cursor: 'pointer',
                    fontSize: '12px', fontWeight: 700, fontFamily: 'sans-serif', color: 'white'
                  }}>
                    {loading ? '⏳' : '✅ Simpan'}
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: tab === 'EXPENSE' ? '#fdf0ee' : '#e6f5f1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1f1a' }}>
                    {cat.name}
                  </p>
                  <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                    {cat._count.transactions} transaksi
                    {cat.isDefault && (
                      <span style={{
                        marginLeft: '6px', background: '#e6f5f1',
                        color: '#0d7a5f', padding: '1px 6px',
                        borderRadius: '4px', fontSize: '9px', fontWeight: 700
                      }}>
                        DEFAULT
                      </span>
                    )}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => startEdit(cat)} style={{
                    width: '32px', height: '32px', border: '1.5px solid #e8eeec',
                    borderRadius: '8px', background: 'white', cursor: 'pointer',
                    fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteCategory(cat)}
                    disabled={cat._count.transactions > 0}
                    style={{
                      width: '32px', height: '32px',
                      border: `1.5px solid ${cat._count.transactions > 0 ? '#e8eeec' : '#fca5a5'}`,
                      borderRadius: '8px',
                      background: cat._count.transactions > 0 ? '#f9f9f9' : 'white',
                      cursor: cat._count.transactions > 0 ? 'not-allowed' : 'pointer',
                      fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: cat._count.transactions > 0 ? 0.4 : 1
                    }}
                    title={cat._count.transactions > 0 ? 'Ada transaksi — tidak boleh padam' : 'Padam kategori'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new category */}
      {showAdd ? (
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '16px'
        }}>
          <p style={{
            fontSize: '13px', fontWeight: 800, color: '#0f1f1a', marginBottom: '12px'
          }}>
            Tambah Kategori {tab === 'EXPENSE' ? 'Perbelanjaan' : 'Pendapatan'}
          </p>

          {/* Icon picker */}
          <p style={{
            fontSize: '11px', fontWeight: 700, color: '#888',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px'
          }}>
            Pilih Icon
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)',
            gap: '4px', marginBottom: '12px'
          }}>
            {EMOJI_OPTIONS.map(emoji => (
              <button key={emoji} onClick={() => setNewIcon(emoji)} style={{
                padding: '6px', fontSize: '18px', border: 'none',
                cursor: 'pointer', borderRadius: '8px',
                background: newIcon === emoji ? '#e6f5f1' : 'transparent',
                outline: newIcon === emoji ? '2px solid #0d7a5f' : 'none'
              }}>
                {emoji}
              </button>
            ))}
          </div>

          {/* Name input */}
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Nama kategori baru..."
            style={{
              width: '100%', padding: '10px 14px',
              border: '2px solid #e8eeec', borderRadius: '10px',
              fontSize: '13px', fontFamily: 'sans-serif',
              outline: 'none', marginBottom: '10px'
            }}
          />

          {error && (
            <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '8px' }}>
              ⚠️ {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { setShowAdd(false); setError(null) }} style={{
              flex: 1, padding: '10px', border: '2px solid #e8eeec',
              borderRadius: '10px', background: 'white', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700, fontFamily: 'sans-serif', color: '#666'
            }}>
              Batal
            </button>
            <button onClick={addCategory} disabled={loading} style={{
              flex: 2, padding: '10px', border: 'none',
              borderRadius: '10px', background: '#0d7a5f', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700, fontFamily: 'sans-serif', color: 'white'
            }}>
              {loading ? '⏳' : '➕ Tambah Kategori'}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => { setShowAdd(true); setError(null) }} style={{
          width: '100%', padding: '14px', border: '2px dashed #b2dfdb',
          borderRadius: '14px', background: '#f0faf7', cursor: 'pointer',
          fontSize: '13px', fontWeight: 700, fontFamily: 'sans-serif',
          color: '#0d7a5f', marginBottom: '16px'
        }}>
          ➕ Tambah Kategori Baru
        </button>
      )}

      {/* Add link to settings from dashboard */}
      <div style={{
        background: '#f5f7f6', borderRadius: '12px',
        padding: '12px', textAlign: 'center'
      }}>
        <p style={{ fontSize: '11px', color: '#888' }}>
          Kategori yang dipadam tidak boleh dipulihkan.
          Transaksi yang sudah ada tidak terjejas.
        </p>
      </div>
    </div>
  )
}
