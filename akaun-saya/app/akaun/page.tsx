import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteAccountButton from '@/components/DeleteAccountButton'

export default async function AkaunSayaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/login')

  return (
    <div style={{ 
      maxWidth: '430px', 
      margin: '0 auto', 
      padding: '20px 16px 150px', // Tambah padding bawah supaya tak kena tutup dengan nav
      minHeight: '100vh',
      background: '#f5f7f6' 
    }}>
      
      {/* Header & Back Button */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/tetapan" style={{ textDecoration: 'none', color: '#0f1f1a', fontSize: '20px' }}>
          ←
        </Link>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
          Edit Akaun Saya
        </h1>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {/* Display email */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Email Berdaftar</p>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f1f1a' }}>{user.email}</p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

        <p style={{ fontSize: '12px', color: '#b91c1c', marginBottom: '8px', fontWeight: 600 }}>
          Zon Bahaya
        </p>
        
        {/* Komponen Client untuk Padam Akaun */}
        <DeleteAccountButton />
      </div>

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
          { href: '/tetapan',   icon: '⚙️', label: 'Tetapan', active: true },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '2px', textDecoration: 'none',
            color: item.active ? '#0d7a5f' : '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}