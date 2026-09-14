import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const token = searchParams.get('token')
  const next = searchParams.get('next') ?? '/id/editor'

  // Cloudflare auth callback
  if (token) {
    const cookieStore = await cookies()
    // Use SameSite=None + Secure so cross-site auth works, plus httpOnly for security
    // Also need non-httpOnly version for frontend fallback via JS page
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    })
    
    // Redirect to locale callback page that will store in localStorage
    const localeNext = next.startsWith('/id/') || next.startsWith('/en/') ? next : `/id${next.startsWith('/') ? next : `/${next}`}`
    const redirectUrl = new URL(`${origin}${localeNext.startsWith('/id/auth/callback') || localeNext.startsWith('/en/auth/callback') ? localeNext : `/id/auth/callback`}`)
    redirectUrl.searchParams.set('token', token)
    redirectUrl.searchParams.set('next', next)
    return NextResponse.redirect(redirectUrl.toString())
  }

  // Supabase fallback (legacy)
  const code = searchParams.get('code')
  if (code) {
    const { createServerClient } = await import('@supabase/ssr')
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, { ...options, sameSite: 'none' as any, secure: true })
              )
            } catch {}
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`)
}
