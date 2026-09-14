"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function Header({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'
  const [currentLocale, setCurrentLocale] = useState(locale)

  useEffect(() => {
    setCurrentLocale(locale)
  }, [locale])

  const t = {
    features: isId ? 'Fitur' : 'Features',
    editor: 'Editor',
    projects: isId ? 'Project' : 'Projects',
    pricing: isId ? 'Harga' : 'Pricing',
    open_editor: isId ? 'Buka Editor' : 'Open Editor',
    realtime: 'REALTIME'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E8E3]/80 bg-[#FCFCF9]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={`/${currentLocale}`} className="flex items-center gap-2.5">
              <img src="/logo.png" alt="AutoClipp" className="h-7 w-7 rounded-[8px] object-cover bg-[#0A0A0A]" />
              <span className="text-[14px] font-[700] tracking-[-0.03em]">autoclipp</span>
              <span className="ml-1 rounded-full bg-[#FFD60A] px-2 py-0.5 text-[10px] font-[700] tracking-[0.02em]">BETA</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href={`/${currentLocale}#features`} className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">{t.features}</Link>
              <Link href={`/${currentLocale}/editor`} className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">{t.editor}</Link>
              <Link href={`/${currentLocale}/projects`} className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">{t.projects}</Link>
              <Link href={`/${currentLocale}/subscription`} className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">{t.pricing}</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <Link href="/id" className={`text-[11px] px-2 py-1 rounded-full ${currentLocale === 'id' ? 'bg-[#0A0A0A] text-white' : 'text-[#6B6B6B] hover:text-black'}`}>ID</Link>
              <Link href="/en" className={`text-[11px] px-2 py-1 rounded-full ${currentLocale === 'en' ? 'bg-[#0A0A0A] text-white' : 'text-[#6B6B6B] hover:text-black'}`}>EN</Link>
            </div>
            <Link href={`/${currentLocale}/editor`}>
              <Button size="sm" className="h-8 px-4 text-[12px]">{t.open_editor}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
