 'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BUSINESS_TYPES = [
  { value: 'kedai_makan',      label: '🍽️ Kedai Makan', 
    expenses: ['Bahan Masakan', 'Gas', 'Upah Pekerja', 'Sewa Kedai', 'Utiliti'],
    income: ['Jualan Harian', 'Delivery', 'Catering'] },
  { value: 'kedai_runcit',     label: '🏪 Kedai Runcit',
    expenses: ['Stok Barang', 'Sewa', 'Utiliti', 'Gaji', 'Promosi'],
    income: ['Jualan Tunai', 'Jualan Kredit'] },
  { value: 'contractor',       label: '🔨 Kontraktor',
    expenses: ['Bahan Binaan', 'Upah Pekerja', 'Transport', 'Peralatan', 'Permit'],
    income: ['Projek', 'Kerja Tambahan', 'Konsultasi'] },
  { value: 'freelancer',       label: '💼 Freelancer',
    expenses: ['Software', 'Internet', 'Marketing', 'Training'],
    income: ['Projek', 'Retainer', 'Komisen'] },
  { value: 'online_seller',    label: '📦 Penjual Online',
    expenses: ['Stok', 'Postage', 'Packaging', 'Marketing', 'Platform Fee'],
    income: ['Shopee', 'Lazada', 'Facebook', 'Instagram'] },
  { value: 'car_rental',       label: '🚗 Sewa Kereta',
    expenses: ['Fuel', 'Servis', 'Insurans', 'Cuci Kereta', 'Repair'],
    income: ['Sewa Harian', 'Sewa Mingguan', 'Deposit'] },
  { value: 'decoration_rental', label: '🎨 Sewa Dekorasi',
    expenses: ['Inventory', 'Transport', 'Storage', 'Repair', 'Pembungkusan'],
    income: ['Sewa Dekorasi', 'Setup Service', 'Deposit'] },
  { value: 'catering',         label: '🍱 Katering',
    expenses: ['Bahan Masakan', 'Packaging', 'Transport', 'Upah', 'Gas'],
    income: ['Majlis', 'Delivery', 'Catering Bulanan'] },
  { value: 'personal',         label: '👤 Penggunaan Peribadi',
    expenses: ['Makanan', 'Transport', 'Bills', 'Shopping', 'Lain-lain'],
    income: ['Gaji', 'Bonus', 'Side Income'] },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step data
  const [companyName, setCompanyName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [selectedIncome, setSelectedIncome] = useState<string[]>([])

  const selectedBusiness = BUSINESS_TYPES.find(b => b.value === businessType)

  function toggleExpense(exp: string) {
    setSelectedExpenses(prev =>
      prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
    )
  }

  function toggleIncome(inc: string) {
    setSelectedIncome(prev =>
      prev.includes(inc) ? prev.filter(i => i !== inc) : [...prev, inc]
    )
  }

  async function handleComplete() {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          businessType,
          expenseCategories: selectedExpenses,
          incomeCategories: selectedIncome,
        })
      })
      if (!res.ok) throw new Error('Gagal')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      alert('Gagal menyimpan. Cuba lagi.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '24px 16px', minHeight: '100vh',
      background: '#f5f7f6'
    }}>

      {/* Progress bar */}
      <div style={{
        height: '4px', background: '#e8eeec',
        borderRadius: '2px', marginBottom: '24px'
      }}>
        <div style={{
          height: '100%', borderRadius: '2px',
          width: `${(step / 6) * 100}%`,
          background: '#0d7a5f', transition: 'width 0.3s'
        }} />
      </div>

      {/* Step 1: Welcome */}
      {step === 1 && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>
            Selamat Datang!
          </h1>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '32px' }}>
            Mari kita setup akaun anda. Ia hanya ambil masa 2 minit sahaja.
          </p>
          <button onClick={() => setStep(2)} style={{
            width: '100%', padding: '16px', background: '#0d7a5f',
            color: 'white', border: 'none', borderRadius: '16px',
            fontSize: '16px', fontWeight: 800, cursor: 'pointer'
          }}>
            Mari Mula →
          </button>
        </div>
      )}

      {/* Step 2: Company Name */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>
            Nama Syarikat / Perniagaan
          </h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
            Nama ini akan muncul di laporan anda
          </p>
          <input
            type="text"
            placeholder="Cth: Kedai Makan Kak Ros"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            style={{
              width: '100%', padding: '14px 16px', fontSize: '15px',
              border: '2px solid #e8eeec', borderRadius: '14px',
              outline: 'none', marginBottom: '20px'
            }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{
              flex: 1, padding: '14px', background: 'white',
              border: '2px solid #e8eeec', borderRadius: '14px',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer'
            }}>
              ← Kembali
            </button>
            <button
              onClick={() => companyName.trim() && setStep(3)}
              disabled={!companyName.trim()}
              style={{
                flex: 2, padding: '14px',
                background: companyName.trim() ? '#0d7a5f' : '#e8eeec',
                color: companyName.trim() ? 'white' : '#888',
                border: 'none', borderRadius: '14px',
                fontSize: '14px', fontWeight: 700,
                cursor: companyName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Seterusnya →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Business Type */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>
            Jenis Perniagaan
          </h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
            Kami akan cadangkan kategori yang sesuai untuk anda
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {BUSINESS_TYPES.map(bt => (
              <button
                key={bt.value}
                onClick={() => setBusinessType(bt.value)}
                style={{
                  padding: '14px 16px', textAlign: 'left',
                  background: businessType === bt.value ? '#e6f5f1' : 'white',
                  border: businessType === bt.value ? '2px solid #0d7a5f' : '2px solid #e8eeec',
                  borderRadius: '14px', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {bt.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{
              flex: 1, padding: '14px', background: 'white',
              border: '2px solid #e8eeec', borderRadius: '14px',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer'
            }}>
              ← Kembali
            </button>
            <button
              onClick={() => businessType && setStep(4)}
              disabled={!businessType}
              style={{
                flex: 2, padding: '14px',
                background: businessType ? '#0d7a5f' : '#e8eeec',
                color: businessType ? 'white' : '#888',
                border: 'none', borderRadius: '14px',
                fontSize: '14px', fontWeight: 700,
                cursor: businessType ? 'pointer' : 'not-allowed'
              }}
            >
              Seterusnya →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Expense Categories */}
      {step === 4 && selectedBusiness && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>
            Pilih Kategori Perbelanjaan
          </h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
            Kami cadangkan kategori ini berdasarkan {selectedBusiness.label}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {selectedBusiness.expenses.map(exp => (
              <button
                key={exp}
                onClick={() => toggleExpense(exp)}
                style={{
                  padding: '10px 16px',
                  background: selectedExpenses.includes(exp) ? '#0d7a5f' : 'white',
                  color: selectedExpenses.includes(exp) ? 'white' : '#0f1f1a',
                  border: selectedExpenses.includes(exp) ? 'none' : '2px solid #e8eeec',
                  borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {selectedExpenses.includes(exp) ? '✓ ' : ''}{exp}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(3)} style={{
              flex: 1, padding: '14px', background: 'white',
              border: '2px solid #e8eeec', borderRadius: '14px',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer'
            }}>
              ← Kembali
            </button>
            <button
              onClick={() => setStep(5)}
              style={{
                flex: 2, padding: '14px', background: '#0d7a5f',
                color: 'white', border: 'none', borderRadius: '14px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Seterusnya →
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Income Categories */}
      {step === 5 && selectedBusiness && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>
            Pilih Kategori Pendapatan
          </h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
            Sumber pendapatan anda
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            {selectedBusiness.income.map(inc => (
              <button
                key={inc}
                onClick={() => toggleIncome(inc)}
                style={{
                  padding: '10px 16px',
                  background: selectedIncome.includes(inc) ? '#0d7a5f' : 'white',
                  color: selectedIncome.includes(inc) ? 'white' : '#0f1f1a',
                  border: selectedIncome.includes(inc) ? 'none' : '2px solid #e8eeec',
                  borderRadius: '12px', fontSize: '13px', fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {selectedIncome.includes(inc) ? '✓ ' : ''}{inc}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(4)} style={{
              flex: 1, padding: '14px', background: 'white',
              border: '2px solid #e8eeec', borderRadius: '14px',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer'
            }}>
              ← Kembali
            </button>
            <button
              onClick={() => setStep(6)}
              style={{
                flex: 2, padding: '14px', background: '#0d7a5f',
                color: 'white', border: 'none', borderRadius: '14px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Semak & Siap →
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Review */}
      {step === 6 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>
            Semak Maklumat
          </h2>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '16px',
            marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>SYARIKAT</p>
            <p style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>{companyName}</p>

            <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>JENIS</p>
            <p style={{ fontSize: '15px', fontWeight: 800, marginBottom: '12px' }}>
              {selectedBusiness?.label}
            </p>

            <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>PERBELANJAAN</p>
            <p style={{ fontSize: '13px', marginBottom: '12px' }}>
              {selectedExpenses.length} kategori dipilih
            </p>

            <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px' }}>PENDAPATAN</p>
            <p style={{ fontSize: '13px' }}>
              {selectedIncome.length} kategori dipilih
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(5)} disabled={loading} style={{
              flex: 1, padding: '14px', background: 'white',
              border: '2px solid #e8eeec', borderRadius: '14px',
              fontSize: '14px', fontWeight: 700, cursor: 'pointer'
            }}>
              ← Kembali
            </button>
            <button
              onClick={handleComplete}
              disabled={loading}
              style={{
                flex: 2, padding: '14px',
                background: loading ? '#9ca3af' : '#0d7a5f',
                color: 'white', border: 'none', borderRadius: '14px',
                fontSize: '14px', fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Menyimpan...' : '✅ Siap & Mula Guna'}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
