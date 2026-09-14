"use client"

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('payment_id')
  const plan = searchParams.get('plan')
  const [status, setStatus] = useState<'pending' | 'success' | 'failed'>('pending')
  const [planData, setPlanData] = useState<any>(null)

  useEffect(() => {
    if (plan) {
      fetch(`${AUTH_URL}/subscription/plans`)
        .then(r => r.json())
        .then(data => {
          const p = data.plans?.find((x: any) => x.id === plan)
          setPlanData(p)
        })
    }
  }, [plan])

  const handleMockPayment = async () => {
    // In production, this would be Midtrans callback
    // For demo, auto success after 2s
    setStatus('pending')
    await new Promise(r => setTimeout(r, 2000))
    setStatus('success')
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center p-6">
      <Card className="w-full max-w-[480px] p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center font-[800]">A</div>
          <h1 className="mt-4 text-[20px] font-[700] tracking-[-0.02em]">Checkout</h1>
          <p className="text-[12px] text-[#6B6B6B] mt-1">Payment ID: {paymentId?.slice(0, 8)}... • Plan: {plan}</p>
        </div>

        {planData && (
          <div className="mt-6 rounded-[14px] bg-[#F5F5F0] border border-[#E8E8E3] p-4">
            <div className="flex justify-between">
              <span className="text-[13px] font-[600]">{planData.name}</span>
              <span className="text-[13px] font-[700]">{planData.price_idr} / bulan</span>
            </div>
            <div className="mt-2 text-[11px] text-[#6B6B6B]">{planData.features?.slice(0, 3).join(' • ')}</div>
          </div>
        )}

        {status === 'pending' && (
          <div className="mt-6 space-y-4">
            <div className="rounded-[12px] border border-[#E8E8E3] p-4">
              <div className="text-[12px] font-[600]">Pilih metode pembayaran</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {['GoPay','OVO','DANA','QRIS','BCA VA','Mandiri VA'].map(m => (
                  <button key={m} className="h-10 rounded-[10px] border border-[#E8E8E3] bg-white text-[11px] font-[600] hover:border-[#0A0A0A]">{m}</button>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-[#9B9B9B]">Pilih salah satu metode di atas untuk melanjutkan pembayaran.</div>
            </div>

            <Button onClick={handleMockPayment} className="w-full h-11">Bayar {planData?.price_idr || ''}</Button>
            
            <div className="text-center">
              <Link href="/subscription" className="text-[11px] text-[#6B6B6B] hover:text-[#0A0A0A]">← Kembali ke plans</Link>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="mt-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">✓</div>
            <div className="mt-3 text-[14px] font-[600]">Pembayaran berhasil</div>
            <div className="text-[11px] text-[#6B6B6B] mt-1">Plan {plan} aktif. Terima kasih!</div>
            <div className="mt-6 flex gap-2">
              <Link href="/editor" className="flex-1"><Button className="w-full h-10">Buka Editor</Button></Link>
              <Link href="/projects" className="flex-1"><Button variant="outline" className="w-full h-10">Projects</Button></Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
