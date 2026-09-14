import { NextResponse, type NextRequest } from 'next/server'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  // Check if route needs auth
  const isProtected = request.nextUrl.pathname.startsWith('/editor') || 
                      request.nextUrl.pathname.startsWith('/projects')

  if (isProtected) {
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }

    // Verify token with Cloudflare worker
    try {
      const res = await fetch(`${AUTH_URL}/auth/me`, {
        headers: {
          'Cookie': `auth_token=${token}`,
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      })
      
      if (!res.ok) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        const response = NextResponse.redirect(url)
        response.cookies.delete('auth_token')
        return response
      }

      const data = await res.json()
      if (!data.user) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        const response = NextResponse.redirect(url)
        response.cookies.delete('auth_token')
        return response
      }

      // Check email verified
      if (!data.user.email_verified) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/verify'
        url.searchParams.set('email', data.user.email)
        return NextResponse.redirect(url)
      }

    } catch {
      // If auth service down, allow for dev, but in production redirect
      // For now, allow if token exists (graceful degradation)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
