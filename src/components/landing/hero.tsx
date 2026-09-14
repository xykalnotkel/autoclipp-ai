"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E8E8E3_1px,transparent_1px),linear-gradient(to_bottom,#E8E8E3_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-[0.4]" />
      
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pt-16 lg:pt-24 pb-16 lg:pb-24">
          <div className="flex-1 max-w-[560px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E3] bg-white px-3 py-1 text-[11px] font-[550] tracking-[0.02em] mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
              {isId ? 'BARU: Auto Hook Detection v2.0' : 'NEW: Auto Hook Detection v2.0'}
            </div>
            
            <h1 className="text-[40px] lg:text-[56px] font-[750] leading-[0.95] tracking-[-0.04em] text-[#0A0A0A]">
              {isId ? 'YouTube ke' : 'YouTube to'}
              <br />
              <span className="relative">
                {isId ? 'viral shorts' : 'viral shorts'}
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#FFD60A]/40 -z-10" />
              </span>
              <br />
              {isId ? 'dalam detik.' : 'in seconds.'}
            </h1>
            
            <p className="mt-6 text-[16px] leading-[1.6] text-[#6B6B6B] font-[450] max-w-[440px]">
              {isId ? 'Upload video panjang. AI kami temukan momen viral, tambah subtitle animasi, dan export clip siap posting. Gratis selamanya.' : 'Upload long videos. Our AI finds viral moments, adds animated subtitles, and exports ready-to-post clips. Free forever.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/editor`}>
                <Button size="lg" className="h-12 px-7 text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.12)]">
                  {isId ? 'Mulai Gratis' : 'Start Creating Free'}
                </Button>
              </Link>
              <div className="flex items-center gap-3 pl-2">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-[#E8E8E3] overflow-hidden">
                      <img src={`https://i.pravatar.cc/32?img=${i+10}`} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <span className="text-[12px] font-[500] text-[#6B6B6B]">{isId ? 'Dipercaya ribuan kreator' : 'Trusted by thousands of creators'}</span>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-8 border-t border-[#E8E8E3] pt-8">
              <div>
                <div className="text-[24px] font-[700] tracking-[-0.02em]">2.4M+</div>
                <div className="text-[11px] font-[600] tracking-[0.06em] text-[#6B6B6B] uppercase">{isId ? 'Clip Dibuat' : 'Clips Generated'}</div>
              </div>
              <div className="h-8 w-px bg-[#E8E8E3]" />
              <div>
                <div className="text-[24px] font-[700] tracking-[-0.02em]">98.3%</div>
                <div className="text-[11px] font-[600] tracking-[0.06em] text-[#6B6B6B] uppercase">{isId ? 'Akurasi' : 'Accuracy'}</div>
              </div>
              <div className="h-8 w-px bg-[#E8E8E3]" />
              <div>
                <div className="text-[24px] font-[700] tracking-[-0.02em]">{isId ? 'Gratis' : 'Free'}</div>
                <div className="text-[11px] font-[600] tracking-[0.06em] text-[#6B6B6B] uppercase">{isId ? 'Selamanya' : 'Forever'}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 relative w-full lg:h-[600px] h-[500px] flex items-center justify-center">
            <div className="relative z-10 w-[340px] lg:w-[380px] rounded-[24px] border border-[#E8E8E3] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.08)] animate-float">
              <div className="aspect-[9/16] rounded-[16px] bg-[#0A0A0A] overflow-hidden relative">
                <img src="/images/hero-main-nobg.png" alt="Video Editor" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-12 left-3 right-3">
                  <div className="rounded-[10px] bg-white px-3 py-2 shadow-lg">
                    <div className="text-[13px] font-[800] leading-tight tracking-[-0.01em]">{isId ? 'INI CARA JADI VIRAL' : 'THIS IS HOW YOU GO VIRAL'}</div>
                    <div className="mt-1 h-1 w-full rounded-full bg-[#E8E8E3] overflow-hidden">
                      <div className="h-full w-[68%] bg-[#0A0A0A] rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FFD60A] animate-pulse" />
                    <span className="text-[10px] font-[700] text-white tracking-[0.05em]">REC</span>
                  </div>
                  <div className="rounded-full bg-white px-2.5 py-1">
                    <span className="text-[10px] font-[700] tracking-[0.02em]">1080x1920</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-[10%] right-[5%] z-20 rounded-[16px] border border-[#E8E8E3] bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] animate-float-delayed hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-[8px] bg-[#FFD60A] flex items-center justify-center text-[12px]">⚡</div>
                <div>
                  <div className="text-[11px] font-[700]">{isId ? 'Viral Score' : 'Viral Score'}</div>
                  <div className="text-[10px] text-[#6B6B6B]">94/100 🔥</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[15%] left-[0%] z-20 rounded-[16px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-3 shadow-[0_8px_24px_rgba(0,0,0,0.15)] animate-float hidden lg:block">
              <div className="text-[10px] font-[600] tracking-[0.06em] uppercase text-white/60">{isId ? 'Gaya Subtitle' : 'Subtitle Style'}</div>
              <div className="mt-1 text-[12px] font-[600]">Hormozi Bold + {isId ? 'Animasi Pop' : 'Pop Animation'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
