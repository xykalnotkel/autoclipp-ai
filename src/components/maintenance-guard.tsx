"use client"

import { useEffect, useState } from 'react'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/public/settings`)
        const data = await res.json()
        if (data.settings?.maintenance_mode) {
          // Check if admin bypass
          const token = localStorage.getItem('admin_token')
          if (data.settings?.maintenance_allow_admin && token) {
            // Allow admin to bypass
            setLoading(false)
            return
          }
          setMaintenance(data.settings)
        }
      } catch {}
      setLoading(false)
    }
    check()
  }, [])

  if (loading) return <>{children}</>

  if (maintenance) {
    return (
      <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center p-6">
        <div className="max-w-[480px] w-full text-center">
          <div className="mx-auto h-16 w-16 rounded-[16px] bg-[#0A0A0A] text-white flex items-center justify-center text-[24px] font-[800]">A</div>
          <h1 className="mt-6 text-[28px] font-[700] tracking-[-0.02em]">Sedang Maintenance 🛠</h1>
          <p className="mt-3 text-[14px] leading-[1.5] text-[#6B6B6B]">
            {maintenance.maintenance_message || 'Kami sedang melakukan perbaikan untuk pengalaman yang lebih baik. Kembali lagi nanti ya!'}
          </p>
          {maintenance.maintenance_eta && (
            <div className="mt-4 inline-flex rounded-full bg-[#FFD60A] text-black px-4 py-2 text-[12px] font-[600]">
              Estimasi selesai: {maintenance.maintenance_eta}
            </div>
          )}
          <div className="mt-8 p-4 rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] text-left">
            <div className="text-[11px] font-[700] tracking-[0.06em] uppercase">Info Maintenance</div>
            <div className="mt-2 space-y-1.5 text-[11px] text-[#6B6B6B]">
              <div>• Semua data aman, tidak ada yang hilang</div>
              <div>• Fitur FFmpeg & AI sedang di-upgrade</div>
              <div>• Pembayaran QRIS/DANA tetap tercatat</div>
              <div>• Join WA Channel untuk update: <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="underline font-[600]">XySpace Channel</a></div>
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="rounded-full bg-[#25D366] text-white px-5 py-2.5 text-[12px] font-[600]">📢 WA Channel</a>
            <button onClick={() => window.location.reload()} className="rounded-full border border-[#E8E8E3] bg-white px-5 py-2.5 text-[12px] font-[600]">Refresh</button>
          </div>
          <div className="mt-8 text-[10px] text-[#9B9B9B]">Made by XySpace • Solo Dev + Agent • Maintenance Mode Super Lengkap</div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
