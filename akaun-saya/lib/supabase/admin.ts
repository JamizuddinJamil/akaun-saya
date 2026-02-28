// lib/supabase/admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createAdminClient = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL)
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}