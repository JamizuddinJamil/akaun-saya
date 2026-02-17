 'use client'

export default function LogoutButton() {
  return (
    <button
      onClick={() => window.location.href = '/api/auth/signout'}
      style={{
        background: 'none', border: 'none',
        width: '100%', cursor: 'pointer', padding: 0
      }}
    >
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
        <div style={{ flex: 1, textAlign: 'left' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#d94f3d' }}>
            Log Keluar
          </p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            Keluar dari akaun semasa
          </p>
        </div>
        <span style={{ color: '#ccc', fontSize: '18px' }}>›</span>
      </div>
    </button>
  )
}
