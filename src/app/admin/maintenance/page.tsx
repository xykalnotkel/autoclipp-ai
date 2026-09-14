"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'
function getAdminToken(){ if(typeof window==='undefined') return null; return localStorage.getItem('admin_token') }
function authHeaders(){ const t=getAdminToken(); const h:any={'Content-Type':'application/json'}; if(t) h['Authorization']=`Bearer ${t}`; return h }

export default function AdminMaintenancePage(){
  const [settings, setSettings] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchSettings = async()=>{
      try{
        const res = await fetch(`${AUTH_URL}/admin/settings`, { credentials:'include', headers: authHeaders() })
        const data = await res.json()
        if(data.settings) setSettings(data.settings)
      }catch{}
      setLoading(false)
    }
    fetchSettings()
  },[])

  const update = async(key:string, value:any)=>{
    try{
      await fetch(`${AUTH_URL}/admin/settings`, { method:'POST', credentials:'include', headers: authHeaders(), body: JSON.stringify({ key, value }) })
      setSettings({...settings, [key]: value})
    }catch{}
  }

  if(loading) return <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" /></div>

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
              <Link href="/admin/payments" className="px-3 py-1 rounded-full text-[12px] text-white/60">Payments</Link>
              <Link href="/admin/users" className="px-3 py-1 rounded-full text-[12px] text-white/60">Users</Link>
              <span className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-[600]">Maintenance</span>
            </div>
          </div>
          <Link href="/admin/dashboard"><Button size="sm" variant="outline" className="h-8 bg-white/10 border-white/20 text-white">Dashboard</Button></Link>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-6 py-8">
        <h1 className="text-[22px] font-[700] tracking-[-0.02em]">Maintenance Mode — Super Lengkap</h1>
        <p className="text-[12px] text-[#6B6B6B] mt-1">Kontrol penuh maintenance: pesan, ETA, bypass admin, promo popup, SEO 503</p>

        <div className="mt-6 grid gap-4">
          <Card className={`p-6 border-2 ${settings.maintenance_mode ? 'border-red-200 bg-red-50/20' : 'border-green-200 bg-green-50/20'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-[700]">Status Maintenance</div>
                <div className="text-[11px] text-[#6B6B6B] mt-1">{settings.maintenance_mode ? '🔴 ONLINE — User melihat halaman maintenance' : '🟢 OFFLINE — Site live normal'}</div>
              </div>
              <Button className={`h-9 ${settings.maintenance_mode ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`} onClick={()=>update('maintenance_mode', !settings.maintenance_mode)}>{settings.maintenance_mode ? 'Matikan Maintenance' : 'Aktifkan Maintenance'}</Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="text-[12px] font-[700]">Pesan Maintenance</div>
            <textarea value={settings.maintenance_message || ''} onChange={e=>setSettings({...settings, maintenance_message: e.target.value})} className="mt-2 w-full min-h-[100px] rounded-[12px] border border-[#E8E8E3] bg-white p-3 text-[12px]" placeholder="Sedang maintenance..." />
            <Button size="sm" className="mt-3 h-8 text-[11px]" onClick={()=>update('maintenance_message', settings.maintenance_message)}>Simpan Pesan</Button>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-5">
              <div className="text-[12px] font-[700]">Estimasi Selesai (ETA)</div>
              <input value={settings.maintenance_eta || ''} onChange={e=>setSettings({...settings, maintenance_eta: e.target.value})} className="mt-2 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px]" placeholder="2 jam lagi, jam 20:00 WIB" />
              <Button size="sm" variant="outline" className="mt-3 h-8 text-[11px]" onClick={()=>update('maintenance_eta', settings.maintenance_eta)}>Simpan ETA</Button>
            </Card>
            <Card className="p-5">
              <div className="text-[12px] font-[700]">Admin Bypass</div>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={()=>update('maintenance_allow_admin', !settings.maintenance_allow_admin)} className={`h-7 w-12 rounded-full transition ${settings.maintenance_allow_admin ? 'bg-[#0A0A0A]' : 'bg-[#E8E8E3]'} relative`}><div className={`h-5 w-5 rounded-full bg-white absolute top-1 transition ${settings.maintenance_allow_admin ? 'left-6' : 'left-1'}`} /></button>
                <span className="text-[11px]">{settings.maintenance_allow_admin ? 'Admin bisa akses saat maintenance' : 'Admin juga ke-block'}</span>
              </div>
              <div className="mt-3 text-[11px] text-[#6B6B6B]">Jika ON, admin dengan token tetap bisa akses site untuk testing. User biasa tetap lihat maintenance page.</div>
            </Card>
          </div>

          <Card className="p-5">
            <div className="text-[12px] font-[700]">Pengaturan Tambahan</div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-[11px] font-[600]">Maintenance Title</label>
                <input value={settings.maintenance_title || ''} onChange={e=>setSettings({...settings, maintenance_title: e.target.value})} className="mt-1 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px]" placeholder="Sedang Maintenance 🛠" />
                <Button size="sm" variant="outline" className="mt-2 h-7 text-[10px]" onClick={()=>update('maintenance_title', settings.maintenance_title)}>Simpan</Button>
              </div>
              <div>
                <label className="text-[11px] font-[600]">Contact Info (WA/Email saat maintenance)</label>
                <input value={settings.maintenance_contact || ''} onChange={e=>setSettings({...settings, maintenance_contact: e.target.value})} className="mt-1 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px]" placeholder="https://whatsapp.com/channel/..." />
                <Button size="sm" variant="outline" className="mt-2 h-7 text-[10px]" onClick={()=>update('maintenance_contact', settings.maintenance_contact)}>Simpan</Button>
              </div>
              <div>
                <label className="text-[11px] font-[600]">SEO — Retry-After (detik)</label>
                <input value={settings.maintenance_retry_after || ''} onChange={e=>setSettings({...settings, maintenance_retry_after: e.target.value})} className="mt-1 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px]" placeholder="3600" />
                <Button size="sm" variant="outline" className="mt-2 h-7 text-[10px]" onClick={()=>update('maintenance_retry_after', settings.maintenance_retry_after)}>Simpan</Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[11px] font-[700] tracking-[0.06em] uppercase">Cara Kerja Maintenance Mode Super Lengkap</div>
            <div className="mt-3 text-[11px] leading-[1.6] text-white/60 space-y-1.5">
              <div>1. Ketika ON, semua request ke /id /en akan cek /public/settings → maintenance_mode true</div>
              <div>2. Frontend MaintenanceGuard akan tampilkan halaman maintenance dengan pesan custom</div>
              <div>3. Jika allow_admin ON, user dengan admin_token di localStorage tetap bisa akses (untuk testing)</div>
              <div>4. Return 503 Service Unavailable untuk SEO, dengan Retry-After header</div>
              <div>5. WA Channel link tetap aktif, user bisa join untuk update</div>
              <div>6. Promo popup otomatis nonaktif saat maintenance</div>
              <div>7. Payments tetap tercatat di DB, tidak hilang</div>
              <div>8. Matikan maintenance setelah selesai, site kembali live otomatis</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
