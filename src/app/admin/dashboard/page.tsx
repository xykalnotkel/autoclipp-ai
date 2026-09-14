"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [realtime, setRealtime] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
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
        const [statsRes, realtimeRes, feedbackRes] = await Promise.all([
          fetch(`${AUTH_URL}/admin/stats`, { credentials: 'include' }),
          fetch(`${AUTH_URL}/analytics/realtime`, { credentials: 'include' }).catch(() => null),
          fetch(`${AUTH_URL}/feedbacks?limit=10`).catch(() => null)
        ])
        
        const statsData = await statsRes.json()
        if (statsData.stats) setStats(statsData.stats)
        
        if (realtimeRes && realtimeRes.ok) {
          const realtimeData = await realtimeRes.json()
          if (realtimeData.realtime) setRealtime(realtimeData.realtime)
        }

        if (feedbackRes && feedbackRes.ok) {
          const fbData = await feedbackRes.json()
          if (fbData.feedbacks) setFeedbacks(fbData.feedbacks)
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
              <span className="text-[10px] font-[600] tracking-[0.06em] uppercase bg-white/10 px-2 py-0.5 rounded-full">Admin</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <span className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-[600]">Dashboard</span>
              <Link href="/admin/payments" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Payments</Link>
              <Link href="/admin/users" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Users</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/60 hidden md:block">{admin?.username}</span>
            <Button size="sm" variant="outline" className="h-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-black" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-[700] tracking-[-0.02em]">Admin Dashboard</h1>
            <p className="text-[12px] text-[#6B6B6B] mt-1">Real user analytics • Live monitoring • Made by XySpace</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-[600]">LIVE</span>
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
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Page views today</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Pending Payments</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em] text-amber-600">{stats?.pending_payments || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Needs verification</div>
          </Card>
          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-white/60">Revenue</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em]">Rp {(stats?.total_revenue || 0).toLocaleString('id-ID')}</div>
            <div className="mt-1 text-[11px] text-white/60">Paid: {stats?.paid_payments || 0} • Active: {stats?.active_subscriptions || 0}</div>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <Card className="p-5 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Top Pages (24h)</h3>
              <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600]">Live 5s</span>
            </div>
            <div className="mt-4 space-y-2">
              {realtime?.top_pages?.length ? realtime.top_pages.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#E8E8E3]/50 last:border-0">
                  <span className="text-[12px] font-[500]">{p.page}</span>
                  <span className="text-[11px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{p.views} views</span>
                </div>
              )) : <div className="text-[11px] text-[#9B9B9B] py-4">No data yet, tracking active</div>}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Countries</h3>
            <div className="mt-4 space-y-2">
              {realtime?.countries?.length ? realtime.countries.map((c: any, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[12px]">{c.country || 'Unknown'}</span>
                  <span className="text-[11px] text-[#6B6B6B]">{c.count}</span>
                </div>
              )) : <div className="text-[11px] text-[#9B9B9B]">Waiting for data...</div>}
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
            <h3 className="text-[12px] font-[700]">Real Feedbacks</h3>
            <div className="mt-4 space-y-2 max-h-[300px] overflow-auto">
              {feedbacks.length ? feedbacks.map((f: any, i: number) => (
                <div key={i} className="rounded-[12px] bg-[#F5F5F0] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-[600]">{f.name}</span>
                    <span className="text-[10px]">{"★".repeat(f.rating)}</span>
                  </div>
                  <div className="text-[11px] text-[#6B6B6B] mt-1">{f.message}</div>
                </div>
              )) : <div className="text-[11px] text-[#9B9B9B]">No feedbacks yet</div>}
            </div>
          </Card>

          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <h3 className="text-[12px] font-[700]">System Status</h3>
            <div className="mt-3 space-y-1.5 text-[11px] text-white/60">
              <div>✓ Auth: Active</div>
              <div>✓ Payments: QRIS/DANA Real Verification</div>
              <div>✓ Feedbacks: Real user ratings</div>
              <div>✓ AI: Grok via secure backend</div>
              <div>✓ Multi Language: /id /en Auto Detect</div>
              <div>✓ Branding: Made by XySpace</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
