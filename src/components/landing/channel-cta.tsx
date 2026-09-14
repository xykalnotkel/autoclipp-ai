"use client"

export function ChannelCTA({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'

  return (
    <section className="border-t border-[#E8E8E3] bg-[#FCFCF9] py-12 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="rounded-[24px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-8 lg:p-10 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_top_right,_rgba(37,211,102,0.15),transparent_60%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,214,10,0.12),transparent_60%)] pointer-events-none" />
          
          <div className="relative flex flex-col lg:flex-row justify-between gap-8">
            <div className="max-w-[560px]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-[600]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
                {isId ? 'DIBALIK AUTOCLIPP • SOLO DEV + AGENT' : 'BEHIND AUTOCLIPP • SOLO DEV + AGENT'}
              </div>
              <h2 className="mt-4 text-[24px] lg:text-[32px] font-[750] tracking-[-0.03em] leading-[1.1]">
                {isId ? 'Dibuat solo dev + AI agent,' : 'Built by solo dev + AI agent,'} <br />
                <span className="text-[#25D366]">{isId ? 'untuk kreator Indonesia.' : 'for Indonesian creators.'}</span>
              </h2>
              <p className="mt-3 text-[13px] leading-[1.6] text-white/60">
                {isId ? 'AutoClipp AI dibuat oleh XySpace — solo dev yang pakai AI agent untuk ngebut development. Gak ada tim besar, gak ada VC, cuma fokus bantu kreator bikin viral shorts tanpa watermark. Semua feedback real, pembayaran real, open untuk kolaborasi.' : 'AutoClipp AI is built by XySpace — solo dev using AI agent to speed up development. No big team, no VC, just focus helping creators make viral shorts without watermark. All feedback real, payments real, open for collab.'}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10">Solo Dev</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/10 border border-white/10">AI Agent</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">Made by XySpace</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#25D366] text-white font-[600]">No VC • No Team</span>
              </div>

              <div className="mt-6">
                <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-2.5 text-[13px] font-[600] hover:bg-[#1da851] transition">
                  <span>📢</span>
                  {isId ? 'Join Channel WA XySpace' : 'Join XySpace WA Channel'}
                  <span className="ml-1 text-[10px] opacity-80">↗</span>
                </a>
                <span className="ml-3 text-[11px] text-white/40">{isId ? 'Update fitur, tips viral, behind the scene' : 'Feature updates, viral tips, behind the scene'}</span>
              </div>
            </div>

            <div className="lg:w-[340px] space-y-3">
              <div className="rounded-[16px] bg-white/[0.04] border border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[12px] bg-white text-black flex items-center justify-center font-[800]">X</div>
                  <div>
                    <div className="text-[13px] font-[700]">XySpace</div>
                    <div className="text-[11px] text-white/50">Solo Dev • Creator Tools</div>
                  </div>
                  <div className="ml-auto h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                <div className="mt-3 text-[11px] leading-[1.5] text-white/60">
                  {isId ? '"Gue percaya kreator Indonesia bisa go international. Tool harus gratis, tanpa watermark, dan gampang. Itu prinsip AutoClipp."' : '"I believe Indonesian creators can go international. Tools must be free, no watermark, easy. That is AutoClipp principle."'}
                </div>
              </div>

              <div className="rounded-[16px] bg-[#FFD60A] text-black p-4">
                <div className="text-[11px] font-[800] tracking-[0.06em] uppercase">Channel WA</div>
                <div className="mt-1 text-[13px] font-[700] leading-[1.3]">XySpace — AutoClipp Updates</div>
                <div className="mt-1 text-[11px] leading-[1.4] opacity-70">
                  {isId ? 'Dapetin update fitur terbaru, template subtitle viral, dan cara monetisasi shorts. Join 1k+ kreator.' : 'Get latest feature updates, viral subtitle templates, and shorts monetization tips. Join 1k+ creators.'}
                </div>
                <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="mt-3 inline-flex rounded-full bg-black text-white px-4 py-2 text-[11px] font-[600]">Join Channel →</a>
              </div>

              <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-3 text-center">
                <div className="text-[10px] text-white/40 font-mono">https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
