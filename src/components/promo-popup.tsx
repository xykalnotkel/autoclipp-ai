"use client"

import { useEffect, useState } from 'react'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

type Promo = {
  id: string
  image_url: string
  link_url: string
  title: string
  active: number
}

export default function PromoPopup() {
  const [promo, setPromo] = useState<Promo | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Jangan muncul di halaman admin, subscription, editor
    const path = window.location.pathname
    if (path.includes('/admin') || path.includes('/subscription') || path.includes('/editor') || path.includes('/auth')) return

    // Cek apakah promo ini sudah pernah ditutup — muncul sekali aja selamanya per promo ID
    const dismissedIds = JSON.parse(localStorage.getItem('promo_dismissed_ids') || '[]')
    
    const fetchPromo = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/public/promo`)
        const data = await res.json()
        if (data.promo && data.promo.active) {
          // Jika ID ini sudah pernah di-dismiss, jangan tampilkan lagi — sekali aja
          if (dismissedIds.includes(data.promo.id)) return
          
          setPromo(data.promo)
          // Delay 2.5 detik biar tidak ganggu
          setTimeout(() => setVisible(true), 2500)
        }
      } catch {}
    }
    fetchPromo()
  }, [])

  const handleClose = () => {
    if (!promo) return
    setVisible(false)
    // Simpan ID promo yang sudah di-dismiss — jadi muncul sekali aja selamanya
    const dismissedIds = JSON.parse(localStorage.getItem('promo_dismissed_ids') || '[]')
    if (!dismissedIds.includes(promo.id)) {
      dismissedIds.push(promo.id)
      localStorage.setItem('promo_dismissed_ids', JSON.stringify(dismissedIds))
    }
  }

  const handleClick = async () => {
    if (!promo) return
    try {
      await fetch(`${AUTH_URL}/public/promo/${promo.id}/click`, { method: 'POST' })
    } catch {}
    
    // Simpan sebagai dismissed juga karena sudah di-klik — sekali aja
    const dismissedIds = JSON.parse(localStorage.getItem('promo_dismissed_ids') || '[]')
    if (!dismissedIds.includes(promo.id)) {
      dismissedIds.push(promo.id)
      localStorage.setItem('promo_dismissed_ids', JSON.stringify(dismissedIds))
    }

    if (promo.link_url) {
      setVisible(false)
      if (promo.link_url.startsWith('/')) {
        window.location.href = promo.link_url
      } else {
        window.open(promo.link_url, '_blank')
      }
    } else {
      handleClose()
    }
  }

  if (!promo || !visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-[380px] w-full">
        {/* Hanya gambar + tombol X bulat — tanpa border, radius bulat */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <img 
            src={promo.image_url} 
            alt={promo.title}
            className="w-full h-auto max-h-[70vh] object-cover cursor-pointer"
            onClick={handleClick}
            loading="lazy"
          />
          {/* Tombol X bulat — tanpa border */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[14px] font-[700] text-black hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] transition"
            aria-label="Close promo"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
