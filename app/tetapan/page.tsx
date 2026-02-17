 import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TetapanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px', fontFamily: 'sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 0 16px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
          ⚙️ Tetapan
        </h1>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
          {user.email}
        </p>
      </div>

      {/* Menu items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

        <Link href="/kategori" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white', borderRadius: '14px',
            padding: '16px', display: 'flex', alignItems: 'center',
            gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#e6f5f1', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px', flexShrink: 0
            }}>
              🏷️
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1f1a' }}>
                Urus Kategori
              </p>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                Tambah, edit atau padam kategori
              </p>
            </div>
            <span style={{ color: '#ccc', fontSize: '18px' }}>›</span>
          </div>
        </Link>

        <Link href="/api/auth/signout" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white', borderRadius: '14px',
            padding: '16px', display: 'flex', alignItems: 'center',
            gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px',
              background: '#fdf0ee', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '20px', flexShrink: 0
            }}>
              🚪
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#d94f3d' }}>
                Log Keluar
              </p>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                Keluar dari akaun semasa
              </p>
            </div>
            <span style={{ color: '#ccc', fontSize: '18px' }}>›</span>
          </div>
        </Link>

      </div>

      {/* App version */}
      <p style={{
        textAlign: 'center', fontSize: '11px',
        color: '#ccc', marginTop: '32px'
      }}>
        AkaunSaya.my v1.0.0
      </p>

      {/* Bottom nav */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e8eeec',
        display: 'flex', padding: '10px 0 20px', zIndex: 10
      }}>
        {[
          { href: '/dashboard', icon: '🏠', label: 'Utama' },
          { href: '/tambah',    icon: '➕', label: 'Tambah' },
          { href: '/laporan',   icon: '📊', label: 'Laporan' },
          { href: '/tetapan',   icon: '⚙️', label: 'Tetapan', active: true },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px', textDecoration: 'none',
            color: item.active ? '#0d7a5f' : '#888'
          }}>
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
