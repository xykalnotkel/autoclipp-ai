"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function getAdminToken(){ if(typeof window==='undefined') return null; return localStorage.getItem('admin_token') }
function authHeaders(){ const t=getAdminToken(); const h:any={'Content-Type':'application/json'}; if(t) h['Authorization']=`Bearer ${t}`; return h }

type Payment = {
  id: string
  order_id: string
  user_id: string
  email: string
  name: string
  plan: string
  amount: number
  payment_method: string
  qris_string: string
  status: string
  created_at: string
  paid_at?: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${AUTH_URL}/admin/payments?status=${filter}`, { credentials: 'include', headers: authHeaders() })
      const data = await res.json()
      if (data.payments) setPayments(data.payments)
      else if (data.error && data.error.includes('Unauthorized')) window.location.href='/admin/login'
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchPayments()
  }, [filter])

  const handleVerify = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Yakin ${action} payment ini?`)) return
    try {
      const res = await fetch(`${AUTH_URL}/admin/payments/${id}/verify`, {
        method: 'POST',
        headers: authHeaders(),
        credentials: 'include',
        body: JSON.stringify({ action })
      })
      const data = await res.json()
      if (data.success) {
        alert(data.message)
        fetchPayments()
      } else {
        alert(data.error)
      }
    } catch (e: any) {
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-[1280px] px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-white text-black flex items-center justify-center font-[800] text-[12px]">A</div>
              <span className="text-[13px] font-[700]">autoclipp admin</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/admin/dashboard" className="px-3 py-1 rounded-full text-[12px] text-white/60">Dashboard</Link>
              <span className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-[600]">Payments</span>
              <Link href="/admin/users" className="px-3 py-1 rounded-full text-[12px] text-white/60">Users</Link>
            </div>
          </div>
          <Link href="/admin/dashboard"><Button size="sm" variant="outline" className="h-8 bg-white/10 border-white/20 text-white">Dashboard</Button></Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-[700] tracking-[-0.02em]">Payments — Real Verification</h1>
            <p className="text-[12px] text-[#6B6B6B] mt-1">Verifikasi pembayaran QRIS/DANA. Ketika user bayar sesuai nominal, akses otomatis aktif.</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={filter} onChange={e => setFilter(e.target.value)} className="h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px]">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <Button size="sm" variant="outline" className="h-8" onClick={fetchPayments}>Refresh</Button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <Card className="p-8 text-center text-[12px] text-[#6B6B6B]">Loading payments...</Card>
          ) : payments.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-[13px] font-[600]">No payments</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">Belum ada pembayaran. User harus checkout di halaman pricing.</div>
            </Card>
          ) : (
            payments.map(p => (
              <Card key={p.id} className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-[700]">{p.order_id}</span>
                      <span className={`text-[10px] font-[700] px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : p.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>{p.status.toUpperCase()}</span>
                      <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{p.payment_method?.toUpperCase()} • {p.plan}</span>
                    </div>
                    <div className="mt-1.5 text-[11px] text-[#6B6B6B]">{p.email} • {p.name} • Rp {p.amount.toLocaleString('id-ID')} • {new Date(p.created_at).toLocaleString('id-ID')}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {p.qris_string && (
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(p.qris_string)}`} alt="QRIS" className="h-[80px] w-[80px] rounded-[8px] border border-[#E8E8E3]" />
                    )}
                    <div className="flex flex-col gap-1.5">
                      {p.status === 'pending' && (
                        <>
                          <Button size="sm" className="h-8 text-[11px] bg-green-600 hover:bg-green-700" onClick={() => handleVerify(p.id, 'approve')}>Approve & Activate</Button>
                          <Button size="sm" variant="outline" className="h-8 text-[11px]" onClick={() => handleVerify(p.id, 'reject')}>Reject</Button>
                        </>
                      )}
                      {p.status === 'paid' && <span className="text-[11px] font-[600] text-green-600">✓ Verified</span>}
                      <div className="text-[10px] text-[#9B9B9B]">ID: {p.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <Card className="mt-8 p-5 bg-white border-[#E8E8E3]">
          <div className="text-[12px] font-[700]">Cara kerja verifikasi:</div>
          <div className="mt-2 text-[11px] leading-[1.6] text-[#6B6B6B] space-y-1">
            <div>1. User checkout paket di halaman pricing → sistem generate QRIS + order ID</div>
            <div>2. User scan pakai DANA/GoPay/OVO dan bayar sesuai nominal</div>
            <div>3. Sistem otomatis deteksi pembayaran dan aktifkan langganan 30 hari</div>
            <div>4. Jika auto verifikasi belum aktif, admin bisa manual approve di dashboard ini</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
