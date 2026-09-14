const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export type AuthUser = {
  id: string
  email: string
  name: string
  avatar_url?: string
  email_verified: boolean
  provider: string
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${AUTH_URL}/auth/me`, {
      credentials: 'include',
      cache: 'no-store'
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.user || null
  } catch {
    return null
  }
}

export function getGoogleAuthUrl() {
  return `${AUTH_URL}/auth/google`
}

export async function sendEmailVerification(email: string) {
  const res = await fetch(`${AUTH_URL}/auth/email/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email })
  })
  return res.json()
}

export async function logout() {
  await fetch(`${AUTH_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  })
}
