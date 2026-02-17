 export default function DashboardLoading() {
  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px', fontFamily: 'sans-serif',
      background: '#f5f7f6', minHeight: '100vh'
    }}>

      {/* Header skeleton */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '20px 0 16px'
      }}>
        <div>
          <div style={{
            width: '140px', height: '18px', borderRadius: '6px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div style={{
            width: '80px', height: '11px', borderRadius: '4px', marginTop: '6px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Hero card skeleton */}
        <div style={{
          borderRadius: '24px', height: '180px',
          background: 'linear-gradient(90deg, #c8e6e0 25%, #d4ede8 50%, #c8e6e0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />

        {/* 2-col bento skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              borderRadius: '20px', height: '90px',
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          ))}
        </div>

        {/* Top category skeleton */}
        <div style={{
          borderRadius: '20px', height: '100px',
          background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />

        {/* Transaction list skeleton */}
        <div style={{
          background: 'white', borderRadius: '20px',
          overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{
              padding: '12px 16px',
              borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              {/* Icon */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  width: '100px', height: '12px', borderRadius: '4px', marginBottom: '6px',
                  background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite'
                }} />
                <div style={{
                  width: '60px', height: '10px', borderRadius: '4px',
                  background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite'
                }} />
              </div>
              {/* Amount */}
              <div style={{
                width: '60px', height: '13px', borderRadius: '4px', flexShrink: 0,
                background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite'
              }} />
            </div>
          ))}
        </div>

        {/* Laporan button skeleton */}
        <div style={{
          borderRadius: '20px', height: '72px',
          background: 'linear-gradient(90deg, #c8c8d8 25%, #d4d4e0 50%, #c8c8d8 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
      </div>

      {/* Bottom nav skeleton */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e8eeec',
        display: 'flex', padding: '10px 0 20px', zIndex: 10
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '4px'
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '4px',
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
            <div style={{
              width: '28px', height: '9px', borderRadius: '3px',
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          </div>
        ))}
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

    </div>
  )
}
