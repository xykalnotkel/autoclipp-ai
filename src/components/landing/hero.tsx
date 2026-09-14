import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E8E8E3_1px,transparent_1px),linear-gradient(to_bottom,#E8E8E3_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-[0.4]" />
      
      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pt-16 lg:pt-24 pb-16 lg:pb-24">
          {/* Left content */}
          <div className="flex-1 max-w-[560px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E3] bg-white px-3 py-1 text-[11px] font-[550] tracking-[0.02em] mb-6 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0A0A0A] animate-pulse" />
              NEW: Auto Hook Detection v2.0
            </div>
            
            <h1 className="text-[40px] lg:text-[56px] font-[750] leading-[0.95] tracking-[-0.04em] text-[#0A0A0A]">
              YouTube to
              <br />
              <span className="relative">
                viral shorts
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#FFD60A]/40 -z-10" />
              </span>
              <br />
              in seconds.
            </h1>
            
            <p className="mt-6 text-[16px] leading-[1.6] text-[#6B6B6B] font-[450] max-w-[440px]">
              Upload long videos. Our AI finds viral moments, adds animated subtitles, and exports ready-to-post clips. Free forever.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/editor">
                <Button size="lg" className="h-12 px-7 text-[14px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.12)]">
                  Start Creating Free
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
                <span className="text-[12px] font-[500] text-[#6B6B6B]">Trusted by 12k+ creators</span>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-8 border-t border-[#E8E8E3] pt-8">
              <div>
                <div className="text-[24px] font-[700] tracking-[-0.02em]">2.4M+</div>
                <div className="text-[11px] font-[600] tracking-[0.06em] text-[#6B6B6B] uppercase">Clips Generated</div>
              </div>
              <div className="h-8 w-px bg-[#E8E8E3]" />
              <div>
                <div className="text-[24px] font-[700] tracking-[-0.02em]">98.3%</div>
                <div className="text-[11px] font-[600] tracking-[0.06em] text-[#6B6B6B] uppercase">Accuracy Rate</div>
              </div>
              <div className="h-8 w-px bg-[#E8E8E3]" />
              <div>
                <div className="text-[24px] font-[700] tracking-[-0.02em]">Free</div>
                <div className="text-[11px] font-[600] tracking-[0.06em] text-[#6B6B6B] uppercase">Forever Plan</div>
              </div>
            </div>
          </div>

          {/* Right - Floating elements hero */}
          <div className="flex-1 relative w-full lg:h-[600px] h-[500px] flex items-center justify-center">
            {/* Main card */}
            <div className="relative z-10 w-[340px] lg:w-[380px] rounded-[24px] border border-[#E8E8E3] bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_48px_rgba(0,0,0,0.08)] animate-float">
              <div className="aspect-[9/16] rounded-[16px] bg-[#0A0A0A] overflow-hidden relative">
                <img src="/images/hero-main-nobg.png" alt="Video Editor" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Mock subtitle */}
                <div className="absolute bottom-12 left-3 right-3">
                  <div className="rounded-[10px] bg-white px-3 py-2 shadow-lg">
                    <div className="text-[13px] font-[800] leading-tight tracking-[-0.01em]">THIS IS HOW YOU GO VIRAL</div>
                    <div className="mt-1 h-1 w-full rounded-full bg-[#E8E8E3] overflow-hidden">
                      <div className="h-full w-[68%] bg-[#0A0A0A] rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Top bar */}
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
              
              {/* Bottom stats */}
              <div className="mt-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#FFD60A] flex items-center justify-center text-[10px] font-[800]">A</div>
                  <span className="text-[12px] font-[600]">Score 94</span>
                  <span className="rounded-full bg-[#F5F5F0] px-2 py-0.5 text-[10px] font-[600]">VIRAL</span>
                </div>
                <span className="text-[11px] font-[500] text-[#6B6B6B]">00:24</span>
              </div>
            </div>

            {/* Floating elements - using generated AI images with rembg */}
            <div className="absolute top-8 -right-2 lg:right-8 z-20 w-[92px] rounded-[16px] border border-[#E8E8E3] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] animate-float-slow">
              <img src="/images/float-subtitle-nobg.png" alt="Subtitle" className="w-full h-auto rounded-[8px]" />
              <div className="mt-2 text-[10px] font-[650] leading-tight">Auto Subtitle</div>
              <div className="text-[9px] text-[#6B6B6B]">Hormozi style</div>
            </div>

            <div className="absolute top-32 -left-2 lg:left-4 z-20 w-[110px] rounded-[16px] border border-[#E8E8E3] bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.08)] animate-float-delayed">
              <img src="/images/float-waveform-nobg.png" alt="Waveform" className="w-full h-10 object-contain" />
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1 flex-1 rounded-full bg-[#0A0A0A]" />
                <div className="h-1 w-8 rounded-full bg-[#E8E8E3]" />
              </div>
              <div className="mt-1.5 text-[9px] font-[600] text-[#6B6B6B] tracking-[0.05em] uppercase">Transcribing</div>
            </div>

            <div className="absolute bottom-16 -left-4 lg:left-0 z-20 w-[88px] rounded-[20px] border border-[#E8E8E3] bg-[#0A0A0A] p-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.18)] animate-float">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mx-auto">
                <div className="h-0 w-0 border-l-[8px] border-l-[#0A0A0A] border-y-[5px] border-y-transparent ml-0.5" />
              </div>
              <div className="mt-2 text-center">
                <div className="text-[11px] font-[700] text-white">Play Clip</div>
                <div className="text-[9px] text-white/60">Space</div>
              </div>
              <img src="/images/float-play-nobg.png" alt="" className="hidden" />
            </div>

            <div className="absolute bottom-8 right-0 lg:right-12 z-20 w-[120px] rounded-[16px] border border-[#E8E8E3] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] animate-float-delayed">
              <img src="/images/float-timeline-nobg.png" alt="Timeline" className="w-full h-12 object-contain rounded-[6px] bg-[#F5F5F0]" />
              <div className="mt-2 flex gap-1">
                <div className="h-1.5 flex-1 rounded-full bg-[#FFD60A]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#0A0A0A]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#E8E8E3]" />
              </div>
              <div className="mt-1.5 text-[9px] font-[600] tracking-[0.05em]">5 CLIPS READY</div>
            </div>

            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(255,214,10,0.08),transparent_60%)] -z-10 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
