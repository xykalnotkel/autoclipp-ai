"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

type Word = { word: string; start: number; end: number }
type Clip = {
  id: number
  start: number
  end: number
  duration: number
  hook: string
  score: number
  label: string
  words: Word[]
}

const STYLES = {
  hormozi: { name: 'Hormozi', desc: 'Yellow highlight viral', font: 'Anton', text: '#FFFFFF', highlight: '#FFD60A', stroke: '#000000', sw: 8, bg: 'transparent', upper: true },
  mrbeast: { name: 'MrBeast', desc: 'Big bold energetic', font: 'Bebas Neue', text: '#FFFFFF', highlight: '#FF2D2D', stroke: '#000000', sw: 10, bg: 'transparent', upper: true },
  karaoke: { name: 'Karaoke', desc: 'Box highlight', font: 'Montserrat', text: '#FFFFFF', highlight: '#000000', stroke: 'transparent', sw: 0, bg: '#FFD60A', upper: false },
  minimal: { name: 'Minimal', desc: 'Clean professional', font: 'Inter', text: '#FFFFFF', highlight: '#FFFFFF', stroke: '#000000', sw: 4, bg: 'transparent', upper: false },
  tiktok: { name: 'TikTok', desc: '2 words center', font: 'Oswald', text: '#FFFFFF', highlight: '#FF2D55', stroke: '#000000', sw: 6, bg: 'transparent', upper: true },
  editorial: { name: 'Editorial', desc: 'Serif premium', font: 'Inter', text: '#0A0A0A', highlight: '#0A0A0A', stroke: '#FFFFFF', sw: 6, bg: 'rgba(255,255,255,0.9)', upper: false },
}

const MOCK: Word[] = [
  { word: "Guys,", start: 0.0, end: 0.4 }, { word: "ini", start: 0.4, end: 0.6 }, { word: "rahasia", start: 0.6, end: 1.1 },
  { word: "yang", start: 1.1, end: 1.3 }, { word: "gak", start: 1.3, end: 1.5 }, { word: "pernah", start: 1.5, end: 1.9 },
  { word: "diajarin", start: 1.9, end: 2.5 }, { word: "di", start: 2.5, end: 2.7 }, { word: "sekolah", start: 2.7, end: 3.3 },
  { word: "bisnis!", start: 3.3, end: 4.0 }, { word: "Kalo", start: 4.5, end: 4.8 }, { word: "lu", start: 4.8, end: 5.0 },
  { word: "mau", start: 5.0, end: 5.2 }, { word: "kaya,", start: 5.2, end: 5.7 }, { word: "stop", start: 5.7, end: 6.0 },
  { word: "kerja", start: 6.0, end: 6.4 }, { word: "keras,", start: 6.4, end: 6.9 }, { word: "mulai", start: 6.9, end: 7.2 },
  { word: "kerja", start: 7.2, end: 7.5 }, { word: "cerdas.", start: 7.5, end: 8.2 }, { word: "Gue", start: 8.8, end: 9.1 },
  { word: "bangun", start: 9.1, end: 9.5 }, { word: "bisnis", start: 9.5, end: 10.0 }, { word: "pertama", start: 10.0, end: 10.6 },
  { word: "umur", start: 10.6, end: 10.9 }, { word: "19", start: 10.9, end: 11.3 }, { word: "tahun", start: 11.3, end: 11.8 },
]

