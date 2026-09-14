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
    const dismissed = localStorage.getItem('promo_dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      if (Date.now() - dismissedTime < 24 * 60 * 60 * 1000) return // 24h hide after close
    }

    const fetchPromo = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/public/promo`)
        const data = await res.json()
        if (data.promo && data.promo.active) {
          setPromo(data.promo)
          setTimeout(() => setVisible(true), 2000) // show after 2s
        }
      } catch {}
    }
    fetchPromo()
  }, [])

  const handleClose = () => {
    setVisible(false)
    localStorage.setItem('promo_dismissed', Date.now().toString())
  }

  const handleClick = async () => {
    if (!promo) return
    try {
      await fetch(`${AUTH_URL}/public/promo/${promo.id}/click`, { method: 'POST' })
    } catch {}
    if (promo.link_url) {
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
        {/* Rounded image popup - only image + X button */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10">
          <img 
            src={promo.image_url} 
            alt={promo.title}
            className="w-full h-auto max-h-[70vh] object-cover cursor-pointer"
            onClick={handleClick}
          />
          {/* X button - rounded */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-center text-[14px] font-[700] text-black hover:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-3 text-center">
          <div className="text-[11px] text-white/60 font-[500]">Klik gambar untuk {promo.link_url ? 'buka link' : 'tutup'} • Promo dari XySpace</div>
        </div>
      </div>
    </div>
  )
}
