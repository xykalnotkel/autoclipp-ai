"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = () => {
    window.location.href = `${AUTH_URL}/auth/google`
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch(`${AUTH_URL}/auth/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email')
      }
      
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-[10px] bg-[#0A0A0A] flex items-center justify-center text-white text-[13px] font-[800]">A</div>
            <span className="text-[15px] font-[700] tracking-[-0.02em]">autoclipp</span>
          </Link>
          <h1 className="mt-6 text-[24px] font-[700] tracking-[-0.03em]">Welcome back</h1>
          <p className="mt-2 text-[13px] text-[#6B6B6B]">Sign in to continue creating viral clips</p>
        </div>

        <Card className="p-6">
          <Button onClick={handleGoogleLogin} disabled={loading} className="w-full h-11 bg-white border border-[#E8E8E3] text-[#0A0A0A] hover:bg-[#F5F5F0] font-[600]">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8E8E3]" />
            <span className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#9B9B9B]">Or</span>
            <div className="h-px flex-1 bg-[#E8E8E3]" />
          </div>

          {sent ? (
            <div className="rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] p-4 text-center">
              <div className="text-[13px] font-[600]">Check your email</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">We sent a verification link to {email}. Link expires in 15 minutes.</div>
              <div className="mt-3 text-[11px] text-[#9B9B9B]">Email must be verified to continue. Check spam folder if not found.</div>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full h-11 rounded-full border border-[#E8E8E3] bg-white px-4 text-[13px] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#0A0A0A]"
              />
              {error && <div className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-full px-3 py-2">{error}</div>}
              <Button type="submit" disabled={loading} className="w-full h-11">
                {loading ? 'Sending...' : 'Send verification link'}
              </Button>
              <div className="text-[11px] text-[#9B9B9B] text-center">Email verification required. We will send a secure link.</div>
            </form>
          )}

          <div className="mt-6 text-center text-[11px] text-[#9B9B9B] leading-[1.5]">
            By continuing, you agree to our Terms and Privacy Policy. Email must be verified.
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">← Back to home</Link>
        </div>

        <div className="mt-8 rounded-[12px] bg-[#0A0A0A] text-white p-4 text-[11px] leading-[1.5]">
          <div className="font-[600]">Cloudflare Auth Backend</div>
          <div className="text-white/60 mt-1">Secure JWT, D1 database, Resend email verification, Google OAuth. All tokens server-side, optimized for edge.</div>
        </div>
      </div>
    </div>
  )
}
