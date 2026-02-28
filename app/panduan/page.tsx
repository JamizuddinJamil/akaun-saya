import Link from 'next/link'

export default function PanduanPage() {
  return (
    <div style={{
      maxWidth: '430px', margin: '0 auto',
      padding: '0 16px 100px',
      background: '#f5f7f6', minHeight: '100vh'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '20px 0 16px'
      }}>
        <Link href="/tetapan" style={{
          width: '36px', height: '36px', background: 'white',
          border: '2px solid #e8eeec', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', textDecoration: 'none', flexShrink: 0,
          color: 'inherit'
        }}>
          ←
        </Link>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f1f1a' }}>
            Panduan Pengguna
          </h1>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
            AkaunSaya.my v1.3.0
          </p>
        </div>
      </div>

      {/* Sections */}
      {[
        {
          icon: '📝', title: 'Daftar Akaun',
          steps: [
            'Tekan "Daftar sekarang" di skrin log masuk',
            'Pilih jenis perniagaan anda',
            'Masukkan emel dan password (min 6 aksara)',
            'Tekan "Daftar" dan semak emel untuk pengesahan',
            'Klik pautan dalam emel untuk aktifkan akaun',
          ]
        },
        {
          icon: '➕', title: 'Tambah Transaksi',
          steps: [
            'Tekan butang + hijau di dashboard',
            'Pilih jenis: Perbelanjaan atau Pendapatan',
            'Snap resit dengan 📷 Kamera atau pilih dari 🖼️ Galeri',
            'Masukkan jumlah dalam RM (contoh: 84.50)',
            'Pilih kategori yang sesuai',
            'Pilih tarikh (lalai: hari ini)',
            'Tambah nota jika perlu (pilihan)',
            'Tekan 💾 Simpan',
          ]
        },
        {
          icon: '🗑️', title: 'Padam Transaksi',
          steps: [
            'Leret transaksi ke kiri pada senarai',
            'Butang merah 🗑️ akan muncul',
            'Tekan "Ya, Padam" untuk sahkan',
            'Atau tekan "Batal" untuk batalkan',
          ]
        },
        {
          icon: '📊', title: 'Lihat Laporan',
          steps: [
            'Tekan tab 📊 Laporan di navigasi bawah',
            'Lihat carta aliran harian (merah=belanja, hijau=masuk)',
            'Scroll ke bawah untuk pecahan mengikut kategori',
            'Tekan ‹ › untuk tukar bulan',
            'Tangkap skrin untuk hantar ke akauntan',
          ]
        },
        {
          icon: '📋', title: 'Semua Rekod',
          steps: [
            'Tekan tab 📋 Rekod di navigasi bawah',
            'Lihat semua transaksi mengikut bulan',
            'Tekan "Laporan →" untuk laporan bulan tertentu',
            'Leret ke kiri untuk padam mana-mana rekod',
          ]
        },
        {
          icon: '🏷️', title: 'Urus Kategori',
          steps: [
            'Tekan ⚙️ Tetapan → Urus Kategori',
            'Pilih tab Perbelanjaan atau Pendapatan',
            'Tekan ✏️ untuk edit nama atau ikon kategori',
            'Tekan ➕ Tambah Kategori Baru untuk tambah kategori sendiri',
            'Kategori yang ada transaksi tidak boleh dipadam',
          ]
        },
        {
          icon: '🧾', title: 'Lihat Detail Resit',
          steps: [
            'Tekan mana-mana transaksi dalam senarai',
            'Halaman detail akan paparkan maklumat lengkap',
            'Gambar resit dipaparkan jika ada',
            'Tekan "Lihat Saiz Penuh" untuk zoom resit',
          ]
        },
      ].map((section, i) => (
        <div key={i} style={{
          background: 'white', borderRadius: '16px',
          padding: '16px', marginBottom: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '12px'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#e6f5f1', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', flexShrink: 0
            }}>
              {section.icon}
            </div>
            <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f1f1a' }}>
              {section.title}
            </p>
          </div>
          <ol style={{ paddingLeft: '20px', margin: 0 }}>
            {section.steps.map((step, j) => (
              <li key={j} style={{
                fontSize: '12px', color: '#444', lineHeight: '1.8',
                paddingLeft: '4px'
              }}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      ))}

      {/* FAQ */}
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '16px', marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '12px'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#e6f5f1', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '18px', flexShrink: 0
          }}>
            ❓
          </div>
          <p style={{ fontSize: '14px', fontWeight: 800, color: '#0f1f1a' }}>
            Soalan Lazim
          </p>
        </div>

        {[
          { q: 'Boleh guna tanpa internet?', a: 'Tidak, aplikasi memerlukan sambungan internet untuk simpan data.' },
          { q: 'Data saya selamat ke?', a: 'Ya. Setiap pengguna hanya boleh lihat data mereka sendiri.' },
          { q: 'Boleh akses dari komputer?', a: 'Ya! Buka pautan aplikasi dalam mana-mana browser.' },
          { q: 'Silap masukkan jumlah?', a: 'Padam transaksi (leret ke kiri) dan masukkan semula.' },
          { q: 'Boleh lihat laporan bulan lepas?', a: 'Ya! Di halaman Laporan, tekan ‹ untuk bulan sebelumnya.' },
          { q: 'Tak terima emel pengesahan?', a: 'Semak folder Spam/Junk. Cuba daftar semula jika tiada.' },
        ].map((faq, i) => (
          <div key={i} style={{
            paddingBottom: '12px', marginBottom: '12px',
            borderBottom: i < 5 ? '1px solid #f5f5f5' : 'none'
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f1f1a', marginBottom: '4px' }}>
              {faq.q}
            </p>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.6' }}>
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p style={{
        textAlign: 'center', fontSize: '11px',
        color: '#ccc', marginTop: '16px'
      }}>
        AkaunSaya.my v1.1.0 🇲🇾
      </p>

    </div>
  )
}
