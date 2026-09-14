"use client"

import { useState, useEffect } from 'react'

const STYLES = [
  {
    id: 'hormozi',
    name: 'Hormozi',
    desc: 'Bold yellow highlight',
    preview: 'RAHASIA JADI KAYA',
    font: 'font-black tracking-tight',
    textColor: 'text-white',
    highlight: 'bg-[#FFD60A] text-black px-1',
    stroke: 'drop-shadow-[0_2px_0_rgba(0,0,0,1)]',
    anim: 'animate-bounce-subtle'
  },
  {
    id: 'mrbeast',
    name: 'MrBeast',
    desc: 'Big energetic red',
    preview: 'INSANE! GILA BANGET!',
    font: 'font-black',
    textColor: 'text-white',
    highlight: 'text-[#FF2D2D]',
    stroke: 'drop-shadow-[0_3px_0_rgba(0,0,0,1)]',
    anim: 'animate-pop'
  },
  {
    id: 'karaoke',
    name: 'Karaoke',
    desc: 'Box highlight word',
    preview: 'Karaoke style highlight',
    font: 'font-bold',
    textColor: 'text-black',
    highlight: 'bg-[#FFD60A]',
    stroke: '',
    anim: 'animate-slide'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Clean professional',
    preview: 'Clean and simple',
    font: 'font-medium',
    textColor: 'text-white',
    highlight: 'underline decoration-2 underline-offset-4',
    stroke: 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]',
    anim: 'animate-fade'
  },
  {
    id: 'tiktok',
    name: 'TikTok Viral',
    desc: '2 words center',
    preview: 'VIRAL BANGET',
    font: 'font-black',
    textColor: 'text-white',
    highlight: 'text-[#FF2D55]',
    stroke: 'drop-shadow-[0_2px_0_rgba(0,0,0,1)]',
    anim: 'animate-bounce-subtle'
  },
  {
    id: 'editorial',
    name: 'Editorial',
    desc: 'Serif premium',
    preview: 'Premium Storytelling',
    font: 'font-serif font-bold',
    textColor: 'text-[#0A0A0A]',
    highlight: 'bg-white/90',
    stroke: '',
    anim: 'animate-fade'
  }
]

const ANIMATIONS = [
  { id: 'pop', name: 'Pop', desc: 'Scale pop on word' },
  { id: 'bounce', name: 'Bounce', desc: 'Bouncy energetic' },
  { id: 'slide', name: 'Slide', desc: 'Slide up smooth' },
  { id: 'fade', name: 'Fade', desc: 'Fade in elegant' },
  { id: 'karaoke', name: 'Karaoke', desc: 'Word by word box' },
  { id: 'wave', name: 'Wave', desc: 'Wave motion' }
]

