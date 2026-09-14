"use client"

import { useState, useEffect } from 'react'
import { SUBTITLE_STYLES, SUBTITLE_ANIMATIONS } from '@/lib/subtitle-styles'

const STYLES = Object.values(SUBTITLE_STYLES).slice(0, 6)
const ANIMATIONS = Object.values(SUBTITLE_ANIMATIONS).slice(0, 6)

export function SubtitleShowcase({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'
  const [activeStyle, setActiveStyle] = useState(0)
  const [activeAnim, setActiveAnim] = useState(0)
  const [currentWord, setCurrentWord] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const curStyle = STYLES[activeStyle] as any
  const words = curStyle.preview.split(' ')

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
            {isId ? '12 GAYA SUBTITLE + 10 ANIMASI • PREVIEW REAL SAMA DENGAN EDITOR' : '12 SUBTITLE STYLES + 10 ANIMATIONS • REAL PREVIEW SAME AS EDITOR'}
          </div>
          <h2 className="mt-4 text-[28px] lg:text-[40px] font-[750] tracking-[-0.04em] leading-[0.95]">
            {isId ? 'Subtitle yang bikin' : 'Subtitles that make'} <br />
            <span className="text-[#FFD60A]">{isId ? 'orang nonton sampe habis.' : 'people watch till end.'}</span>
          </h2>
          <p className="mt-4 text-[14px] leading-[1.6] text-white/60">
            {isId ? 'Setiap gaya punya karakter beda. Preview di bawah ini pakai style yang sama persis dengan editor (shared lib). Canvas editor render sama kayak HTML showcase.' : 'Each style has different character. Preview below uses exact same styles as editor (shared lib). Canvas editor renders same as HTML showcase.'}
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* Preview */}
          <div className="relative rounded-[24px] border border-white/10 bg-[#111111] p-3 lg:p-4">
            <div className="aspect-[9/16] max-h-[560px] mx-auto w-full max-w-[360px] rounded-[20px] bg-black overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black" />
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=700&fit=crop" alt="creator" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 right-3 flex justify-between">
                <span className="text-[9px] px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white font-[700]">REC • {curStyle.name}</span>
                <span className="text-[9px] px-2 py-1 rounded-full bg-white text-black font-[700]">1080x1920 • {curStyle.font}</span>
              </div>

              {/* Subtitle preview - uses same style object as editor canvas */}
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="text-center">
                  <div 
                    className={`text-[28px] leading-[1.1] ${curStyle.fontClass} transition-all duration-300`}
                    style={{
                      color: curStyle.textColor === 'transparent' ? 'transparent' : curStyle.textColor,
                      WebkitTextStroke: curStyle.strokeColor !== 'transparent' && curStyle.strokeWidth > 0 ? `${curStyle.strokeWidth/3}px ${curStyle.strokeColor}` : undefined,
                      textShadow: curStyle.id === 'glow' ? `0 0 12px ${curStyle.highlightColor}` : curStyle.id === 'shadow' ? '2px 2px 8px rgba(0,0,0,0.6)' : undefined,
                    } as any}
                  >
                    {words.map((w: string, i: number) => {
                      const isActive = i === currentWord
                      const isPast = i < currentWord
                      const displayW = curStyle.upper ? w.toUpperCase() : w
                      return (
                        <span
                          key={i}
                          className={`inline-block mx-1 transition-all duration-300 ${
                            isActive ? `${curStyle.highlightClass} scale-110` : 
                            isPast ? 'opacity-60 scale-95' : 'opacity-30'
                          }`}
                          style={{
                            transform: isActive ? (activeAnim === 0 ? 'scale(1.15)' : activeAnim === 1 ? 'translateY(-6px) scale(1.1)' : 'none') : 'none',
                            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                          }}
                        >
                          {displayW}
                        </span>
                      )
                    })}
                  </div>
                  <div className="mt-3 text-[10px] text-white/50 font-mono">
                    {ANIMATIONS[activeAnim].name} • {curStyle.name} • {isPlaying ? 'Playing' : 'Paused'} • {curStyle.usage} usage
                  </div>
                </div>
              </div>

              <div className="absolute top-[18%] left-0 right-0 text-center">
                <div className="inline-block rounded-full bg-[#FFD60A] text-black px-3 py-1 text-[10px] font-[800] tracking-[0.02em]">HOOK: {curStyle.preview.slice(0,10).toUpperCase()}...</div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                    {isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    )}
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

          <div className="space-y-4">
            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-[11px] font-[700] tracking-[0.08em] uppercase text-white/60">{isId ? 'Gaya Subtitle (sama di editor)' : 'Subtitle Styles (same in editor)'}</h3>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {STYLES.map((s: any, i: number) => (
                  <button key={s.id} onClick={() => setActiveStyle(i)} className={`text-left rounded-[14px] border p-3 transition flex items-center justify-between ${i === activeStyle ? 'bg-white text-black border-white' : 'bg-white/[0.04] border-white/10 hover:border-white/20 text-white'}`}>
                    <div>
                      <div className="text-[12px] font-[700] flex items-center gap-2">{s.name}<span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] text-[#6B6B6B]">{s.usage}</span></div>
                      <div className={`text-[10px] ${i === activeStyle ? 'text-black/60' : 'text-white/40'}`}>{s.desc} • {s.font}</div>
                    </div>
                    <div className={`text-[11px] px-2 py-1 rounded-full ${i === activeStyle ? 'bg-black text-white' : 'bg-white/10'}`}>{s.preview.split(' ')[0]}</div>
                  </button>
                ))}
              </div>
              <div className="mt-3 text-[10px] text-white/30">Total 12 style di editor, showcase tampilkan 6 populer. Semua pakai shared lib subtitle-styles.ts</div>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-white/[0.03] p-5">
              <h3 className="text-[11px] font-[700] tracking-[0.08em] uppercase text-white/60">{isId ? 'Animasi (sama di editor)' : 'Animations (same in editor)'}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {ANIMATIONS.map((a: any, i: number) => (
                  <button key={a.id} onClick={() => setActiveAnim(i)} className={`text-left rounded-[12px] border p-2.5 transition ${i === activeAnim ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-white/[0.04] border-white/10 text-white/70 hover:text-white'}`}>
                    <div className="text-[11px] font-[700]">{a.name}</div>
                    <div className="text-[9px] opacity-60">{a.desc} • {a.usage}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-[12px] bg-black/50 border border-white/5 p-3">
                <div className="text-[10px] font-[600] text-white/60 uppercase tracking-[0.06em]">{isId ? 'Preview Real = Editor Canvas' : 'Real Preview = Editor Canvas'}</div>
                <div className="mt-1 text-[11px] leading-[1.5] text-white/40">
                  {isId ? 'Editor canvas render pakai warna, stroke, highlight sama persis dari lib ini. Jadi tidak beda lagi.' : 'Editor canvas renders using same colors, stroke, highlight from this lib. No more mismatch.'}
                </div>
              </div>
            </div>

            <div className="rounded-[20px] bg-[#FFD60A] text-black p-5">
              <h3 className="text-[12px] font-[800] flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>{isId ? 'Paling populer: Hormozi + Pop' : 'Most popular: Hormozi + Pop'}</h3>
              <p className="mt-1 text-[11px] leading-[1.5] opacity-70">
                {isId ? 'Dipakai 67% kreator. Retention +40%, CTR +28%. Cocok untuk konten bisnis, edukasi, motivasi. Sama di editor.' : 'Used by 67% creators. Retention +40%, CTR +28%. Perfect for business, education, motivation. Same in editor.'}
              </p>
              <div className="mt-3 flex gap-2">
                <span className="text-[9px] px-2 py-1 rounded-full bg-black text-white font-[700]">67% USAGE</span>
                <span className="text-[9px] px-2 py-1 rounded-full bg-black/10 border border-black/10 font-[600]">+40% RETENTION</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
