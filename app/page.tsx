import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '24px',
      textAlign: 'center',
      background: '#f5f7f6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      color: '#0f1f1a'
    }}>
      {/* Visual Decoration */}
      <div style={{
        fontSize: '64px',
        marginBottom: '20px',
        animation: 'bounce 2s infinite'
      }}>
        🧾
      </div>

      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: 900, 
        letterSpacing: '-1px',
        marginBottom: '12px'
      }}>
        AkaunSaya.my
      </h1>

      <p style={{ 
        fontSize: '16px', 
        color: '#666', 
        maxWidth: '300px',
        lineHeight: '1.5',
        marginBottom: '32px'
      }}>
        Urus kewangan perniagaan dan peribadi dengan lebih mudah & pantas.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
        <Link href="/dashboard" style={{
          background: '#0d7a5f',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '16px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(13, 122, 95, 0.25)',
          transition: 'transform 0.2s ease'
        }}>
          Terus ke Login/Daftar→
        </Link>
        
        <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>
          Dikuasakan oleh Next.js & Supabase
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}} />
    </div>
  )
}