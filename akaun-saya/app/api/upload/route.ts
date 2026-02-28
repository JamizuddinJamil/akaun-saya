// app/api/upload/route.ts
// POST /api/upload — upload receipt image, returns public URL
// Uses Supabase Storage (free tier: 1GB)

import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024  // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

export async function POST(req: NextRequest) {
  // 1. Auth
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return Response.json({ error: 'Tidak dibenarkan' }, { status: 401 })
  }

  // 2. Parse form data
  const formData = await req.formData()
  const file = formData.get('receipt') as File | null

  if (!file) {
    return Response.json({ error: 'Tiada fail ditemui' }, { status: 400 })
  }

  // 3. Validate file
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'Fail terlalu besar. Maksimum 5MB.' }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json({ error: 'Jenis fail tidak disokong. Guna JPG atau PNG.' }, { status: 400 })
  }

  // 4. Build storage path
  // receipts/{userId}/{year}/{month}/{timestamp}.jpg
  const now = new Date()
  const year  = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const ext   = file.name.split('.').pop() ?? 'jpg'
  const path  = `${user.id}/${year}/${month}/${Date.now()}.${ext}`

  // 5. Upload to Supabase Storage
  const buffer = await file.arrayBuffer()
  const { data, error } = await supabase.storage
    .from('receipts')           // bucket name in Supabase dashboard
    .upload(path, buffer, {
      contentType:  file.type,
      cacheControl: '3600',
      upsert:       false,
    })

  if (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Gagal muat naik. Cuba lagi.' }, { status: 500 })
  }

  // 6. Get public URL
  const { data: urlData } = supabase.storage
    .from('receipts')
    .getPublicUrl(data.path)

  return Response.json({
    url:  urlData.publicUrl,
    path: data.path,
  }, { status: 201 })
}
