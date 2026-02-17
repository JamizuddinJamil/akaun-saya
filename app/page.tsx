 export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
      gap: '12px'
    }}>
      <h1>🍽️ Akaunsaya.my</h1>
      <p style={{ color: '#666' }}>App berjalan dengan baik!</p>
      <a href="/dashboard" style={{ color: '#0d7a5f', fontWeight: 'bold' }}>
        Pergi ke Dashboard →
      </a>
    </div>
  )
}