"use server"

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'

export async function deleteUserAction() {
  const supabase = await createClient()

  const { data: { user }, error: getUserError } = await supabase.auth.getUser()
  if (getUserError || !user) throw new Error("Tidak sah")

  const adminClient = createAdminClient()
  const { error: adminError } = await adminClient.auth.admin.deleteUser(user.id)
  if (adminError) throw adminError

  await supabase.auth.signOut()

  redirect('/login')
}