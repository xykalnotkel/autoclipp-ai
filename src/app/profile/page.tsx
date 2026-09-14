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

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState('free')
  const [projectsCount, setProjectsCount] = useState(0)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // 1. Try Cloudflare auth
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

      // 2. Try Supabase
      try {
        const supabase = createClient()
        const { data: { user: sbUser } } = await supabase.auth.getUser()
        if (sbUser && !user) {
          setUser({ email: sbUser.email, id: sbUser.id, provider: 'supabase' })
          localStorage.setItem('user_email', sbUser.email || '')
          // count projects
          const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', sbUser.id)
          setProjectsCount(count || 0)
        } else if (sbUser) {
          const supabase2 = createClient()
          const { count } = await supabase2.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', sbUser.id)
          setProjectsCount(count || 0)
        }
      } catch {}

      // 3. Fallback localStorage
      if (!user) {
        try {
          const stored = localStorage.getItem('user_profile')
          if (stored) {
            const parsed = JSON.parse(stored)
            setUser(parsed)
            setPlan(parsed.subscription?.plan || 'free')
          } else {
            const email = localStorage.getItem('user_email')
            if (email) setUser({ email })
          }
        } catch {}
      }
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
    window.location.href = '/id'
  }

  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between">
          <Link href="/id" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
            <span className="text-[13px] font-[700]">autoclipp</span>
            <span className="ml-2 text-[10px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Profile</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/id/editor"><Button size="sm" variant="outline" className="h-8">Editor</Button></Link>
            <Link href="/id/subscription"><Button size="sm" className="h-8 bg-[#0A0A0A] text-white">Langganan</Button></Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-6 lg:px-8 py-12">
        {loading ? (
          <Card className="p-8 animate-pulse"><div className="h-32 bg-[#F5F5F0] rounded-[16px]" /></Card>
        ) : !isLoggedIn ? (
          <Card className="p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h1 className="mt-4 text-[20px] font-[700]">Belum login</h1>
            <p className="mt-2 text-[13px] text-[#6B6B6B]">Login untuk menyimpan project, lihat paket langganan, dan agar halaman langganan terdeteksi login.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link href="/id/auth/login?next=/profile"><Button className="h-10 bg-[#0A0A0A] text-white">Login Sekarang</Button></Link>
              <Link href="/id"><Button variant="outline" className="h-10">Kembali</Button></Link>
            </div>
            <div className="mt-6 rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] p-3 text-[11px] text-[#6B6B6B] text-left">
              <div className="font-[600] text-[#0A0A0A]">Kenapa perlu login?</div>
              <div className="mt-1">Profile menyimpan email dan token ke localStorage, jadi halaman langganan bisa deteksi kamu sudah login dan tidak muncul "belum login" lagi.</div>
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
                      <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600]">Login Aktif</span>
                      <span className="text-[10px] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] font-[600]">{plan.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={handleLogout}>Logout</Button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] p-3">
                  <div className="text-[10px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">Paket</div>
                  <div className="mt-1 text-[14px] font-[700]">{plan}</div>
                  <div className="text-[10px] text-[#6B6B6B]">Aktif</div>
                </div>
                <div className="rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] p-3">
                  <div className="text-[10px] font-[700] tracking-[0.06em] uppercase text-[#6B6B6B]">Projects</div>
                  <div className="mt-1 text-[14px] font-[700]">{projectsCount}</div>
                  <div className="text-[10px] text-[#6B6B6B]">Tersimpan</div>
                </div>
                <div className="rounded-[12px] bg-[#0A0A0A] text-white p-3">
                  <div className="text-[10px] font-[700] tracking-[0.06em] uppercase text-white/60">Status</div>
                  <div className="mt-1 text-[12px] font-[700]">Terverifikasi</div>
                  <div className="text-[10px] text-white/60">Login tersimpan</div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Link href="/id/editor" className="flex-1"><Button className="w-full h-10 bg-[#0A0A0A] text-white">Buka Editor</Button></Link>
                <Link href="/id/subscription" className="flex-1"><Button variant="outline" className="w-full h-10">Lihat Paket</Button></Link>
              </div>
            </Card>

            <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
              <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Info Penyimpanan Login</h3>
              <div className="mt-3 space-y-2 text-[11px] leading-[1.6] text-white/60">
                <div>Profile ini menyimpan sesi kamu ke localStorage (auth_token, user_profile) dan cookie SameSite=None Secure.</div>
                <div>Halaman langganan sekarang akan baca token yang sama, jadi tidak lagi muncul "belum login" padahal sudah login.</div>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">localStorage: auth_token</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">cookie: auth_token</span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">Persist</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
