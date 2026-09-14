"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [captchaSvg, setCaptchaSvg] = useState('')
  const [captchaText, setCaptchaText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const fetchCaptcha = async () => {
    try {
      const res = await fetch(`${AUTH_URL}/admin/captcha`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        return
      }
      setCaptchaId(data.captcha_id)
      setCaptchaSvg(data.captcha_svg)
      setCaptchaText('')
    } catch (e: any) {
      setError('Failed to load captcha')
    }
  }

  useEffect(() => {
    fetchCaptcha()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!captchaText || captchaText.length !== 6) {
      setError('Captcha harus 6 karakter, case sensitive!')
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${AUTH_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password, captcha_id: captchaId, captcha_text: captchaText })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Save admin token
      document.cookie = `admin_token=${data.token}; path=/; max-age=${60*60*8}; SameSite=Lax; Secure`
      window.location.href = '/admin/dashboard'
    } catch (err: any) {
      setError(err.message)
      setAttempts(a => a + 1)
      fetchCaptcha()
      if (attempts >= 4) {
        setError('Terlalu banyak percobaan, IP terkunci 15 menit!')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="mx-auto h-10 w-10 rounded-[12px] bg-white flex items-center justify-center text-black font-[800]">A</div>
          <h1 className="mt-4 text-[22px] font-[700] tracking-[-0.02em] text-white">Admin Dashboard</h1>
          <p className="text-[12px] text-white/50 mt-1">Secure access • Made by XySpace</p>
        </div>

        <Card className="p-6 bg-white">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[11px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-2 w-full h-11 rounded-[12px] border border-[#E8E8E3] bg-white px-4 text-[13px] focus:outline-none focus:border-[#0A0A0A]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full h-11 rounded-[12px] border border-[#E8E8E3] bg-white px-4 text-[13px] focus:outline-none focus:border-[#0A0A0A]"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">Captcha — Case Sensitive!</label>
              <div className="mt-2 flex gap-2">
                <div className="flex-1 rounded-[12px] border border-[#E8E8E3] bg-[#F5F5F0] p-2 flex items-center justify-center">
                  {captchaSvg ? (
                    <img src={captchaSvg} alt="captcha" className="h-[44px] w-auto" />
                  ) : (
                    <div className="h-[44px] w-full animate-pulse bg-[#E8E8E3] rounded" />
                  )}
                </div>
                <button type="button" onClick={fetchCaptcha} className="h-11 w-11 rounded-[12px] border border-[#E8E8E3] bg-white flex items-center justify-center hover:border-[#0A0A0A]">↻</button>
              </div>
              <input
                value={captchaText}
                onChange={e => setCaptchaText(e.target.value)}
                placeholder="Tulis 6 karakter di atas"
                className="mt-2 w-full h-11 rounded-[12px] border border-[#E8E8E3] bg-white px-4 text-[13px] font-mono tracking-[0.1em] focus:outline-none focus:border-[#0A0A0A]"
                maxLength={6}
                required
              />
              <div className="mt-1.5 text-[10px] text-[#9B9B9B]">Super ketat: huruf besar/kecil harus tepat, expired 2 menit, max 5 percobaan / 10 menit</div>
            </div>

            {error && <div className="rounded-[12px] bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full h-11 bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]">
              {loading ? 'Verifying...' : 'Login Admin'}
            </Button>

            <div className="text-[10px] text-[#9B9B9B] text-center leading-[1.4]">
              Akses terbatas. Hanya untuk admin resmi.<br/>Made by XySpace • Secure Access
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
