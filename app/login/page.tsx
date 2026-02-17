'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const BUSINESS_TYPES = [
  { value: 'catering',           label: '🍽️ Katering & Makanan' },
  { value: 'car_rental',         label: '🚗 Sewa Kereta' },
  { value: 'decoration_rental',  label: '🎨 Sewa Dekorasi & Peralatan' },
  { value: 'retail',             label: '🏪 Kedai Runcit' },
  { value: 'generic',            label: '➕ Lain-lain' },
]

export default function LoginPage() {
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [businessType, setBusinessType] = useState('generic')
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState<string | null>(null)
  const [mode,         setMode]         = useState<'login' | 'register'>('login')

  const supabase = createClient()
  const router   = useRouter()

  async function handleSubmit() {
    setLoading(true)
    setError(null)

    if (mode === 'register') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { businessType }
        }
      })
      
      if (signUpError) {
        // Check if it's a duplicate email error
        if (signUpError.message.toLowerCase().includes('already') || 
            signUpError.message.toLowerCase().includes('exist')) {
          setError('Emel ini sudah didaftarkan. Sila log masuk.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      // Supabase doesn't always throw error for duplicates, check if user was actually created
      if (data?.user && !data.user.identities?.length) {
        setError('Emel ini sudah didaftarkan. Sila log masuk.')
        setLoading(false)
        return
      }

      setError('Semak emel anda untuk confirmation link!')
      setLoading(false)
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError('Emel atau password salah')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f7f6', padding: '24px'
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', background: 'white',
        borderRadius: '24px', padding: '32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🧾</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f1f1a' }}>
            AkaunSaya.my
          </h1>
          <p style={{ color: '#666', marginTop: '4px', fontSize: '14px' }}>
            {mode === 'login' ? 'Log masuk ke akaun anda' : 'Daftar akaun baru'}
          </p>
        </div>

        {/* Business Type (register only) */}
        {mode === 'register' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '12px', fontWeight: 700,
              color: '#666', marginBottom: '8px', textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Jenis Perniagaan
            </label>
            <select
              value={businessType}
              onChange={e => setBusinessType(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px',
                border: '2px solid #e8eeec', borderRadius: '12px',
                fontSize: '14px', outline: 'none',
                background: 'white', cursor: 'pointer'
              }}
            >
              {BUSINESS_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block', fontSize: '12px', fontWeight: 700,
            color: '#666', marginBottom: '6px', textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Emel
          </label>
          <input
            type="email" placeholder="contoh@gmail.com"
            value={email} onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', padding: '12px 16px',
              border: '2px solid #e8eeec', borderRadius: '12px',
              fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block', fontSize: '12px', fontWeight: 700,
            color: '#666', marginBottom: '6px', textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Password
          </label>
          <input
            type="password" placeholder="Minimum 6 aksara"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              width: '100%', padding: '12px 16px',
              border: '2px solid #e8eeec', borderRadius: '12px',
              fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: error.includes('Semak') ? '#f0fdf4' : '#fdf0ee',
            border: `1px solid ${error.includes('Semak') ? '#86efac' : '#fca5a5'}`,
            color: error.includes('Semak') ? '#16a34a' : '#dc2626',
            padding: '12px', borderRadius: '10px',
            fontSize: '13px', marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#9ca3af' : '#0d7a5f',
            color: 'white', border: 'none',
            borderRadius: '14px', fontSize: '15px',
            fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
            
          }}
        >
          {loading ? '⏳ Tunggu...' : mode === 'login' ? 'Log Masuk' : 'Daftar'}
        </button>

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
          {mode === 'login' ? 'Belum ada akaun? ' : 'Sudah ada akaun? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
            style={{
              color: '#0d7a5f', fontWeight: 700,
              background: 'none', border: 'none',
              cursor: 'pointer', fontSize: '13px'
            }}
          >
            {mode === 'login' ? 'Daftar sekarang' : 'Log masuk'}
          </button>
        </p>
      </div>
    </div>
  )
}
