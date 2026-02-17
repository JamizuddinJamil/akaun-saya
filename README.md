# Masak.my — Expense Tracker untuk Perniagaan Katering
## Setup dalam 30 minit

---

## Stack (Semuanya PERCUMA untuk bermula)

| Apa          | Servis           | Kos     |
|--------------|------------------|---------|
| Database     | Supabase         | Percuma |
| Auth (Login) | Supabase Auth    | Percuma |
| Storage      | Supabase Storage | Percuma |
| Frontend     | Next.js + Vercel | Percuma |
| Total        |                  | **RM 0/bulan** |

---

## Langkah 1 — Setup Supabase (10 minit)

1. Pergi ke **supabase.com** → Create account → New project
2. Nama projek: `masak-my`
3. Set password yang kuat (simpan dalam notepad)
4. Tunggu ~2 minit untuk provision

### Buat Storage Bucket
1. Dashboard → Storage → New bucket
2. Nama: `receipts`
3. **Public bucket: ON** (supaya gambar resit boleh dipapar)

### Dapatkan credentials
Dashboard → Settings → API:
- Copy `Project URL` → letak dalam `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public key` → letak dalam `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role key` → letak dalam `SUPABASE_SERVICE_ROLE_KEY`

---

## Langkah 2 — Setup projek (5 minit)

```bash
# Clone / buat projek baru
npx create-next-app@latest masak-my --typescript --tailwind --app
cd masak-my

# Install dependencies
npm install @prisma/client prisma @supabase/supabase-js zod

# Setup Prisma
npx prisma init
```

Salin fail `prisma/schema.prisma` dari repo ini ke dalam projek.

```bash
# Run migration
npx prisma migrate dev --name init

# Verify tables created
npx prisma studio
```

---

## Langkah 3 — Environment variables

Salin `.env.example` ke `.env.local` dan isi nilai:

```bash
cp .env.example .env.local
```

---

## Langkah 4 — Deploy ke Vercel (5 minit)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add DATABASE_URL

# Deploy production
vercel --prod
```

---

## Struktur folder

```
masak-my/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx        ← Login page
│   │   └── register/page.tsx     ← Register page
│   ├── (app)/
│   │   ├── layout.tsx            ← Protected layout + bottom nav
│   │   ├── dashboard/page.tsx    ← Screen 1: Dashboard utama
│   │   ├── tambah/page.tsx       ← Screen 2: Tambah expense/income
│   │   └── laporan/page.tsx      ← Screen 3: Monthly report
│   ├── api/
│   │   ├── transactions/route.ts ← GET + POST transactions
│   │   ├── reports/monthly/route.ts ← Monthly P&L
│   │   └── upload/route.ts       ← Receipt upload
├── components/
│   └── AddExpenseForm.tsx        ← Core form component
├── lib/
│   ├── db.ts                     ← Prisma singleton
│   └── supabase/
│       ├── client.ts             ← Browser client
│       └── server.ts             ← Server client
├── prisma/
│   ├── schema.prisma             ← 3 tables only
│   └── seed.ts                   ← Default categories (BM)
└── .env.local                    ← Your secrets (NEVER commit)
```

---

## Tips untuk junior developer

### Jangan buat dulu:
- ❌ Multiple currencies
- ❌ Invoice / quotation
- ❌ Bank reconciliation
- ❌ Complex auth (roles, teams)
- ❌ PDF generation (Phase 2)

### Fokus dulu:
- ✅ User boleh register & login
- ✅ User boleh tambah expense dengan gambar resit
- ✅ User boleh tengok summary bulan ini
- ✅ Semuanya kerja di telefon

### Bila rasa nak add feature baru, tanya:
> "Adakah ini selesaikan masalah Kak Ros hari ini?"
> Kalau jawapan "tidak" — tunggu dulu.

---

## Cara test secara manual

1. Register akaun baru
2. Pergi ke `/tambah`
3. Upload gambar resit (boleh screenshot mana-mana)
4. Masuk jumlah RM 50.00
5. Pilih kategori "Bahan Masakan"
6. Tekan simpan
7. Pergi ke `/dashboard` — pastikan transaction muncul
8. Pergi ke `/laporan` — pastikan jumlah betul

---

## Soalan biasa

**Q: Kenapa simpan dalam sen (integer) bukan decimal?**
A: Floating point numbers tidak tepat. `0.1 + 0.2 = 0.30000000000000004` dalam JavaScript.
   RM 84.50 disimpan sebagai `8450` dalam database. Bila nak papar, bahagi dengan 100.

**Q: Kenapa Supabase dan bukan Firebase?**
A: Supabase guna PostgreSQL (standard SQL). Senang migrate ke mana-mana server lain kemudian.
   Firebase guna NoSQL — susah nak buat reporting dan queries yang complex.

**Q: Bilakah nak tambah payment/subscription?**
A: Bila ada 10 pengguna yang kata mereka nak bayar. Bukan sebelum itu.
