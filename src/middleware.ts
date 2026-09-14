import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale, isValidLocale } from '@/lib/i18n'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function getLocale(request: NextRequest): string {
  // Check if locale in path
  const pathname = request.nextUrl.pathname
  const pathnameLocale = pathname.split('/')[1]
  if (isValidLocale(pathnameLocale)) return pathnameLocale

  // Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && isValidLocale(cookieLocale)) return cookieLocale

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const lower = acceptLanguage.toLowerCase()
    if (lower.includes('id')) return 'id'
    if (lower.includes('en')) return 'en'
  }

  // Check CF-IPCountry for auto detection HP
  const country = request.headers.get('CF-IPCountry') || request.headers.get('x-vercel-ip-country')
  if (country?.toUpperCase() === 'ID') return 'id'

  return defaultLocale
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip api, _next, static files, admin, auth
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/auth/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/og-image.png' ||
    pathname === '/logo.png' ||
    pathname === '/icon.png'
  ) {
    // Still check auth for protected routes
    if (pathname.startsWith('/api/projects')) {
      // Allow, handled in route
      return NextResponse.next()
    }
    
    // Auth check for editor/projects without locale prefix
    if (pathname === '/editor' || pathname === '/projects') {
      const token = request.cookies.get('auth_token')?.value
      if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }
    
    return NextResponse.next()
  }

  // Check if pathname has locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (!pathnameHasLocale) {
    // Redirect to locale prefixed path
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    newUrl.search = request.nextUrl.search
    
    const response = NextResponse.redirect(newUrl)
    response.cookies.set('NEXT_LOCALE', locale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
    return response
  }

  // If has locale, check auth for protected routes
  const locale = pathname.split('/')[1]
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  
  const isProtected = pathWithoutLocale.startsWith('/editor') || pathWithoutLocale.startsWith('/projects')

  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/auth/login`, request.url))
    }

    try {
      const res = await fetch(`${AUTH_URL}/auth/me`, {
        headers: {
          'Cookie': `auth_token=${token}`,
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      })
      
      if (!res.ok) {
        const url = new URL(`/${locale}/auth/login`, request.url)
        const response = NextResponse.redirect(url)
        response.cookies.delete('auth_token')
        return response
      }

      const data = await res.json()
      if (!data.user) {
        const url = new URL(`/${locale}/auth/login`, request.url)
        const response = NextResponse.redirect(url)
        response.cookies.delete('auth_token')
        return response
      }

      if (!data.user.email_verified) {
        const url = new URL(`/${locale}/auth/verify`, request.url)
        url.searchParams.set('email', data.user.email)
        return NextResponse.redirect(url)
      }
    } catch {}
  }

  const response = NextResponse.next()
  response.cookies.set('NEXT_LOCALE', locale, { maxAge: 60 * 60 * 24 * 365, path: '/' })
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|og-image.png|logo.png|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
