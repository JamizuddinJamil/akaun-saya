 import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
    
    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user completed onboarding
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      })
      
      if (dbUser && !dbUser.onboardingCompleted) {
        return NextResponse.redirect(new URL('/onboarding', req.url))
      }
    }
  }

  // Default: go to dashboard
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
