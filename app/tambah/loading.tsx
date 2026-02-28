 export default function TambahLoading() {
  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px',
      background: '#f5f7f6', minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0 16px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e0e0' }} />
        <div style={{ width: '140px', height: '18px', borderRadius: '6px', background: '#e0e0e0' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Toggle */}
        <div style={{ borderRadius: '16px', height: '48px', background: '#e0e0e0' }} />
        {/* Receipt upload */}
        <div style={{ borderRadius: '16px', height: '100px', background: '#e0e0e0' }} />
        {/* Amount */}
        <div style={{ borderRadius: '16px', height: '60px', background: '#e0e0e0' }} />
        {/* Categories grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {[0,1,2,3,4,5,6,7].map(i => (
            <div key={i} style={{ borderRadius: '14px', height: '70px', background: '#e0e0e0' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
