import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <Header />
      <Hero />
      <Features />
      
      <footer className="border-t border-[#E8E8E3] bg-[#FCFCF9]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center">
                  <span className="text-[13px] font-[800] text-white">A</span>
                </div>
                <span className="text-[14px] font-[700] tracking-[-0.03em]">autoclipp</span>
              </div>
              <p className="mt-3 text-[13px] leading-[1.5] text-[#6B6B6B] max-w-[280px]">
                Free AI tool for creators. Turn long videos into viral shorts in seconds. No watermark.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-12 text-[13px]">
              <div>
                <div className="font-[650] tracking-[-0.01em]">Product</div>
                <div className="mt-3 space-y-2 text-[#6B6B6B]">
                  <div><Link href="/editor" className="hover:text-[#0A0A0A]">Editor</Link></div>
                  <div><Link href="/projects" className="hover:text-[#0A0A0A]">Projects</Link></div>
                  <div><Link href="/pricing" className="hover:text-[#0A0A0A]">Pricing</Link></div>
                </div>
              </div>
              <div>
                <div className="font-[650] tracking-[-0.01em]">Stack</div>
                <div className="mt-3 space-y-2 text-[#6B6B6B]">
                  <div>Groq Whisper</div>
                  <div>FFmpeg.wasm</div>
                  <div>Cloudinary</div>
                </div>
              </div>
              <div>
                <div className="font-[650] tracking-[-0.01em]">Legal</div>
                <div className="mt-3 space-y-2 text-[#6B6B6B]">
                  <div>Privacy</div>
                  <div>Terms</div>
                  <div>Contact</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-between border-t border-[#E8E8E3] pt-8 text-[11px] text-[#6B6B6B]">
            <span>© 2026 AutoClipp. Built for creators in Indonesia.</span>
            <span className="font-[600] tracking-[0.02em]">FREE FOREVER • NO WATERMARK • OPEN SOURCE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
