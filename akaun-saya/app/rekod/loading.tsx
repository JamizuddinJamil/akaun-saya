// app/rekod/loading.tsx
export default function RekodLoading() {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      </style>

      <div style={{
        maxWidth: '430px', margin: '0 auto',
        padding: '0 16px 100px'
      }}>
        {/* Header skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 0 16px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div style={{
            flex: 1, height: '18px', borderRadius: '6px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div style={{
            width: '60px', height: '12px', borderRadius: '6px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>

        {/* Summary stats skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: '14px', padding: '12px', height: '60px',
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          ))}
        </div>

        {/* Transactions skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              height: '70px', borderRadius: '16px',
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          ))}
        </div>

        {/* Bottom nav skeleton */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          display: 'flex', padding: '10px 0 20px', gap: '10px',
          background: 'white', borderTop: '1px solid #e0e0e0', zIndex: 10
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '40px', borderRadius: '12px',
              background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }} />
          ))}
        </div>
      </div>
    </>
  )
}