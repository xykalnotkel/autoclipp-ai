"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [realtime, setRealtime] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/admin/me`, { credentials: 'include' })
        const data = await res.json()
        if (!data.admin) {
          window.location.href = '/admin/login'
          return
        }
        setAdmin(data.admin)
      } catch {
        window.location.href = '/admin/login'
      }
    }

    const fetchStats = async () => {
      try {
        const [statsRes, realtimeRes] = await Promise.all([
          fetch(`${AUTH_URL}/admin/stats`, { credentials: 'include' }),
          fetch(`${AUTH_URL}/analytics/realtime`, { credentials: 'include' }).catch(() => null)
        ])
        
        const statsData = await statsRes.json()
        if (statsData.stats) setStats(statsData.stats)
        
        if (realtimeRes && realtimeRes.ok) {
          const realtimeData = await realtimeRes.json()
          if (realtimeData.realtime) setRealtime(realtimeData.realtime)
        }
      } catch {}
      setLoading(false)
    }

    checkAuth()
    fetchStats()
    
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    document.cookie = 'admin_token=; path=/; max-age=0'
    document.cookie = 'auth_token=; path=/; max-age=0'
    window.location.href = '/admin/login'
  }

  if (loading) {
    return <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-[1280px] px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" className="h-7 w-7 rounded-[8px] bg-white object-cover" />
              <span className="text-[13px] font-[700]">autoclipp</span>
              <span className="text-[10px] font-[600] tracking-[0.06em] uppercase bg-white/10 px-2 py-0.5 rounded-full">Admin • kall</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <span className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-[600]">Dashboard</span>
              <Link href="/admin/payments" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Payments QRIS</Link>
              <Link href="/admin/users" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Users Real</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/60 hidden md:block">{admin?.username} • Haekal123</span>
            <Button size="sm" variant="outline" className="h-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-black" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-[700] tracking-[-0.02em]">Admin Dashboard — Real User Analytics</h1>
            <p className="text-[12px] text-[#6B6B6B] mt-1">Login: kall / Haekal123 + captcha super ketat • Cloudflare D1 realtime</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-[600]">REALTIME LIVE</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Active Now</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em] text-green-600">{realtime?.active_now || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Real users last 5 min</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Today Views</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em]">{realtime?.today_views || stats?.total_users || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Page views hari ini</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Pending QRIS/DANA</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em] text-amber-600">{stats?.pending_payments || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Butuh verifikasi</div>
          </Card>
          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-white/60">Revenue 5k-100k</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em]">Rp {(stats?.total_revenue || 0).toLocaleString('id-ID')}</div>
            <div className="mt-1 text-[11px] text-white/60">Paid: {stats?.paid_payments || 0} • Active: {stats?.active_subscriptions || 0}</div>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Realtime — Top Pages (24h)</h3>
              <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600]">Live 5s polling</span>
            </div>
            <div className="mt-4 space-y-2">
              {realtime?.top_pages?.length ? realtime.top_pages.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#E8E8E3]/50 last:border-0">
                  <span className="text-[12px] font-[500]">{p.page}</span>
                  <span className="text-[11px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{p.views} views</span>
                </div>
              )) : <div className="text-[11px] text-[#9B9B9B] py-4">Belum ada data, tracking aktif via /analytics/track</div>}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Real User — Countries</h3>
            <div className="mt-4 space-y-2">
              {realtime?.countries?.length ? realtime.countries.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12px]">{c.country || 'Unknown'}</span>
                  <span className="text-[11px] text-[#6B6B6B]">{c.count}</span>
                </div>
              )) : <div className="text-[11px] text-[#9B9B9B]">Menunggu data realtime...</div>}
            </div>
            <div className="mt-6">
              <h4 className="text-[11px] font-[600]">Recent Events</h4>
              <div className="mt-2 space-y-1.5 max-h-[160px] overflow-auto">
                {realtime?.recent?.slice(0, 8).map((e: any, i: number) => (
                  <div key={i} className="text-[10px] font-mono text-[#6B6B6B] truncate">{new Date(e.created_at).toLocaleTimeString()} {e.event_type} {e.page} {e.country}</div>
                )) || <div className="text-[10px] text-[#9B9B9B]">No events yet</div>}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="text-[12px] font-[700]">Branding — Logo Monokrom</h3>
            <div className="mt-4 flex items-center gap-4">
              <img src="/logo.png" alt="logo" className="h-12 w-12 rounded-[12px] border border-[#E8E8E3] bg-white object-cover" />
              <img src="/icon.png" alt="icon" className="h-12 w-12 rounded-[12px] border border-[#E8E8E3] bg-[#0A0A0A] object-cover" />
              <img src="/og-image.png" alt="og" className="h-12 w-20 rounded-[8px] border border-[#E8E8E3] object-cover" />
            </div>
            <div className="mt-3 text-[11px] text-[#6B6B6B]">Logo simple monokrom A + play, premium, dipakai untuk favicon, OG image, branding. File: /logo.png, /icon.png, /og-image.png, /favicon.png</div>
          </Card>

          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <h3 className="text-[12px] font-[700]">SEO — OG, Favicon, Analytics</h3>
            <div className="mt-3 space-y-1.5 text-[11px] text-white/60">
              <div>✓ Title: AutoClipp AI — YouTube to Viral Shorts</div>
              <div>✓ OG Image: /og-image.png 1200x630</div>
              <div>✓ Favicon: /favicon.png + /icon.png Apple touch</div>
              <div>✓ Meta: keywords, robots, twitter card, theme-color</div>
              <div>✓ Realtime: Cloudflare D1 analytics_events + sessions, 5s polling</div>
              <div>✓ Real User: IP, country via CF-IPCountry, device detection</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
