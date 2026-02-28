"use server"

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function deleteUserAction() {
  const supabase = createClient()

  // 1. Sahkan user memang tengah log masuk
  const { data: { user }, error: getUserError } = await supabase.auth.getUser()
  if (getUserError || !user) throw new Error("Tidak sah")

  // 2. Gunakan Admin Client untuk padam dari Auth
  const adminClient = createAdminClient()
  const { error } = await adminClient.auth.admin.deleteUser(user.id)
  if (error) throw error

  // 3. Log keluar (buang cookies)
  await supabase.auth.signOut()

  // 4. Redirect ke login
  redirect('/login')
}