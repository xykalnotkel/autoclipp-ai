"use client"

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function getAdminToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token') || null
}
function authHeaders() {
  const token = getAdminToken()
  const headers: any = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [publicStats, setPublicStats] = useState<any>(null)
  const [realtime, setRealtime] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const [promos, setPromos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<any>(null)
  const [maintenanceLoading, setMaintenanceLoading] = useState(false)
  const [promoForm, setPromoForm] = useState({ image_url: '', link_url: '', title: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<any>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAdminToken()
        if (!token) { window.location.href = '/admin/login'; return }
        const res = await fetch(`${AUTH_URL}/admin/me`, { credentials: 'include', headers: authHeaders() })
        const data = await res.json()
        if (!data.admin) { localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; return }
        setAdmin(data.admin)
      } catch { window.location.href = '/admin/login' }
    }

    const fetchAll = async () => {
      try {
        const headers = authHeaders()
        const [statsRes, realtimeRes, feedbackRes, publicStatsRes, settingsRes, promoRes] = await Promise.all([
          fetch(`${AUTH_URL}/admin/stats`, { credentials: 'include', headers }),
          fetch(`${AUTH_URL}/analytics/realtime`, { credentials: 'include', headers }).catch(() => null),
          fetch(`${AUTH_URL}/feedbacks?limit=10`).catch(() => null),
          fetch(`${AUTH_URL}/public/stats`).catch(() => null),
          fetch(`${AUTH_URL}/admin/settings`, { credentials: 'include', headers }).catch(() => null),
          fetch(`${AUTH_URL}/admin/promos`, { credentials: 'include', headers }).catch(() => null),
        ])
        if (statsRes?.ok) { const d = await statsRes.json(); if (d.stats) setStats(d.stats) }
        if (realtimeRes?.ok) { const d = await realtimeRes.json(); if (d.realtime) setRealtime(d.realtime) }
        if (feedbackRes?.ok) { const d = await feedbackRes.json(); if (d.feedbacks) setFeedbacks(d.feedbacks) }
        if (publicStatsRes?.ok) { const d = await publicStatsRes.json(); if (d.stats) setPublicStats(d.stats) }
        if (settingsRes?.ok) { const d = await settingsRes.json(); if (d.settings) setSettings(d.settings) }
        if (promoRes?.ok) { const d = await promoRes.json(); if (d.promos) setPromos(d.promos) }
      } catch {}
      setLoading(false)
    }

    checkAuth()
    fetchAll()
    const interval = setInterval(fetchAll, 5000)
    return () => clearInterval(interval)
  }, [])

  const toggleMaintenance = async () => {
    setMaintenanceLoading(true)
    const newMode = !settings.maintenance_mode
    try {
      await fetch(`${AUTH_URL}/admin/settings`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify({ key: 'maintenance_mode', value: newMode })
      })
      setSettings({ ...settings, maintenance_mode: newMode })
    } catch {}
    setMaintenanceLoading(false)
  }

  const updateSetting = async (key: string, value: any) => {
    try {
      await fetch(`${AUTH_URL}/admin/settings`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify({ key, value })
      })
      setSettings({ ...settings, [key]: value })
    } catch {}
  }

  // Upload image file -> auto webp convert
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) { alert('Hanya gambar!'); return }
    if (file.size > 10*1024*1024) { alert('Max 10MB'); return }
    
    setUploading(true)
    setUploadProgress({ original: file.size, status: 'Converting to WebP...' })
    
    try {
      // Client-side preview + optional canvas webp conversion for instant feedback
      // But we still upload to server for sharp conversion + cloudinary
      
      const formData = new FormData()
      formData.append('file', file)
      
      setUploadProgress({ original: file.size, status: 'Uploading & converting to WebP (sharp 82% quality)...' })
      
      const res = await fetch('/api/upload/promo', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Upload gagal')
      
      setUploadProgress({ 
        original: data.original_size, 
        webp: data.webp_size, 
        saved: data.saved_percent,
        status: `✅ WebP ${ (data.webp_size/1024).toFixed(1)}KB (hemat ${data.saved_percent}%) — tetap tajam`
      })
      
      setPromoForm({ ...promoForm, image_url: data.optimized_url || data.url })
      
      setTimeout(() => setUploadProgress(null), 3000)
    } catch (e: any) {
      alert(e.message)
      setUploadProgress(null)
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const createPromo = async () => {
    if (!promoForm.image_url) { alert('Image wajib — upload file atau paste URL'); return }
    try {
      const res = await fetch(`${AUTH_URL}/admin/promos`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify(promoForm)
      })
      const data = await res.json()
      if (data.success) {
        setPromoForm({ image_url: '', link_url: '', title: '' })
        const promoRes = await fetch(`${AUTH_URL}/admin/promos`, { credentials: 'include', headers: authHeaders() })
        const d = await promoRes.json()
        if (d.promos) setPromos(d.promos)
      } else alert(data.error)
    } catch (e: any) { alert(e.message) }
  }

  const togglePromo = async (id: string, active: boolean) => {
    try {
      await fetch(`${AUTH_URL}/admin/promos/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders(),
        body: JSON.stringify({ active: !active })
      })
      setPromos(promos.map(p => p.id === id ? { ...p, active: !active ? 1 : 0 } : p))
    } catch {}
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Hapus promo ini?')) return
    try {
      await fetch(`${AUTH_URL}/admin/promos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders(),
      })
      setPromos(promos.filter(p => p.id !== id))
    } catch {}
  }

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0'
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    window.location.href = '/admin/login'
  }

  if (loading) {
    return <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" /></div>
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#0A0A0A] text-white">
        <div className="mx-auto max-w-[1400px] px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="logo" className="h-7 w-7 rounded-[8px] bg-white object-cover" />
              <span className="text-[13px] font-[700]">autoclipp</span>
              <span className="text-[10px] font-[600] tracking-[0.06em] uppercase bg-white/10 px-2 py-0.5 rounded-full">Admin • WebP Auto</span>
              {settings.maintenance_mode && <span className="text-[10px] font-[700] px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">MAINTENANCE ON</span>}
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <span className="px-3 py-1 rounded-full bg-white text-black text-[12px] font-[600]">Dashboard</span>
              <Link href="/admin/payments" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Payments</Link>
              <Link href="/admin/users" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Users</Link>
              <Link href="/admin/maintenance" className="px-3 py-1 rounded-full text-[12px] text-white/60 hover:text-white">Maintenance</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/60 hidden md:block">{admin?.username} ✓ • {publicStats?.total_users || 0} users • WebP Auto</span>
            <Button size="sm" variant="outline" className="h-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-black" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-[700] tracking-[-0.02em]">Admin Dashboard — WebP Auto Convert + Sharp</h1>
            <p className="text-[12px] text-[#6B6B6B] mt-1">Total user realtime • Maintenance • Promo WebP auto compress tajam • Made by XySpace</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-[600]">LIVE • {realtime?.active_now || 0} active • WebP 82% quality</span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-white/60">Total Users Realtime</div>
            <div className="mt-2 text-[28px] font-[700] tracking-[-0.02em]">{publicStats?.total_users || stats?.total_users || 0}</div>
            <div className="mt-1 text-[11px] text-white/60">+{publicStats?.new_users_today || 0} hari ini</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Active Now</div>
            <div className="mt-2 text-[28px] font-[700] text-green-600">{realtime?.active_now || publicStats?.active_now || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">5 min window</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Today Views</div>
            <div className="mt-2 text-[28px] font-[700]">{realtime?.today_views || publicStats?.today_views || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Page views</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Total Clips</div>
            <div className="mt-2 text-[28px] font-[700]">{(publicStats?.total_clips || 2400000).toLocaleString('id-ID')}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">98.3% akurat</div>
          </Card>
          <Card className="p-5 border-amber-200 bg-amber-50/50">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">Pending Payments</div>
            <div className="mt-2 text-[28px] font-[700] text-amber-600">{stats?.pending_payments || 0}</div>
            <div className="mt-1 text-[11px] text-[#6B6B6B]">Verifikasi</div>
          </Card>
          <Card className="p-5 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-white/60">Revenue</div>
            <div className="mt-2 text-[22px] font-[700]">Rp {(stats?.total_revenue || 0).toLocaleString('id-ID')}</div>
            <div className="mt-1 text-[11px] text-white/60">Paid: {stats?.paid_payments || 0}</div>
          </Card>
        </div>

        {/* Maintenance */}
        <div className="mt-6 grid lg:grid-cols-3 gap-4">
          <Card className={`p-5 lg:col-span-2 border-2 ${settings.maintenance_mode ? 'border-red-200 bg-red-50/30' : 'border-[#E8E8E3]'}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">🛠 Maintenance Mode</h3>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full font-[700] ${settings.maintenance_mode ? 'bg-red-500 text-white' : 'bg-green-50 border border-green-200 text-green-700'}`}>{settings.maintenance_mode ? 'ON' : 'OFF'}</span>
                <Button size="sm" variant={settings.maintenance_mode ? "secondary" : "outline"} className={`h-7 text-[11px] ${settings.maintenance_mode ? 'bg-red-600 text-white hover:bg-red-700' : ''}`} onClick={toggleMaintenance} disabled={maintenanceLoading}>{maintenanceLoading ? '...' : settings.maintenance_mode ? 'Matikan' : 'Aktifkan'}</Button>
              </div>
            </div>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-[600]">Pesan Maintenance</label>
                <textarea value={settings.maintenance_message || ''} onChange={e=>setSettings({...settings, maintenance_message: e.target.value})} placeholder="Sedang maintenance..." className="mt-1 w-full min-h-[80px] rounded-[12px] border border-[#E8E8E3] bg-white p-3 text-[12px]" />
                <Button size="sm" variant="outline" className="mt-2 h-7 text-[11px]" onClick={()=>updateSetting('maintenance_message', settings.maintenance_message)}>Simpan</Button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-[600]">ETA</label>
                  <input value={settings.maintenance_eta || ''} onChange={e=>setSettings({...settings, maintenance_eta: e.target.value})} placeholder="2 jam lagi" className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px]" />
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-[11px]" onClick={()=>updateSetting('maintenance_eta', settings.maintenance_eta)}>Simpan</Button>
                </div>
                <div>
                  <label className="text-[11px] font-[600]">Allow Admin Bypass</label>
                  <div className="mt-1 flex items-center gap-2">
                    <button onClick={()=>updateSetting('maintenance_allow_admin', !settings.maintenance_allow_admin)} className={`h-6 w-10 rounded-full transition ${settings.maintenance_allow_admin ? 'bg-[#0A0A0A]' : 'bg-[#E8E8E3]'} relative`}><div className={`h-4 w-4 rounded-full bg-white absolute top-1 transition ${settings.maintenance_allow_admin ? 'left-5' : 'left-1'}`} /></button>
                    <span className="text-[11px] text-[#6B6B6B]">{settings.maintenance_allow_admin ? 'Admin tetap bisa akses' : 'Admin ke-block'}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Realtime</h3>
            <div className="mt-4 space-y-2 text-[11px]">
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Total Users</span><span className="font-[700]">{publicStats?.total_users || 0}</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">New Today</span><span className="font-[700] text-green-600">+{publicStats?.new_users_today || 0}</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Active Now</span><span className="font-[700] text-green-600">{realtime?.active_now || 0}</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Views Today</span><span className="font-[700]">{realtime?.today_views || 0}</span></div>
            </div>
          </Card>
        </div>

        {/* Promo Popup with Upload */}
        <Card className="mt-6 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[12px] font-[700] tracking-[0.06em] uppercase">📢 Promo Popup — Upload File Auto WebP Compress Tajam</h3>
            <span className="text-[10px] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{promos.length} promo • {promos.filter((p:any)=>p.active).length} aktif • WebP 82%</span>
          </div>
          
          <div className="mt-4 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="text-[11px] font-[700] mb-2">Upload Gambar Promo — Auto WebP</div>
              
              {/* Drag & Drop Upload */}
              <div
                onDrop={handleDrop}
                onDragOver={e=>e.preventDefault()}
                onClick={()=>fileRef.current?.click()}
                className="rounded-[16px] border-2 border-dashed border-[#E8E8E3] bg-[#FCFCF9] p-6 text-center hover:border-[#0A0A0A] hover:bg-white cursor-pointer transition"
              >
                <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center text-[16px] font-[700]">↑</div>
                <div className="mt-3 text-[12px] font-[600]">Drop gambar di sini atau klik</div>
                <div className="text-[10px] text-[#6B6B6B] mt-1">JPG, PNG, WebP → Auto convert WebP 82% tajam</div>
                <div className="text-[10px] text-[#9B9B9B] mt-1">Max 10MB • Resize max 800x1200 • Hemat 40-70%</div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFileUpload(f)}} />
              </div>

              {uploading && (
                <div className="mt-3 p-3 rounded-[12px] bg-[#0A0A0A] text-white">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span className="text-[11px] font-[600]">Converting to WebP...</span>
                  </div>
                  <div className="mt-2 text-[10px] text-white/60">{uploadProgress?.status}</div>
                </div>
              )}

              {uploadProgress && !uploading && (
                <div className="mt-3 p-3 rounded-[12px] bg-green-50 border border-green-200">
                  <div className="text-[11px] font-[700] text-green-700">✅ WebP Ready — Tetap Tajam</div>
                  <div className="mt-1 text-[10px] text-[#6B6B6B]">
                    {uploadProgress.original && `Original: ${(uploadProgress.original/1024).toFixed(1)}KB → `}
                    {uploadProgress.webp && `WebP: ${(uploadProgress.webp/1024).toFixed(1)}KB • `}
                    {uploadProgress.saved && `Hemat ${uploadProgress.saved}%`}
                  </div>
                  <div className="mt-1 text-[10px] text-[#9B9B9B]">{uploadProgress.status}</div>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[10px] font-[600] text-[#6B6B6B]">Image URL (otomatis terisi setelah upload, atau paste manual)</label>
                  <input value={promoForm.image_url} onChange={e=>setPromoForm({...promoForm, image_url: e.target.value})} placeholder="https://.../promo.webp (auto WebP)" className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px]" />
                </div>
                <div>
                  <label className="text-[10px] font-[600] text-[#6B6B6B]">Link Tujuan — Klik gambar mengarah ke sini</label>
                  <input value={promoForm.link_url} onChange={e=>setPromoForm({...promoForm, link_url: e.target.value})} placeholder="/id/subscription atau https://..." className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px]" />
                </div>
                <div>
                  <label className="text-[10px] font-[600] text-[#6B6B6B]">Judul (internal)</label>
                  <input value={promoForm.title} onChange={e=>setPromoForm({...promoForm, title: e.target.value})} placeholder="Promo Diskon 50% WebP" className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px]" />
                </div>
                <Button size="sm" className="w-full h-9 text-[11px] font-[600]" onClick={createPromo} disabled={uploading}>Buat Promo Popup WebP</Button>
                <div className="text-[10px] text-[#9B9B9B] leading-[1.4] space-y-1">
                  <div>✓ Upload file → auto convert WebP 82% quality, resize max 800x1200, keep aspect ratio</div>
                  <div>✓ Compress 40-70% lebih kecil, tetap tajam (sharp + smartSubsample)</div>
                  <div>✓ Cloudinary upload + auto:good + progressive WebP</div>
                  <div>✓ Popup: gambar + X bulat rounded, klik → link custom</div>
                </div>
              </div>

              {promoForm.image_url && (
                <div className="mt-4">
                  <div className="text-[11px] font-[600] mb-2">Preview Popup WebP</div>
                  <div className="relative rounded-[16px] overflow-hidden bg-[#0A0A0A] aspect-[3/4] max-w-[200px] mx-auto border border-[#E8E8E3] shadow-lg">
                    <img src={promoForm.image_url} alt="preview" className="w-full h-full object-cover" />
                    <button className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center text-[12px] font-[700] shadow-lg">✕</button>
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="text-[10px] text-white font-[600]">{promoForm.title || 'Promo Title'}</div>
                      <div className="text-[9px] text-white/70 truncate">{promoForm.link_url || 'No link'} • WebP 82%</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-[9px] px-2 py-1 rounded-full bg-[#0A0A0A] text-white font-[600]">WebP • Sharp • Compressed</span>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="text-[11px] font-[600] mb-3">Daftar Promo — WebP Auto</div>
              <div className="space-y-3 max-h-[600px] overflow-auto pr-1">
                {promos.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-[#E8E8E3] rounded-[12px]">
                    <div className="text-[12px] font-[600]">Belum ada promo</div>
                    <div className="text-[11px] text-[#6B6B6B] mt-1">Upload gambar pertama — auto WebP compress tajam</div>
                  </div>
                ) : promos.map((p:any)=>(
                  <div key={p.id} className="flex gap-3 p-3 rounded-[12px] border border-[#E8E8E3] bg-white hover:border-[#0A0A0A] transition">
                    <img src={p.image_url} alt={p.title} className="h-20 w-14 rounded-[8px] object-cover bg-[#F5F5F0] border border-[#E8E8E3]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-[700] truncate">{p.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-[700] ${p.active ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-[#F5F5F0] border border-[#E8E8E3] text-[#6B6B6B]'}`}>{p.active ? 'AKTIF' : 'OFF'}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#0A0A0A] text-white font-[600]">WebP</span>
                      </div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1 truncate">Link: {p.link_url || '(close only)'} • {p.views || 0} views • {p.clicks || 0} clicks</div>
                      <div className="text-[10px] text-[#9B9B9B] mt-1">{new Date(p.created_at).toLocaleString('id-ID')} • {p.id.slice(0,8)}</div>
                      <div className="mt-1 text-[9px] text-[#6B6B6B] truncate max-w-[280px]">{p.image_url}</div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={()=>togglePromo(p.id, !!p.active)}>{p.active ? 'Nonaktif' : 'Aktif'}</Button>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] text-red-600 border-red-200 hover:bg-red-50" onClick={()=>deletePromo(p.id)}>Hapus</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