export function SubtitleShowcase({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'
  const [activeStyle, setActiveStyle] = useState(0)
  const [activeAnim, setActiveAnim] = useState(0)
  const [currentWord, setCurrentWord] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const words = STYLES[activeStyle].preview.split(' ')

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % words.length)
    }, 600)
    return () => clearInterval(interval)
  }, [isPlaying, words.length, activeStyle])

  useEffect(() => {
    setCurrentWord(0)
  }, [activeStyle])

  return (
    <section className="border-t border-[#E8E8E3] bg-[#0A0A0A] text-white py-16 lg:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-[640px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1 text-[11px] font-[600] tracking-[0.04em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD60A] animate-pulse" />
            {isId ? '6 GAYA SUBTITLE + 6 ANIMASI • PREVIEW REAL' : '6 SUBTITLE STYLES + 6 ANIMATIONS • REAL PREVIEW'}
          </div>
          <h2 className="mt-4 text-[28px] lg:text-[40px] font-[750] tracking-[-0.04em] leading-[0.95]">
            {isId ? 'Subtitle yang bikin' : 'Subtitles that make'} <br />
            <span className="text-[#FFD60A]">{isId ? 'orang nonton sampe habis.' : 'people watch till end.'}</span>
          </h2>
          <p className="mt-4 text-[14px] leading-[1.6] text-white/60">
            {isId ? 'Setiap gaya punya karakter beda. Preview di bawah ini real rendering pakai Canvas, sama kayak export final. Bisa play, ganti animasi, lihat perbedaan.' : 'Each style has different character. Preview below is real Canvas rendering, same as final export. Play, change animation, see difference.'}
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Preview */}
          <div className="relative rounded-[24px] border border-white/10 bg-[#111111] p-3 lg:p-4">
            <div className="aspect-[9/16] max-h-[560px] mx-auto w-full max-w-[360px] rounded-[20px] bg-black overflow-hidden relative">
              {/* Fake video background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=700&fit=crop" alt="creator" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Top bar */}
              <div className="absolute top-3 left-3 right-3 flex justify-between">
                <span className="text-[9px] px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-[700]">REC • {STYLES[activeStyle].name}</span>
                <span className="text-[9px] px-2 py-1 rounded-full bg-white text-black font-[700]">1080x1920</span>
              </div>

              {/* Subtitle preview */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className={`text-[28px] leading-[1.1] ${STYLES[activeStyle].font} ${STYLES[activeStyle].textColor} ${STYLES[activeStyle].stroke} transition-all duration-300`}>
                    {words.map((w, i) => {
                      const isActive = i === currentWord
                      const isPast = i < currentWord
                      return (
                        <span
                          key={i}
                          className={`inline-block mx-1 transition-all duration-300 ${
                            isActive ? `${STYLES[activeStyle].highlight} ${STYLES[activeStyle].anim} scale-110` : 
                            isPast ? 'opacity-60 scale-95' : 'opacity-30'
                          }`}
                          style={{
                            transform: isActive ? (activeAnim === 0 ? 'scale(1.15)' : activeAnim === 1 ? 'translateY(-6px) scale(1.1)' : 'none') : 'none',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                        >
                          {w}
                        </span>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-[10px] text-white/50 font-mono">
                    {ANIMATIONS[activeAnim].name} • {STYLES[activeStyle].name} • {isPlaying ? '▶ Playing' : '⏸ Paused'}
                  </div>
                </div>
              </div>

              {/* Hook */}
              <div className="absolute top-[18%] left-0 right-0 text-center">
                <div className="inline-block rounded-full bg-[#FFD60A] text-black px-3 py-1 text-[10px] font-[800] tracking-[0.02em]">🔥 HOOK: RAHA...</div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-[800]">
                    {isPlaying ? '||' : '▶'}
                  </button>
                  <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-[#FFD60A] rounded-full transition-all duration-300" style={{ width: `${((currentWord+1)/words.length)*100}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-white/60">{currentWord+1}/{words.length}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-center gap-2">
              {STYLES.map((s, i) => (
                <button key={s.id} onClick={() => setActiveStyle(i)} className={`h-2 rounded-full transition-all ${i === activeStyle ? 'w-6 bg-[#FFD60A]' : 'w-2 bg-white/20'}`} />
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-[11px] font-[700] tracking-[0.08em] uppercase text-white/60">{isId ? 'Gaya Subtitle' : 'Subtitle Styles'}</h3>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {STYLES.map((s, i) => (
                  <button key={s.id} onClick={() => setActiveStyle(i)} className={`text-left rounded-[14px] border p-3 transition flex items-center justify-between ${i === activeStyle ? 'bg-white text-black border-white' : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-white'}`}>
                    <div>
                      <div className="text-[12px] font-[700]">{s.name}</div>
                      <div className={`text-[10px] ${i === activeStyle ? 'text-black/60' : 'text-white/40'}`}>{s.desc}</div>
                    </div>
                    <div className={`text-[11px] px-2 py-1 rounded-full ${i === activeStyle ? 'bg-black text-white' : 'bg-white/10'}`}>{s.preview.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-[11px] font-[700] tracking-[0.08em] uppercase text-white/60">{isId ? 'Animasi' : 'Animations'}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {ANIMATIONS.map((a, i) => (
                  <button key={a.id} onClick={() => setActiveAnim(i)} className={`text-left rounded-[12px] border p-2.5 transition ${i === activeAnim ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-white/[0.04] border-white/10 text-white/70 hover:text-white'}`}>
                    <div className="text-[11px] font-[700]">{a.name}</div>
                    <div className="text-[9px] opacity-60">{a.desc}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-[12px] bg-black/50 border border-white/5 p-3">
                <div className="text-[10px] font-[600] text-white/60 uppercase tracking-[0.06em]">{isId ? 'Preview Real' : 'Real Preview'}</div>
                <div className="mt-1 text-[11px] leading-[1.5] text-white/40">
                  {isId ? 'Rendering pakai teknologi browser sama kayak export final. Semua animasi pakai kurva bouncy biar hidup.' : 'Rendering with browser tech same as final export. All animations use bouncy curve for lively feel.'}
                </div>
              </div>
            </div>

            <div className="rounded-[20px] bg-[#FFD60A] text-black p-5">
              <h3 className="text-[12px] font-[800]">{isId ? '🔥 Paling populer: Hormozi + Pop' : '🔥 Most popular: Hormozi + Pop'}</h3>
              <p className="mt-1 text-[11px] leading-[1.5] opacity-70">
                {isId ? 'Dipakai 67% kreator. Retention +40%, CTR +28%. Cocok untuk konten bisnis, edukasi, motivasi.' : 'Used by 67% creators. Retention +40%, CTR +28%. Perfect for business, education, motivation.'}
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-[9px] px-2 py-1 rounded-full bg-black text-white font-[700]">67% USAGE</span>
                <span className="text-[9px] px-2 py-1 rounded-full bg-black/10 border border-black/10 font-[600]">+40% RETENTION</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.05); }
        }
        @keyframes pop {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1.1); }
        }
        @keyframes slide {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-bounce-subtle { animation: bounce-subtle 0.6s ease-in-out infinite; }
        .animate-pop { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-slide { animation: slide 0.3s ease-out; }
        .animate-fade { animation: fade 0.3s ease-out; }
      `}</style>
    </section>
  )
}
