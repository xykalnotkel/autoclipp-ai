"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

type Plan = {
  id: string
  name: string
  price: number
  price_idr: string
  interval: string
  features: string[]
  popular: boolean
  color: string
}

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [checkingOut, setCheckingOut] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${AUTH_URL}/subscription/plans`)
      .then(r => r.json())
      .then(data => {
        setPlans(data.plans || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch(`${AUTH_URL}/subscription/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.subscription) setCurrentPlan(data.subscription.plan)
      })
      .catch(() => {})
  }, [])

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') return
    
    setCheckingOut(planId)
    try {
      const res = await fetch(`${AUTH_URL}/subscription/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan_id: planId })
      })
      const data = await res.json()
      
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else if (data.success) {
        alert(`Berhasil! Plan ${planId} aktif.`)
        setCurrentPlan(planId)
      }
    } catch (e) {
      alert('Checkout failed, coba lagi')
    }
    setCheckingOut(null)
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
            <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
            <span className="ml-2 text-[10px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Subscription</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/editor"><Button size="sm" variant="outline" className="h-8">Editor</Button></Link>
            <Link href="/projects"><Button size="sm" className="h-8">Projects</Button></Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12 lg:py-16">
        <div className="text-center max-w-[640px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-3 py-1 text-[11px] font-[600] tracking-[0.02em]">MULAI DARI RP 5.000 / BULAN</div>
          <h1 className="mt-4 text-[32px] lg:text-[44px] font-[750] tracking-[-0.04em] leading-[0.95]">Pilih plan yang cocok untuk kreator</h1>
          <p className="mt-4 text-[14px] leading-[1.6] text-[#6B6B6B]">Mulai gratis selamanya, upgrade kapan saja dari Rp 5 ribu sampai Rp 100 ribu. No watermark, cancel anytime.</p>
          <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-[500] text-[#6B6B6B]">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Auth Cloudflare berfungsi • Email verifikasi aktif • Google OAuth ready
          </div>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-6 bg-[#F5F5F0] rounded w-1/3" />
                <div className="mt-4 h-8 bg-[#F5F5F0] rounded w-1/2" />
                <div className="mt-6 space-y-2">
                  <div className="h-3 bg-[#F5F5F0] rounded" />
                  <div className="h-3 bg-[#F5F5F0] rounded w-5/6" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => (
              <Card key={plan.id} className={`p-6 relative overflow-hidden ${plan.popular ? 'ring-2 ring-[#0A0A0A] shadow-[0_8px_32px_rgba(0,0,0,0.12)]' : ''} ${currentPlan === plan.id ? 'border-[#0A0A0A] bg-[#F5F5F0]' : ''}`}>
                {plan.popular && <div className="absolute top-0 right-0 bg-[#0A0A0A] text-white text-[10px] font-[700] tracking-[0.06em] uppercase px-3 py-1 rounded-bl-[12px]">Popular</div>}
                {currentPlan === plan.id && <div className="absolute top-0 left-0 bg-[#FFD60A] text-black text-[10px] font-[700] tracking-[0.06em] uppercase px-3 py-1 rounded-br-[12px]">Current</div>}
                
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[16px] font-[700] tracking-[-0.02em]">{plan.name}</h3>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-[28px] font-[750] tracking-[-0.03em]">{plan.price_idr}</span>
                      <span className="text-[12px] text-[#6B6B6B]">/ {plan.interval}</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-[12px] flex items-center justify-center text-[12px] font-[800]" style={{ background: plan.color, color: plan.color === '#F5F5F0' || plan.color === '#E8E8E3' || plan.color === '#FFD60A' ? '#0A0A0A' : 'white' }}>
                    {plan.name[0]}
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
                    <Button disabled className="w-full h-10 bg-[#F5F5F0] text-[#6B6B6B] border border-[#E8E8E3]">Current Plan</Button>
                  ) : plan.price === 0 ? (
                    <Link href="/editor" className="block"><Button variant="outline" className="w-full h-10">Start Free</Button></Link>
                  ) : (
                    <Button onClick={() => handleCheckout(plan.id)} disabled={checkingOut === plan.id} className="w-full h-10">
                      {checkingOut === plan.id ? 'Processing...' : `Upgrade ${plan.price_idr}`}
                    </Button>
                  )}
                </div>

                <div className="mt-3 text-center text-[10px] text-[#9B9B9B]">{plan.price === 0 ? 'Free forever' : 'Cancel anytime • No hidden fees'}</div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="text-[12px] font-[700]">Payment Methods</div>
            <div className="mt-2 text-[11px] leading-[1.5] text-[#6B6B6B]">Support GoPay, OVO, DANA, ShopeePay, QRIS, Virtual Account BCA/Mandiri/BNI/BRI, Alfamart, Indomaret via Midtrans. Mulai Rp 5.000.</div>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              {['GoPay','OVO','DANA','QRIS','BCA','Mandiri'].map(m => (
                <span key={m} className="text-[9px] font-[600] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{m}</span>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[12px] font-[700]">Email Verification</div>
            <div className="mt-2 text-[11px] leading-[1.5] text-[#6B6B6B]">Semua user wajib verifikasi email via Resend. Link 15 menit expired, secure JWT httpOnly. Google OAuth auto verified.</div>
            <div className="mt-3 text-[10px] font-mono text-[#6B6B6B]">✓ Cloudflare D1 + Resend active</div>
          </Card>
          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[12px] font-[700]">Optimized Backend</div>
            <div className="mt-2 text-[11px] leading-[1.5] text-white/60">Edge runtime, AVIF/WebP, 1 year cache, security headers, Cloudflare Workers auth, D1 subscriptions, optimized for Indonesia 5k-100k pricing.</div>
            <div className="mt-3 text-[10px] font-mono text-[#FFD60A]">✓ Ready for production</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
