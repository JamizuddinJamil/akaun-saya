"use server"

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function deleteUserAction() {
  const supabase = createClient() // <- synchronous now

  // 1. Verify user is logged in
  const { data: { user }, error: getUserError } = await supabase.auth.getUser()
  if (getUserError || !user) throw new Error("Tidak sah")

  // 2. Use Admin Client to delete from Auth
  const adminClient = createAdminClient()
  const { error: adminError } = await adminClient.auth.admin.deleteUser(user.id)
  if (adminError) throw adminError

  // 3. Log out
  await supabase.auth.signOut()

  // 4. Redirect to login
  redirect('/login')
}