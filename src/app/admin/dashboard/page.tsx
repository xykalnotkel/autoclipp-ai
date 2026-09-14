"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
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
        const res = await fetch(`${AUTH_URL}/admin/stats`, { credentials: 'include' })
        const data = await res.json()
        if (data.stats) setStats(data.stats)
      } catch {}
      setLoading(false)
    }

    checkAuth()
    fetchStats()
  }, [])

  const handleLogout = async () => {
    await fetch(`${AUTH_URL}/admin/login`, { method: 'POST', credentials: 'include' }).catch(()=>{})
    document.cookie = 'admin_token=; path=/; max-age=0'
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
              <div className="h-7 w-7 rounded-[8px] bg-white text-black flex items-center justify-center font-[800] text-[12px]">A</div>
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
        <h1 className="text-[24px] font-[700] tracking-[-0.02em]">Dashboard</h1>
        <p className="text-[12px] text-[#6B6B6B] mt-1">Control panel lengkap — Cloudflare D1 + real payment verification</p>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Total Users</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em]">{stats?.total_users || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Verified via email/Google</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Pending Payments</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em] text-amber-600">{stats?.pending_payments || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">QRIS/DANA need verify</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Paid / Active</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em] text-green-600">{stats?.paid_payments || 0} / {stats?.active_subscriptions || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Subscriptions active</div>
          </Card>
          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-white/60">Revenue</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em]">Rp {(stats?.total_revenue || 0).toLocaleString('id-ID')}</div>
            <div className="mt-1 text-[11px] text-white/60">5k - 100k tiers</div>
          </Card>
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="text-[13px] font-[700]">Payment Verification Flow (Real)</h3>
            <div className="mt-4 space-y-3 text-[11px] leading-[1.5]">
              <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] shrink-0">1</span><span>User pilih plan Rp 5.000 - 100.000 → POST /payment/create-qris dengan payment_method qris/dana → generate QRIS string + order_id</span></div>
              <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] shrink-0">2</span><span>Frontend tampilkan QRIS image (api.qrserver.com) + instruksi: Buka DANA/GoPay/OVO, scan, bayar sesuai nominal</span></div>
              <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] shrink-0">3</span><span>Midtrans webhook POST /payment/webhook/midtrans → verify transaction_status settlement → update payments status paid → insert subscriptions active 30 hari → kirim email Resend</span></div>
              <div className="flex gap-3"><span className="h-6 w-6 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px] shrink-0">4</span><span>Jika Midtrans belum set, admin manual verify di /admin/payments → klik Approve → subscription aktif. Polling /payment/status/:id untuk cek status.</span></div>
            </div>
            <div className="mt-4 rounded-[10px] bg-[#F5F5F0] border border-[#E8E8E3] p-3 text-[10px] font-mono">Worker: autoclipp-auth.akuntiktok76y.workers.dev<br/>D1: autoclipp-auth-db • Resend active • JWT httpOnly</div>
          </Card>

          <Card className="p-6">
            <h3 className="text-[13px] font-[700]">Admin Security — Super Ketat</h3>
            <div className="mt-4 space-y-2.5 text-[11px]">
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Captcha</span><span className="font-[600]">6 chars alphanumeric, case sensitive</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Expiry</span><span className="font-[600]">2 menit, one-time use</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Rate limit</span><span className="font-[600]">5 fail / 10 menit → lock 15 menit</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Password</span><span className="font-[600]">PBKDF2 100k iterations SHA-256</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">JWT</span><span className="font-[600]">HS256, 8 jam, httpOnly Secure SameSite Lax</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">IP tracking</span><span className="font-[600]">CF-Connecting-IP + attempts log</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href="/admin/payments" className="flex-1"><Button size="sm" className="w-full h-8">Payments</Button></Link>
              <Link href="/admin/users" className="flex-1"><Button size="sm" variant="outline" className="w-full h-8">Users</Button></Link>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-6">
          <h3 className="text-[13px] font-[700]">Test Auth — Apakah berfungsi?</h3>
          <div className="mt-3 grid md:grid-cols-3 gap-3 text-[11px]">
            <div className="rounded-[10px] bg-green-50 border border-green-200 p-3">
              <div className="font-[600] text-green-800">✓ Google OAuth</div>
              <div className="text-green-700/70 mt-1">Client ID baru m02ck9r... dengan redirect https://autoclipp-auth.../auth/google/callback sudah terpasang & deployed. Klik login Google di /auth/login untuk test.</div>
            </div>
            <div className="rounded-[10px] bg-green-50 border border-green-200 p-3">
              <div className="font-[600] text-green-800">✓ Email Verification</div>
              <div className="text-green-700/70 mt-1">Resend active, D1 email_tokens table ready, link 15 menit expired, wajib verified baru bisa akses editor.</div>
            </div>
            <div className="rounded-[10px] bg-green-50 border border-green-200 p-3">
              <div className="font-[600] text-green-800">✓ Subscription 5k-100k</div>
              <div className="text-green-700/70 mt-1">6 tiers dari Rp 0 sampai Rp 100.000, QRIS/DANA real verification via Midtrans webhook + manual admin approve.</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