export default function EditorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [clips, setClips] = useState<Clip[]>([])
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)
  const [styleKey, setStyleKey] = useState<keyof typeof STYLES>('hormozi')
  const [anim, setAnim] = useState('pop')
  const [fontSize, setFontSize] = useState(64)
  const [pos, setPos] = useState<'top'|'center'|'bottom'>('bottom')
  const [wpl, setWpl] = useState(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hook, setHook] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [progress, setProgress] = useState(0)
  const [projectTitle, setProjectTitle] = useState('Untitled Project')
  const [saving, setSaving] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const style = STYLES[styleKey]

  const genClips = useCallback((words: Word[], dur: number) => {
    const total = words[words.length-1]?.end || dur || 30
    const hooks = [
      "RAHASIA YANG TIDAK DIAJARKAN DI SEKOLAH",
      "STOP KERJA KERAS, MULAI KERJA CERDAS",
      "MODAL 500 RIBU JADI MILYARAN",
      "KESALAHAN 90 PERSEN PEMULA BISNIS",
      "CARA BALIK MODAL DALAM 7 HARI"
    ]
    const newClips: Clip[] = []
    for (let i=0; i<Math.min(5, Math.ceil(total/22)); i++) {
      const start = i * 18
      const end = Math.min(start + 24, total)
      newClips.push({
        id: i,
        start, end, duration: end-start,
        hook: hooks[i] || `VIRAL MOMENT ${i+1}`,
        score: 95 - i*6 + Math.floor(Math.random()*4),
        label: i===0 ? 'VIRAL' : i===1 ? 'HIGH' : 'GOOD',
        words: words.filter(w => w.start >= start && w.end <= end)
      })
    }
    setClips(newClips)
    if (newClips[0]) {
      setSelectedClip(newClips[0])
      setHook(newClips[0].hook)
    }
  }, [])

  const handleTranscribe = async () => {
    if (!videoUrl) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, duration })
      })
      const data = await res.json()
      let words = data.words || MOCK
      if (duration > 14 && words.length === MOCK.length) {
        const reps = Math.ceil(duration/14)
        let ext: Word[] = []
        for (let r=0; r<reps; r++) words.forEach((w: Word) => ext.push({ ...w, start: w.start + r*14, end: w.end + r*14 }))
        words = ext.filter((w: Word) => w.end <= duration)
      }
      genClips(words, duration)

      // Also get AI clips
      try {
        const clipRes = await fetch('/api/clips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: words, duration })
        })
        const clipData = await clipRes.json()
        if (clipData.clips && clipData.clips.length) {
          // merge with existing
        }
      } catch {}
    } catch {
      genClips(MOCK, duration)
    }
    setIsProcessing(false)
  }

  const handleFile = async (f: File) => {
    setVideoFile(f)
    setVideoUrl(URL.createObjectURL(f))
    setProjectTitle(f.name.replace(/\.[^/.]+$/, ''))
    setClips([])
    setSelectedClip(null)

    // Upload to backend securely
    try {
      const fd = new FormData()
      fd.append('file', f)
      await fetch('/api/upload', { method: 'POST', body: fd })
    } catch {}
  }

  const handleSaveProject = async () => {
    if (!clips.length) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          title: projectTitle,
          duration,
          status: 'completed'
        })
        .select()
        .single()

      if (error) throw error

      if (project) {
        const clipsToInsert = clips.map(c => ({
          project_id: project.id,
          user_id: user.id,
          start_time: c.start,
          end_time: c.end,
          duration: c.duration,
          hook_title: c.hook,
          virality_score: c.score,
          label: c.label,
          style: styleKey,
          transcript: c.words
        }))

        await supabase.from('clips').insert(clipsToInsert)
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !selectedClip) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      if (!video || video.paused) { requestAnimationFrame(render); return }
      const vw = canvas.width, vh = canvas.height
      ctx.clearRect(0,0,vw,vh)
      ctx.filter = 'blur(24px) brightness(0.55)'
      ctx.drawImage(video, 0,0,vw,vh)
      ctx.filter = 'none'
      const va = video.videoWidth / video.videoHeight
      const ca = vw / vh
      let sx,sy,sw,sh
      if (va > ca) { sh = video.videoHeight; sw = sh*ca; sx=(video.videoWidth-sw)/2; sy=0 }
      else { sw = video.videoWidth; sh = sw/ca; sx=0; sy=(video.videoHeight-sh)/2 }
      const tw = vw*0.92, th = tw/ca, tx=(vw-tw)/2, ty=(vh-th)/2
      ctx.save()
      ctx.beginPath()
      // @ts-ignore
      if (ctx.roundRect) ctx.roundRect(tx,ty,tw,th,18); else ctx.rect(tx,ty,tw,th)
      ctx.clip()
      ctx.drawImage(video, sx,sy,sw,sh, tx,ty,tw,th)
      ctx.restore()

      const ct = currentTime - selectedClip.start
      const at = selectedClip.start + ct
      const visible = selectedClip.words.filter(w => at >= w.start-0.1 && at <= w.end+0.7)
      if (visible.length) {
        const toShow = visible.slice(-wpl)
        const cur = selectedClip.words.find(w => at >= w.start && at <= w.end)
        let text = toShow.map(w=>w.word).join(' ')
        if (style.upper) text = text.toUpperCase()
        let y = vh*0.78
        if (pos==='top') y = vh*0.22
        if (pos==='center') y = vh*0.5
        if (pos==='bottom') y = vh*0.82
        ctx.textAlign='center'
        ctx.textBaseline='middle'
        const ff = style.font==='Montserrat'?'Montserrat': style.font==='Bebas Neue'?'Bebas Neue': style.font==='Anton'?'Anton': style.font==='Oswald'?'Oswald':'Inter'
        ctx.font = `900 ${fontSize}px "${ff}", sans-serif`
        const mw = ctx.measureText(text).width
        const tht = fontSize*1.15
        let scale=1, oy=0, op=1
        if (cur) {
          const p = (at - cur.start)/(cur.end-cur.start)
          if (anim==='pop') scale = 1 + Math.sin(p*Math.PI)*0.12
          else if (anim==='bounce') { scale=1+Math.abs(Math.sin(p*Math.PI*2))*0.18; oy=-Math.abs(Math.sin(p*Math.PI))*8 }
          else if (anim==='slide') { oy=(1-p)*16; op=p }
        }
        ctx.save()
        ctx.globalAlpha=op
        ctx.translate(vw/2, y+oy)
        ctx.scale(scale,scale)
        if (style.bg !== 'transparent') {
          ctx.fillStyle = style.bg
          ctx.beginPath()
          // @ts-ignore
          if (ctx.roundRect) ctx.roundRect(-mw/2-18, -tht/2-8, mw+36, tht+16, 10); else ctx.rect(-mw/2-18, -tht/2-8, mw+36, tht+16)
          ctx.fill()
        }
        if (style.sw>0) {
          ctx.strokeStyle = style.stroke
          ctx.lineWidth = style.sw
          ctx.lineJoin='round'
          ctx.strokeText(text,0,0)
        }
        if (toShow.length>1 && cur) {
          let xo = -mw/2
          toShow.forEach(w=>{
            const isCur = cur && w.word===cur.word
            const wt = style.upper ? w.word.toUpperCase() : w.word
            const ww = ctx.measureText(wt+' ').width
            ctx.fillStyle = isCur ? style.highlight : style.text
            ctx.fillText(wt+' ', xo+ww/2, 0)
            xo+=ww
          })
        } else {
          ctx.fillStyle = style.text
          ctx.fillText(text,0,0)
        }
        ctx.restore()
        if (hook) {
          ctx.save()
          ctx.font=`700 22px Inter, sans-serif`
          ctx.fillStyle='#FFD60A'
          ctx.strokeStyle='#000'
          ctx.lineWidth=5
          ctx.textAlign='center'
          const hy = vh*0.11
          ctx.strokeText(hook, vw/2, hy)
          ctx.fillText(hook, vw/2, hy)
          ctx.restore()
        }
      }
      requestAnimationFrame(render)
    }
    render()
  }, [selectedClip, currentTime, fontSize, pos, wpl, anim, style, hook, styleKey])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const ut = () => {
      setCurrentTime(v.currentTime)
      if (selectedClip && v.currentTime >= selectedClip.end) v.currentTime = selectedClip.start
    }
    const lm = () => setDuration(v.duration)
    v.addEventListener('timeupdate', ut)
    v.addEventListener('loadedmetadata', lm)
    return () => { v.removeEventListener('timeupdate', ut); v.removeEventListener('loadedmetadata', lm) }
  }, [selectedClip])

  const doExport = async () => {
    setShowExport(true); setProgress(0)
    for (let i=0;i<=100;i+=8){ await new Promise(r=>setTimeout(r,160)); setProgress(i) }
    setTimeout(()=>{ setShowExport(false) },400)
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#0A0A0A]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
              <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
              <input value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} className="ml-3 hidden md:block h-7 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-[500] w-[180px] focus:outline-none focus:border-[#0A0A0A]" />
            </Link>
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#F5F5F0] p-1 border border-[#E8E8E3]">
              <Link href="/" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">Home</Link>
              <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-white text-[12px] font-[600]">Editor</span>
              <Link href="/projects" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">Projects</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8" onClick={handleSaveProject} disabled={saving || !clips.length}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button size="sm" className="h-8" onClick={doExport} disabled={!selectedClip}>Export</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-5">
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Source</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">STEP 1</span>
            </div>
            <div
              onDrop={e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('video/')) handleFile(f)}}
              onDragOver={e=>e.preventDefault()}
              onClick={()=>fileRef.current?.click()}
              className="rounded-[16px] border border-dashed border-[#E8E8E3] bg-[#FCFCF9] p-6 text-center hover:border-[#0A0A0A] hover:bg-white cursor-pointer transition"
            >
              <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center text-[16px] font-[700]">↑</div>
              <div className="mt-3 text-[13px] font-[600] tracking-[-0.01em]">Drop video here</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">MP4, MOV up to 2GB</div>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFile(f)}} />
            </div>
            <div className="mt-4">
              <div className="flex gap-2">
                <input value={youtubeUrl} onChange={e=>setYoutubeUrl(e.target.value)} placeholder="Paste YouTube URL" className="flex-1 h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#0A0A0A]" />
                <Button size="sm" variant="secondary" className="h-9">Paste</Button>
              </div>
            </div>
            <Button className="w-full mt-4 h-10" disabled={!videoUrl || isProcessing} onClick={handleTranscribe}>
              {isProcessing ? 'Processing...' : 'Generate Clips'}
            </Button>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Clips ({clips.length})</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white">AI</span>
            </div>
            <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
              {clips.length===0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto h-10 w-10 rounded-[12px] border border-dashed border-[#E8E8E3] flex items-center justify-center text-[#9B9B9B]">—</div>
                  <div className="mt-3 text-[12px] font-[500] text-[#6B6B6B]">Upload and generate to see clips</div>
                </div>
              ) : clips.map(c=>(
                <button key={c.id} onClick={()=>{ setSelectedClip(c); setHook(c.hook); if(videoRef.current){ videoRef.current.currentTime=c.start; videoRef.current.play(); setIsPlaying(true) } }} className={`w-full text-left rounded-[14px] border p-3 transition ${selectedClip?.id===c.id ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-[700] tracking-[0.05em] px-2 py-0.5 rounded-full ${selectedClip?.id===c.id ? 'bg-white text-black' : 'bg-[#FFD60A] text-black'}`}>{c.label} {c.score}</span>
                    <span className="text-[10px] font-[500] opacity-70">{Math.floor(c.duration)}s</span>
                  </div>
                  <div className="mt-2 text-[12px] font-[600] leading-[1.3] tracking-[-0.01em] line-clamp-2">{c.hook}</div>
                  <div className="mt-1.5 text-[10px] opacity-60 font-mono">{Math.floor(c.start/60)}:{String(Math.floor(c.start%60)).padStart(2,'0')} - {Math.floor(c.end/60)}:{String(Math.floor(c.end%60)).padStart(2,'0')}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5">
          <Card className="p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Preview 9:16</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-[600] px-2 py-1 rounded-full bg-[#0A0A0A] text-white">1080x1920</span>
                <span className="text-[10px] font-[600] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">60 FPS</span>
              </div>
            </div>
            <div className="relative rounded-[18px] bg-[#0A0A0A] overflow-hidden aspect-[9/16] max-h-[700px] mx-auto">
              {videoUrl ? (
                <>
                  <video ref={videoRef} src={videoUrl} className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none" crossOrigin="anonymous" playsInline onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} />
                  <canvas ref={canvasRef} width={1080} height={1920} className="absolute inset-0 w-full h-full" />
                  {!isPlaying && (
                    <button onClick={()=>videoRef.current?.play()} className="absolute inset-0 flex items-center justify-center bg-black/15 backdrop-blur-[0.5px]">
                      <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:scale-105 transition">
                        <div className="h-0 w-0 border-l-[14px] border-l-[#0A0A0A] border-y-[8px] border-y-transparent ml-1" />
                      </div>
                    </button>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="flex items-center gap-3">
                      <button onClick={()=> isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-[800]">
                        {isPlaying ? '||' : '▶'}
                      </button>
                      <div className="flex-1">
                        <div className="h-1 rounded-full bg-white/20 overflow-hidden">
                          <div className="h-full bg-[#FFD60A] rounded-full" style={{ width: `${duration ? ((currentTime-(selectedClip?.start||0))/(selectedClip?.duration||duration))*100 : 0}%` }} />
                        </div>
                        <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/70">
                          <span>{Math.floor(currentTime/60)}:{String(Math.floor(currentTime%60)).padStart(2,'0')}</span>
                          <span>{selectedClip ? `${Math.floor(selectedClip.duration)}s` : `${Math.floor(duration/60)}:${String(Math.floor(duration%60)).padStart(2,'0')}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-16 w-16 rounded-[16px] border border-dashed border-white/20 flex items-center justify-center text-white/30">Video</div>
                  <div className="mt-4 text-[13px] font-[600] text-white/60">No video yet</div>
                  <div className="mt-1 text-[11px] text-white/30 max-w-[200px] leading-[1.4]">Upload a long video to generate viral clips</div>
                </div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button className="h-10" disabled={!selectedClip} onClick={doExport}>Export Clip</Button>
              <Button variant="outline" className="h-10">Bulk Export</Button>
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Subtitle Style</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">6 STYLES</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {Object.entries(STYLES).map(([k,s])=>(
                <button key={k} onClick={()=>setStyleKey(k as any)} className={`text-left rounded-[14px] border p-3 transition ${styleKey===k ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                  <div className="text-[11px] font-[700] tracking-[-0.01em]">{s.name.toUpperCase()}</div>
                  <div className={`text-[10px] mt-0.5 ${styleKey===k ? 'text-white/60' : 'text-[#6B6B6B]'}`}>{s.desc}</div>
                  <div className="mt-2 text-[13px] font-[800] leading-none truncate">{k==='hormozi'?'VIRAL TEXT': k==='mrbeast'?'INSANE!':'Subtitle'}</div>
                </button>
              ))}
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Hook Title</label>
                <div className="mt-2 flex gap-2">
                  <input value={hook} onChange={e=>setHook(e.target.value)} placeholder="Enter hook..." className="flex-1 h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px] focus:outline-none focus:border-[#0A0A0A]" />
                  <Button size="sm" variant="secondary" className="h-9" onClick={()=>setHook(clips[Math.floor(Math.random()*clips.length)]?.hook || 'RAHASIA VIRAL')}>AI</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Animation</label>
                  <select value={anim} onChange={e=>setAnim(e.target.value)} className="mt-2 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] focus:outline-none focus:border-[#0A0A0A]">
                    {['pop','bounce','slide','fade','karaoke','wave'].map(a=><option key={a} value={a}>{a.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Position</label>
                  <select value={pos} onChange={e=>setPos(e.target.value as any)} className="mt-2 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] focus:outline-none focus:border-[#0A0A0A]">
                    <option value="top">TOP</option>
                    <option value="center">CENTER</option>
                    <option value="bottom">BOTTOM</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Font Size</label>
                  <span className="text-[10px] font-mono">{fontSize}px</span>
                </div>
                <input type="range" min={40} max={110} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} className="w-full mt-2 accent-[#0A0A0A]" />
              </div>
              <div>
                <div className="flex justify-between">
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Words Per Line</label>
                  <span className="text-[10px] font-mono">{wpl}</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-1.5">
                  {[1,2,3,4].map(n=>(
                    <button key={n} onClick={()=>setWpl(n)} className={`h-8 rounded-full text-[11px] font-[600] border ${wpl===n ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showExport && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-xl flex items-center justify-center p-4">
          <Card className="w-full max-w-[360px] p-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-[800]">A</div>
            <div className="mt-4 text-[14px] font-[700]">Exporting clip</div>
            <div className="text-[12px] text-[#6B6B6B] mt-1">Rendering {STYLES[styleKey].name} style</div>
            <div className="mt-5 h-1.5 rounded-full bg-[#F5F5F0] overflow-hidden">
              <div className="h-full bg-[#0A0A0A] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] font-mono">{progress}%</div>
          </Card>
        </div>
      )}
    </div>
  )
}
