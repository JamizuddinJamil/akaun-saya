 export default function LaporanLoading() {
  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px',
      background: '#f5f7f6', minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0 16px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e0e0' }} />
        <div style={{ width: '160px', height: '18px', borderRadius: '6px', background: '#e0e0e0' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Month selector */}
        <div style={{ borderRadius: '16px', height: '60px', background: '#e0e0e0' }} />
        {/* Summary card */}
        <div style={{ borderRadius: '20px', height: '160px', background: '#c8e6e0' }} />
        {/* Category cards */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ borderRadius: '14px', height: '80px', background: '#e0e0e0' }} />
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
