"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function getAuthHeaders() {
  const headers: any = { 'Content-Type': 'application/json' }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export default function LocaleProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const [locale, setLocale] = useState('id')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('free')
  const [projectsCount, setProjectsCount] = useState(0)

  useEffect(() => {
    params.then(p => setLocale(p.locale))
  }, [params])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${AUTH_URL}/auth/me`, { credentials: 'include', headers: getAuthHeaders() })
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          setPlan(data.user.subscription?.plan || 'free')
          localStorage.setItem('user_profile', JSON.stringify(data.user))
          localStorage.setItem('user_email', data.user.email || '')
          if (data.user.token) localStorage.setItem('auth_token', data.user.token)
        }
      } catch {}

      try {
        const supabase = createClient()
        const { data: { user: sbUser } } = await supabase.auth.getUser()
        if (sbUser) {
          if (!user) setUser({ email: sbUser.email, id: sbUser.id, provider: 'supabase' })
          const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', sbUser.id)
          setProjectsCount(count || 0)
          localStorage.setItem('user_email', sbUser.email || '')
        }
      } catch {}

      try {
        if (!user) {
          const stored = localStorage.getItem('user_profile')
          if (stored) {
            const parsed = JSON.parse(stored)
            setUser(parsed)
            setPlan(parsed.subscription?.plan || 'free')
          } else {
            const email = localStorage.getItem('user_email')
            if (email) setUser({ email })
          }
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_profile')
      localStorage.removeItem('user_email')
      document.cookie = 'auth_token=; path=/; max-age=0'
      const supabase = createClient()
      await supabase.auth.signOut()
      await fetch(`${AUTH_URL}/auth/logout`, { credentials: 'include', method: 'POST' }).catch(()=>{})
    } catch {}
    window.location.href = `/${locale}`
  }

  const isId = locale === 'id'
  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
            <span className="text-[13px] font-[700]">autoclipp</span>
            <span className="ml-2 text-[10px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Profile</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/editor`}><Button size="sm" variant="outline" className="h-8">{isId ? 'Editor' : 'Editor'}</Button></Link>
            <Link href={`/${locale}/subscription`}><Button size="sm" className="h-8 bg-[#0A0A0A] text-white">{isId ? 'Langganan' : 'Pricing'}</Button></Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-12">
        {loading ? (
          <Card className="p-8 animate-pulse"><div className="h-32 bg-[#F5F5F0] rounded-[16px]" /></Card>
        ) : !isLoggedIn ? (
          <Card className="p-8 text-center">
            <h1 className="text-[20px] font-[700]">{isId ? 'Belum login' : 'Not logged in'}</h1>
            <p className="mt-2 text-[13px] text-[#6B6B6B]">{isId ? 'Login untuk menyimpan project dan agar halaman langganan terdeteksi login.' : 'Login to save projects and so pricing page detects you are logged in.'}</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href={`/${locale}/auth/login?next=/${locale}/profile`}><Button className="h-10 bg-[#0A0A0A] text-white">{isId ? 'Login Sekarang' : 'Login Now'}</Button></Link>
              <Link href={`/${locale}`}><Button variant="outline" className="h-10">{isId ? 'Kembali' : 'Back'}</Button></Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[16px] font-[800]">{user.email?.[0]?.toUpperCase() || 'U'}</div>
                  <div>
                    <div className="text-[16px] font-[700]">{user.email || 'User'}</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-1">ID: {user.id?.slice(0,12) || 'local'}...</div>
                    <div className="mt-2 flex gap-2">
                      <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600]">{isId ? 'Login Aktif' : 'Active'}</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] font-[600]">{plan.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={handleLogout}>{isId ? 'Logout' : 'Logout'}</Button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] p-3">
                  <div className="text-[10px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">{isId ? 'Paket' : 'Plan'}</div>
                  <div className="mt-1 text-[14px] font-[700]">{plan}</div>
                </div>
                <div className="rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] p-3">
                  <div className="text-[10px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">Projects</div>
                  <div className="mt-1 text-[14px] font-[700]">{projectsCount}</div>
                </div>
                <div className="rounded-[12px] bg-[#0A0A0A] text-white p-3">
                  <div className="text-[10px] font-[700] tracking-[0.06em] uppercase text-white/60">Status</div>
                  <div className="mt-1 text-[12px] font-[700]">{isId ? 'Terverifikasi' : 'Verified'}</div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link href={`/${locale}/editor`} className="flex-1"><Button className="w-full h-10 bg-[#0A0A0A] text-white">{isId ? 'Buka Editor' : 'Open Editor'}</Button></Link>
                <Link href={`/${locale}/subscription`} className="flex-1"><Button variant="outline" className="w-full h-10">{isId ? 'Lihat Paket' : 'View Plans'}</Button></Link>
              </div>
            </Card>

            <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
              <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">{isId ? 'Login Tersimpan' : 'Login Persisted'}</h3>
              <div className="mt-2 text-[11px] leading-[1.6] text-white/60">
                {isId ? 'Sesi kamu sudah disimpan ke localStorage dan cookie SameSite=None. Halaman langganan akan deteksi login otomatis.' : 'Your session is saved to localStorage and SameSite=None cookie. Pricing page will auto-detect login.'}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
