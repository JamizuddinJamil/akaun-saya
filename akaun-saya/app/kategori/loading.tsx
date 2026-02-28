// app/kategori/loading.tsx
export default function KategoriLoading() {
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
        {/* Header Skeleton */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '20px 0 16px'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
          <div style={{
            width: '150px', height: '18px', borderRadius: '6px',
            background: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>

        {/* Category list skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              borderRadius: '20px', height: '80px',
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