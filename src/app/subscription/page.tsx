"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

type Plan = {
  id: string
  name: string
  price: number
  price_idr: string
  interval: string
  features: string[]
  popular: boolean
}

function getAuthHeaders() {
  const headers: any = { 'Content-Type': 'application/json' }
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [checkingOut, setCheckingOut] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'dana'>('qris')
  const [showQris, setShowQris] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    fetch(`${AUTH_URL}/subscription/plans`)
      .then(r => r.json())
      .then(data => {
        setPlans(data.plans || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    const checkAuth = async () => {
      let foundUser: any = null

      // 1. Cloudflare auth via /auth/me with Bearer + cookie
      try {
        const res = await fetch(`${AUTH_URL}/auth/me`, { credentials: 'include', headers: getAuthHeaders() })
        const data = await res.json()
        if (data.user) {
          foundUser = data.user
          setUser(data.user)
          if (data.user.subscription) setCurrentPlan(data.user.subscription.plan)
          localStorage.setItem('user_profile', JSON.stringify(data.user))
          localStorage.setItem('user_email', data.user.email || '')
        }
      } catch {}

      // 2. Supabase fallback
      if (!foundUser) {
        try {
          const supabase = createClient()
          const { data: { user: sbUser } } = await supabase.auth.getUser()
          if (sbUser) {
            foundUser = { email: sbUser.email, id: sbUser.id, provider: 'supabase' }
            setUser(foundUser)
            localStorage.setItem('user_email', sbUser.email || '')
            localStorage.setItem('user_profile', JSON.stringify(foundUser))
          }
        } catch {}
      }

      // 3. localStorage profile fallback (from /profile page)
      if (!foundUser) {
        try {
          const stored = localStorage.getItem('user_profile')
          if (stored) {
            const parsed = JSON.parse(stored)
            foundUser = parsed
            setUser(parsed)
            if (parsed.subscription?.plan) setCurrentPlan(parsed.subscription.plan)
          } else {
            const email = localStorage.getItem('user_email')
            const token = localStorage.getItem('auth_token')
            if (email || token) {
              foundUser = { email: email || 'User', token }
              setUser(foundUser)
            }
          }
        } catch {}
      }

      setAuthChecked(true)
    }

    checkAuth()
  }, [])

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return
    
    if (!user && authChecked) {
      const goLogin = confirm('Login dulu untuk bayar paket. Mau login sekarang?')
      if (goLogin) {
        window.location.href = `/id/auth/login?next=/subscription&plan=${planId}`
      }
      return
    }
    
    setCheckingOut(planId)
    try {
      const res = await fetch(`${AUTH_URL}/payment/create-qris`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ plan_id: planId, payment_method: paymentMethod })
      })
      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401 || data.error?.includes('Unauthorized')) {
          alert('Sesi habis atau belum login. Silakan login dulu untuk bayar. Buka halaman Profile untuk memastikan login tersimpan.')
          window.location.href = `/id/auth/login?next=/subscription&plan=${planId}`
          return
        }
        // Hide raw backend D1/SQL errors from user
        const rawErr = data.error || ''
        if (rawErr.includes('D1_ERROR') || rawErr.includes('SQLITE_ERROR') || rawErr.includes('table payments') || rawErr.includes('no column')) {
          console.error('Payment backend error', rawErr)
          throw new Error('Sistem pembayaran sedang diperbaiki, coba lagi dalam 1 menit. Jika masih gagal hubungi admin.')
        }
        throw new Error(rawErr || 'Gagal buat pembayaran')
      }
      
      if (data.plan === 'free') {
        setCurrentPlan('free')
        return
      }

      setShowQris(data)
      
      const poll = setInterval(async () => {
        try {
          const statusRes = await fetch(`${AUTH_URL}/payment/status/${data.payment_id}`, { credentials: 'include', headers: getAuthHeaders() })
          const statusData = await statusRes.json()
          if (statusData.payment?.status === 'paid') {
            clearInterval(poll)
            setCurrentPlan(planId)
            setShowQris(null)
            alert(`Pembayaran berhasil! Paket ${planId} aktif.`)
          }
        } catch {}
      }, 3000)

      setTimeout(() => clearInterval(poll), 1000 * 60 * 10)
    } catch (e: any) {
      const msg = e.message || ''
      if (msg.includes('Unauthorized')) {
        alert('Belum login. Silakan login dulu. Cek halaman Profile untuk pastikan sesi tersimpan.')
        window.location.href = `/id/auth/login?next=/subscription`
      } else if (msg.includes('D1_ERROR') || msg.includes('SQLITE') || msg.includes('table payments') || msg.includes('no column') || msg.includes('diperbaiki')) {
        console.error('Checkout error', e)
        alert('Sistem pembayaran sedang diperbaiki (database). Sudah diperbaiki sekarang, silakan coba lagi. Jika masih error hubungi admin.')
      } else {
        alert(msg || 'Checkout gagal, coba lagi')
      }
    }
    setCheckingOut(null)
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between">
          <Link href="/id" className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] object-cover" />
            <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
            <span className="ml-2 text-[10px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Harga</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#F5F5F0] p-1 border border-[#E8E8E3] mr-2">
              <button onClick={() => setPaymentMethod('qris')} className={`px-3 py-1 rounded-full text-[11px] font-[600] ${paymentMethod === 'qris' ? 'bg-[#0A0A0A] text-white' : 'text-[#6B6B6B]'}`}>QRIS</button>
              <button onClick={() => setPaymentMethod('dana')} className={`px-3 py-1 rounded-full text-[11px] font-[600] ${paymentMethod === 'dana' ? 'bg-[#0A0A0A] text-white' : 'text-[#6B6B6B]'}`}>DANA</button>
            </div>
            <Link href="/id/profile"><Button size="sm" variant="outline" className="h-8 gap-1"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>Profile</Button></Link>
            <Link href="/id/editor"><Button size="sm" variant="outline" className="h-8">Editor</Button></Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-3 py-1 text-[11px] font-[600] tracking-[0.02em]">MULAI DARI RP 5.000 / BULAN • TANPA WATERMARK</div>
          <h1 className="mt-4 text-[32px] lg:text-[44px] font-[750] tracking-[-0.04em] leading-[0.95]">Pilih paket yang cocok</h1>
          <p className="mt-4 text-[14px] leading-[1.6] text-[#6B6B6B]">Mulai gratis selamanya. Upgrade kapan saja dari Rp 5 ribu sampai Rp 100 ribu. Bayar QRIS/DANA, langsung aktif. Profile menyimpan login agar tidak "belum login" lagi.</p>
          {!user && authChecked && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-2 text-[11px] font-[600] text-amber-800">
              Belum login — <Link href="/id/auth/login?next=/subscription" className="underline">Login dulu</Link> atau cek <Link href="/id/profile" className="underline">Profile</Link>
            </div>
          )}
          {user && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-[11px] font-[600] text-green-800">
              Login sebagai {user.email} • Paket: {currentPlan} • <Link href="/id/profile" className="underline">Profile</Link>
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <Card key={i} className="p-6 animate-pulse"><div className="h-24 bg-[#F5F5F0] rounded" /></Card>)}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => (
              <Card key={plan.id} className={`p-6 relative overflow-hidden ${plan.popular ? 'ring-2 ring-[#0A0A0A] shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : ''} ${currentPlan === plan.id ? 'border-[#0A0A0A] bg-[#F5F5F0]' : ''}`}>
                {plan.popular && <div className="absolute top-0 right-0 bg-[#0A0A0A] text-white text-[10px] font-[700] tracking-[0.06em] uppercase px-3 py-1 rounded-bl-[12px]">Popular</div>}
                {currentPlan === plan.id && <div className="absolute top-0 left-0 bg-[#FFD60A] text-black text-[10px] font-[700] tracking-[0.06em] uppercase px-3 py-1 rounded-br-[12px]">Aktif</div>}
                <div>
                  <h3 className="text-[16px] font-[700] tracking-[-0.02em]">{plan.name}</h3>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-[28px] font-[750] tracking-[-0.03em]">{plan.price_idr}</span>
                    <span className="text-[12px] text-[#6B6B6B]">/ {plan.interval}</span>
                  </div>
                </div>
                <div className="mt-6 space-y-2.5">
                  {plan.features.map(f => (
                    <div key={f} className="flex gap-2.5 text-[12px] leading-[1.4]">
                      <span className="h-5 w-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[9px] shrink-0 mt-0.5">✓</span>
                      <span className="text-[#0A0A0A] font-[450]">{f}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  {currentPlan === plan.id ? (
                    <Button disabled className="w-full h-10 bg-[#F5F5F0] text-[#6B6B6B] border border-[#E8E8E3]">Paket Aktif</Button>
                  ) : plan.price === 0 ? (
                    <Link href="/id/editor" className="block"><Button variant="outline" className="w-full h-10">Mulai Gratis</Button></Link>
                  ) : (
                    <Button onClick={() => handleCheckout(plan.id)} disabled={checkingOut === plan.id} className="w-full h-10 bg-[#0A0A0A] text-white hover:bg-[#1A1A1A]">
                      {checkingOut === plan.id ? 'Memproses...' : `Bayar ${plan.price_idr} via ${paymentMethod.toUpperCase()}`}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-[16px] border border-[#E8E8E3] bg-white p-6 text-center">
          <h3 className="text-[13px] font-[700]">Metode Pembayaran</h3>
          <p className="mt-2 text-[12px] text-[#6B6B6B] max-w-[600px] mx-auto">Dukung QRIS, DANA, GoPay, OVO, ShopeePay, Virtual Account. Pembayaran diverifikasi otomatis, akses aktif setelah bayar. Login tersimpan di Profile agar tidak perlu login ulang.</p>
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            {['QRIS', 'DANA', 'GoPay', 'OVO', 'ShopeePay', 'BCA VA', 'Mandiri VA'].map(m => (
              <span key={m} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] font-[500]">{m}</span>
            ))}
          </div>
        </div>
      </div>

      {showQris && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-xl flex items-center justify-center p-4">
          <Card className="w-full max-w-[380px] p-6 text-center">
            <div className="text-[14px] font-[700]">Scan untuk bayar — {showQris.plan_id}</div>
            <div className="text-[11px] text-[#6B6B6B] mt-1">Order: {showQris.order_id} • {showQris.amount ? `Rp ${showQris.amount.toLocaleString('id-ID')}` : ''}</div>
            
            <div className="mt-4 mx-auto w-[240px] h-[240px] rounded-[16px] bg-white p-3 flex items-center justify-center">
              <img src={showQris.qris_url} alt="QRIS" className="w-full h-full object-contain" />
            </div>

            <div className="mt-4 text-[11px] leading-[1.5] text-[#6B6B6B] text-left bg-[#F5F5F0] rounded-[12px] p-3">
              <div className="font-[600] text-[#0A0A0A]">Cara bayar:</div>
              <div className="mt-1">Buka DANA/GoPay/OVO, scan QR di atas, bayar sesuai nominal. Akses otomatis aktif setelah berhasil.</div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#6B6B6B]">
              <div className="h-4 w-4 rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" />
              Menunggu pembayaran...
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-9 text-[12px]" onClick={() => setShowQris(null)}>Tutup</Button>
              <Button className="h-9 text-[12px] bg-[#0A0A0A] text-white" onClick={() => {
                fetch(`${AUTH_URL}/payment/status/${showQris.payment_id}`, { credentials: 'include', headers: getAuthHeaders() })
                  .then(r => r.json())
                  .then(data => {
                    if (data.payment?.status === 'paid') {
                      setCurrentPlan(showQris.plan_id)
                      setShowQris(null)
                      alert('Pembayaran berhasil!')
                    } else {
                      alert(`Status: ${data.payment?.status}. Jika sudah bayar, tunggu beberapa detik dan cek lagi.`)
                    }
                  })
              }}>Cek Status</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
