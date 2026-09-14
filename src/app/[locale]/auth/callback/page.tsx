"use client"
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function CallbackPage() {
  const params = useSearchParams()
  const [status, setStatus] = useState('Menyimpan sesi...')

  useEffect(() => {
    const token = params.get('token')
    const next = params.get('next') || '/id/editor'
    const code = params.get('code')

    const saveSession = async (tok: string) => {
      try {
        // Save to localStorage for subscription page getAuthHeaders()
        localStorage.setItem('auth_token', tok)
        // Save to cookie with SameSite=None for cross-site
        document.cookie = `auth_token=${tok}; path=/; max-age=${60*60*24*7}; SameSite=None; Secure`
        setStatus('Memverifikasi akun...')

        // Fetch user profile and persist
        try {
          const res = await fetch(`${AUTH_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${tok}` },
            credentials: 'include'
          })
          const data = await res.json()
          if (data.user) {
            localStorage.setItem('user_profile', JSON.stringify(data.user))
            localStorage.setItem('user_email', data.user.email || '')
          }
        } catch {}

        setStatus('Berhasil! Mengalihkan...')
        setTimeout(() => {
          window.location.href = next
        }, 800)
      } catch (e) {
        setStatus('Gagal simpan sesi, mengalihkan...')
        setTimeout(() => window.location.href = next, 1000)
      }
    }

    if (token) {
      saveSession(token)
    } else if (code) {
      // Supabase code flow - let server handle, but also try to get session
      setStatus('Memproses login...')
      window.location.href = `/auth/callback?code=${code}&next=${encodeURIComponent(next)}`
    } else {
      setStatus('Tidak ada token, mengalihkan...')
      setTimeout(() => window.location.href = next, 1000)
    }
  }, [params])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFCF9]">
      <div className="text-center p-8 rounded-[20px] border border-[#E8E8E3] bg-white max-w-[360px]">
        <div className="h-12 w-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center mx-auto animate-pulse font-[800]">A</div>
        <div className="mt-4 text-[14px] font-[600]">{status}</div>
        <div className="mt-2 text-[11px] text-[#6B6B6B]">Menyimpan profil agar langganan terdeteksi login</div>
        <div className="mt-4 h-1 rounded-full bg-[#F5F5F0] overflow-hidden">
          <div className="h-full bg-[#0A0A0A] animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
        </div>
      </div>
      <style>{`@keyframes progress{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  )
}
