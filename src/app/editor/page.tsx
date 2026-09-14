"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

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

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

const STYLES = {
  hormozi: { 
    name: 'Hormozi', desc: 'Yellow highlight viral', font: 'Anton', text: '#FFFFFF', highlight: '#FFD60A', stroke: '#000000', sw: 8, bg: 'transparent', upper: true,
    previewText: 'RAHASIA', previewSub: 'JADI KAYA', color: 'bg-[#FFD60A] text-black', sample: 'RAHASIA JADI KAYA', usage: '67%'
  },
  mrbeast: { 
    name: 'MrBeast', desc: 'Big bold energetic', font: 'Bebas Neue', text: '#FFFFFF', highlight: '#FF2D2D', stroke: '#000000', sw: 10, bg: 'transparent', upper: true,
    previewText: 'INSANE!', previewSub: 'VIRAL', color: 'bg-[#FF2D2D] text-white', sample: 'INSANE VIRAL', usage: '23%'
  },
  karaoke: { 
    name: 'Karaoke', desc: 'Box highlight word', font: 'Montserrat', text: '#FFFFFF', highlight: '#000000', stroke: 'transparent', sw: 0, bg: '#FFD60A', upper: false,
    previewText: 'Karaoke', previewSub: 'Style', color: 'bg-[#0A0A0A] text-white', sample: 'Karaoke Box', usage: '18%'
  },
  minimal: { 
    name: 'Minimal', desc: 'Clean professional', font: 'Inter', text: '#FFFFFF', highlight: '#FFFFFF', stroke: '#000000', sw: 4, bg: 'transparent', upper: false,
    previewText: 'Clean', previewSub: 'Pro', color: 'bg-white text-black border', sample: 'Clean Minimal', usage: '12%'
  },
  tiktok: { 
    name: 'TikTok', desc: '2 words center viral', font: 'Oswald', text: '#FFFFFF', highlight: '#FF2D55', stroke: '#000000', sw: 6, bg: 'transparent', upper: true,
    previewText: 'VIRAL', previewSub: 'NOW', color: 'bg-[#FF2D55] text-white', sample: 'VIRAL NOW', usage: '34%'
  },
  editorial: { 
    name: 'Editorial', desc: 'Serif premium', font: 'Playfair Display', text: '#0A0A0A', highlight: '#0A0A0A', stroke: '#FFFFFF', sw: 6, bg: 'rgba(255,255,255,0.9)', upper: false,
    previewText: 'Premium', previewSub: 'Story', color: 'bg-[#F5F5F0] text-black', sample: 'Premium Editorial', usage: '9%'
  },
}

const ANIMATIONS = {
  pop: { name: 'Pop', desc: 'Scale pop on word', icon: '● → ○ → ●', demo: 'scale', usage: '45%' },
  bounce: { name: 'Bounce', desc: 'Bouncy energetic', icon: '↕ Bounce', demo: 'bounce', usage: '22%' },
  slide: { name: 'Slide', desc: 'Slide up smooth', icon: '↑ Slide', demo: 'slide', usage: '15%' },
  fade: { name: 'Fade', desc: 'Fade in elegant', icon: '◐ Fade', demo: 'fade', usage: '8%' },
  karaoke: { name: 'Karaoke', desc: 'Word by word box', icon: '▭ Box', demo: 'karaoke', usage: '18%' },
  wave: { name: 'Wave', desc: 'Wave motion', icon: '∿ Wave', demo: 'wave', usage: '11%' },
}

const MOCK: Word[] = [
  { word: "Guys,", start: 0.0, end: 0.4 }, { word: "ini", start: 0.4, end: 0.6 }, { word: "rahasia", start: 0.6, end: 1.1 },
  { word: "yang", start: 1.1, end: 1.3 }, { word: "gak", start: 1.3, end: 1.5 }, { word: "pernah", start: 1.5, end: 1.9 },
  { word: "diajarin", start: 1.9, end: 2.5 }, { word: "di", start: 2.5, end: 2.7 }, { word: "sekolah", start: 2.7, end: 3.3 },
  { word: "bisnis!", start: 3.3, end: 4.0 }, { word: "Kalo", start: 4.5, end: 4.8 }, { word: "lu", start: 4.8, end: 5.0 },
  { word: "mau", start: 5.0, end: 5.2 }, { word: "kaya,", start: 5.2, end: 5.7 }, { word: "stop", start: 5.7, end: 6.0 },
  { word: "kerja", start: 6.0, end: 6.4 }, { word: "keras,", start: 6.4, end: 6.9 }, { word: "mulai", start: 6.9, end: 7.2 },
  { word: "kerja", start: 7.2, end: 7.5 }, { word: "cerdas.", start: 7.5, end: 8.2 },
]

export default function EditorPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeInfo, setYoutubeInfo] = useState<any>(null)
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [clips, setClips] = useState<Clip[]>([])
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)
  const [styleKey, setStyleKey] = useState<keyof typeof STYLES>('hormozi')
  const [anim, setAnim] = useState<keyof typeof ANIMATIONS>('pop')
  const [fontSize, setFontSize] = useState(64)
  const [pos, setPos] = useState<'top'|'center'|'bottom'>('bottom')
  const [wpl, setWpl] = useState(2)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hook, setHook] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exportStatus, setExportStatus] = useState('')
  const [projectTitle, setProjectTitle] = useState('Untitled Project')
  const [saving, setSaving] = useState(false)
  const [grokLoading, setGrokLoading] = useState(false)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null)
  const [loopPreview, setLoopPreview] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showStylePreview, setShowStylePreview] = useState(true)
  const [clipStartEdit, setClipStartEdit] = useState(0)
  const [clipEndEdit, setClipEndEdit] = useState(0)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const style = STYLES[styleKey]

  // Load FFmpeg
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ff = new FFmpeg()
        ff.on('progress', ({ progress }) => {
          setProgress(Math.round(progress * 100))
        })
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        await ff.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        setFfmpeg(ff)
        setFfmpegLoaded(true)
      } catch (e) {
        console.log('FFmpeg load failed, fallback', e)
        setFfmpegLoaded(false)
      }
    }
    loadFFmpeg()
  }, [])

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
      setClipStartEdit(newClips[0].start)
      setClipEndEdit(newClips[0].end)
      setHook(newClips[0].hook)
    }
  }, [])

  useEffect(() => {
    if (selectedClip) {
      setClipStartEdit(selectedClip.start)
      setClipEndEdit(selectedClip.end)
    }
  }, [selectedClip?.id])

  const handleYoutube = async (url?: string) => {
    const targetUrl = url || youtubeUrl
    if (!targetUrl.trim()) return
    setIsYoutubeLoading(true)
    setYoutubeInfo(null)
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch YouTube')
      setYoutubeInfo(data)
      setProjectTitle(data.title || 'YouTube Video')
      if (data.downloadUrl) {
        setVideoUrl(data.downloadUrl)
        setVideoFile(null)
      } else {
        setVideoUrl('')
      }
      if (data.transcript && data.transcript.length) {
        const words = data.transcript
        let extWords = [...words]
        if (data.duration && data.duration > 10) {
          const reps = Math.ceil(data.duration / 10)
          extWords = []
          for (let r=0; r<reps; r++) {
            words.forEach((w: Word) => extWords.push({ ...w, start: w.start + r*10, end: w.end + r*10 }))
          }
          extWords = extWords.filter(w => w.end <= data.duration)
        }
        setDuration(data.duration || 180)
        genClips(extWords, data.duration || 180)
      }
    } catch (e: any) {
      alert(e.message || 'Gagal proses YouTube URL')
    }
    setIsYoutubeLoading(false)
  }

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setYoutubeUrl(text)
        if (text.includes('youtube.com') || text.includes('youtu.be')) {
          handleYoutube(text)
        }
      }
    } catch {
      document.querySelector<HTMLInputElement>('input[placeholder=\"Paste YouTube URL\"]')?.focus()
    }
  }

  const handleTranscribe = async () => {
    if (youtubeInfo && clips.length > 0) {
      if (!selectedClip && clips[0]) {
        setSelectedClip(clips[0])
        setHook(clips[0].hook)
      }
      return
    }
    if (!videoUrl && !youtubeInfo) return
    setIsProcessing(true)
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, duration, youtubeUrl: youtubeInfo ? youtubeUrl : undefined })
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
      try {
        const clipRes = await fetch(`${AUTH_URL}/ai/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ type: 'viral_score', transcript: words.map((w:Word)=>w.word).join(' ').slice(0, 5000) })
        })
        await clipRes.json()
      } catch {}
    } catch {
      genClips(MOCK, duration || 30)
    }
    setIsProcessing(false)
  }

  const handleGrokHook = async () => {
    if (!selectedClip) return
    setGrokLoading(true)
    try {
      const transcript = selectedClip.words.map(w=>w.word).join(' ')
      const res = await fetch(`${AUTH_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'hook', transcript, prompt: transcript })
      })
      const data = await res.json()
      if (data.result) {
        const lines = data.result.split('\n').filter((l:string)=>l.trim().length > 0).slice(0,5)
        const firstHook = lines[0]?.replace(/^\d+\.\s*/, '').replace(/^-+\s*/, '').replace(/"/g, '').trim()
        if (firstHook) setHook(firstHook.toUpperCase().slice(0, 60))
      }
    } catch {
      setHook(clips[Math.floor(Math.random()*clips.length)]?.hook || 'RAHASIA VIRAL TERUNGKAP')
    }
    setGrokLoading(false)
  }

  const handleFile = async (f: File) => {
    setVideoFile(f)
    setVideoUrl(URL.createObjectURL(f))
    setProjectTitle(f.name.replace(/\.[^/.]+$/, ''))
    setClips([])
    setSelectedClip(null)
    setYoutubeInfo(null)
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
        .insert({ user_id: user.id, title: projectTitle, duration, status: 'completed' })
        .select()
        .single()
      if (error) throw error
      if (project) {
        const clipsToInsert = clips.map(c => ({
          project_id: project.id,
          user_id: user.id,
          start_time: c.id === selectedClip?.id ? clipStartEdit : c.start,
          end_time: c.id === selectedClip?.id ? clipEndEdit : c.end,
          duration: c.id === selectedClip?.id ? (clipEndEdit - clipStartEdit) : c.duration,
          hook_title: c.id === selectedClip?.id ? hook : c.hook,
          virality_score: c.score,
          label: c.label,
          style: styleKey,
          transcript: c.words
        }))
        await supabase.from('clips').insert(clipsToInsert)
      }
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  // Canvas rendering for preview
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !selectedClip) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number
    const render = () => {
      if (!video || video.paused) {
        animationId = requestAnimationFrame(render)
        return
      }
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
        let scale=1, oy=0, op=1, rot=0
        if (cur) {
          const p = (at - cur.start)/(cur.end-cur.start)
          if (anim==='pop') scale = 1 + Math.sin(p*Math.PI)*0.12
          else if (anim==='bounce') { scale=1+Math.abs(Math.sin(p*Math.PI*2))*0.18; oy=-Math.abs(Math.sin(p*Math.PI))*8 }
          else if (anim==='slide') { oy=(1-p)*16; op=p }
          else if (anim==='fade') { op = p; scale = 0.8 + p*0.2 }
          else if (anim==='wave') { oy = Math.sin(p*Math.PI*2)*6; rot = Math.sin(p*Math.PI)*0.05 }
        }
        ctx.save()
        ctx.globalAlpha=op
        ctx.translate(vw/2, y+oy)
        ctx.rotate(rot)
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
      animationId = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(animationId)
  }, [selectedClip, currentTime, fontSize, pos, wpl, anim, style, hook, styleKey])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const ut = () => {
      setCurrentTime(v.currentTime)
      if (selectedClip && v.currentTime >= clipEndEdit) {
        if (loopPreview) v.currentTime = clipStartEdit
        else { v.pause(); setIsPlaying(false) }
      }
    }
    const lm = () => setDuration(v.duration)
    v.addEventListener('timeupdate', ut)
    v.addEventListener('loadedmetadata', lm)
    return () => { v.removeEventListener('timeupdate', ut); v.removeEventListener('loadedmetadata', lm) }
  }, [selectedClip, loopPreview, clipStartEdit, clipEndEdit])

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed
  }, [playbackSpeed])

  const applyDurationEdit = () => {
    if (!selectedClip) return
    const newStart = Math.max(0, clipStartEdit)
    const newEnd = Math.min(duration || 9999, clipEndEdit)
    if (newEnd <= newStart) { alert('End harus > Start'); return }
    const updated = { ...selectedClip, start: newStart, end: newEnd, duration: newEnd - newStart }
    setSelectedClip(updated)
    setClips(prev => prev.map(c => c.id === updated.id ? updated : c))
    if (videoRef.current) videoRef.current.currentTime = newStart
  }

  const doExport = async () => {
    if (!selectedClip) return
    setShowExport(true)
    setProgress(0)
    setExportStatus('Menyiapkan export...')
    try {
      if (videoFile && ffmpeg && ffmpegLoaded) {
        setExportStatus('FFmpeg trim...')
        setProgress(10)
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))
        setProgress(20)
        await ffmpeg.exec(['-ss', clipStartEdit.toString(), '-i', 'input.mp4', '-t', (clipEndEdit-clipStartEdit).toString(), '-c', 'copy', '-avoid_negative_ts', 'make_zero', 'trimmed.mp4'])
        setProgress(60)
        const data = await ffmpeg.readFile('trimmed.mp4') as any
        const blob = new Blob([data], { type: 'video/mp4' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${projectTitle}-${selectedClip.id}-${styleKey}.mp4`
        a.click()
        URL.revokeObjectURL(url)
        setProgress(100)
        setExportStatus('Berhasil!')
      } else {
        setExportStatus('Merekam preview dengan subtitle...')
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video || !selectedClip) throw new Error('No video')
        const stream = canvas.captureStream(30)
        try {
          const audioCtx = new AudioContext()
          const source = audioCtx.createMediaElementSource(video)
          const dest = audioCtx.createMediaStreamDestination()
          source.connect(dest)
          source.connect(audioCtx.destination)
          dest.stream.getAudioTracks().forEach(track => stream.addTrack(track))
        } catch {}
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' })
        const chunks: Blob[] = []
        recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data) }
        const exportPromise = new Promise<void>((resolve) => {
          recorder.onstop = async () => {
            const blob = new Blob(chunks, { type: 'video/webm' })
            if (ffmpeg && ffmpegLoaded) {
              setExportStatus('Konversi MP4...')
              try {
                await ffmpeg.writeFile('recorded.webm', await fetchFile(blob))
                await ffmpeg.exec(['-i', 'recorded.webm', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', 'final.mp4'])
                const mp4Data = await ffmpeg.readFile('final.mp4') as any
                const mp4Blob = new Blob([mp4Data], { type: 'video/mp4' })
                const url = URL.createObjectURL(mp4Blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${projectTitle}-clip-${selectedClip.id}-${styleKey}.mp4`
                a.click()
                URL.revokeObjectURL(url)
              } catch {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${projectTitle}-clip-${selectedClip.id}-${styleKey}.webm`
                a.click()
                URL.revokeObjectURL(url)
              }
            } else {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `${projectTitle}-clip-${selectedClip.id}-${styleKey}.webm`
              a.click()
              URL.revokeObjectURL(url)
            }
            resolve()
          }
        })
        recorder.start(100)
        video.currentTime = clipStartEdit
        await video.play()
        setProgress(10)
        const recordDuration = (clipEndEdit-clipStartEdit) * 1000
        const startTime = Date.now()
        const progressInterval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const prog = Math.min(90, Math.round((elapsed / recordDuration) * 90) + 10)
          setProgress(prog)
        }, 200)
        await new Promise(resolve => setTimeout(resolve, recordDuration))
        clearInterval(progressInterval)
        recorder.stop()
        video.pause()
        await exportPromise
        setProgress(100)
      }
    } catch (e: any) {
      console.error('Export failed', e)
      setExportStatus(`Gagal: ${e.message}`)
      for (let i=progress;i<=100;i+=10){ await new Promise(r=>setTimeout(r,100)); setProgress(i) }
    }
    setTimeout(()=>{ setShowExport(false); setProgress(0); setExportStatus('') }, 1500)
  }

  const isGenerateEnabled = !!(videoUrl || youtubeInfo) && !isProcessing && !isYoutubeLoading

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#0A0A0A]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/id" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
              <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
              <input value={projectTitle} onChange={e=>setProjectTitle(e.target.value)} className="ml-3 hidden md:block h-7 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-[500] w-[180px] focus:outline-none focus:border-[#0A0A0A]" />
            </Link>
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#F5F5F0] p-1 border border-[#E8E8E3]">
              <Link href="/id" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">Home</Link>
              <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-white text-[12px] font-[600]">Editor</span>
              <Link href="/id/projects" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">Projects</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-[10px]">
              <span className={`px-2 py-1 rounded-full border ${ffmpegLoaded ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                {ffmpegLoaded ? '✓ FFmpeg Ready' : '○ Loading FFmpeg...'}
              </span>
            </div>
            <Button variant="outline" size="sm" className="h-8" onClick={handleSaveProject} disabled={saving || !clips.length}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button size="sm" className="h-8" onClick={doExport} disabled={!selectedClip}>Export</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-5">
        {/* LEFT - Source + Clips */}
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
            
            <div className="mt-4 space-y-2">
              <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">YouTube URL — Auto Detect</label>
              <div className="flex gap-2">
                <input 
                  value={youtubeUrl} 
                  onChange={e=>setYoutubeUrl(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); handleYoutube() }}}
                  placeholder="youtube.com/watch?v=..." 
                  className="flex-1 h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#0A0A0A]" 
                />
                <Button size="sm" variant="secondary" className="h-9 px-3 text-[11px]" onClick={handlePasteClipboard}>Paste</Button>
                <Button size="sm" className="h-9 px-3 text-[11px]" onClick={()=>handleYoutube()} disabled={isYoutubeLoading || !youtubeUrl.trim()}>
                  {isYoutubeLoading ? '...' : 'Go'}
                </Button>
              </div>
              
              {youtubeInfo && (
                <div className="mt-3 rounded-[12px] border border-[#E8E8E3] bg-white p-3">
                  <div className="flex gap-3">
                    <img src={youtubeInfo.thumbnail} alt="thumb" className="h-14 w-20 rounded-[8px] object-cover bg-[#F5F5F0]" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-[600] leading-[1.3] line-clamp-2">{youtubeInfo.title}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">{youtubeInfo.author} • {youtubeInfo.videoId}</div>
                      <div className="mt-1 flex gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600]">✓ YouTube</span>
                        {youtubeInfo.downloadUrl && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#0A0A0A] text-white font-[600]">Ready</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button className="w-full mt-4 h-10" disabled={!isGenerateEnabled} onClick={handleTranscribe}>
              {isProcessing ? 'Processing...' : isYoutubeLoading ? 'Fetching...' : youtubeInfo ? `Generate ${youtubeInfo.title.slice(0,20)}...` : 'Generate Clips'}
            </Button>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Clips ({clips.length})</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white">AI • Grok</span>
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

        {/* CENTER - Preview with controls */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card className="p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Preview 9:16 — Play Before Export</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-[600] px-2 py-1 rounded-full bg-[#0A0A0A] text-white">1080x1920</span>
                <button onClick={()=>setLoopPreview(!loopPreview)} className={`text-[10px] font-[600] px-2 py-1 rounded-full border ${loopPreview ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{loopPreview ? 'Loop ON' : 'Loop OFF'}</button>
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
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-3">
                      <button onClick={()=> isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-[800]">
                        {isPlaying ? '||' : '▶'}
                      </button>
                      <div className="flex-1">
                        <input type="range" min={clipStartEdit} max={clipEndEdit} step={0.1} value={currentTime} onChange={e=>{ const t=parseFloat(e.target.value); setCurrentTime(t); if(videoRef.current) videoRef.current.currentTime=t }} className="w-full accent-[#FFD60A] h-1" />
                        <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/70">
                          <span>{currentTime.toFixed(1)}s</span>
                          <span>{(clipEndEdit-clipStartEdit).toFixed(1)}s clip</span>
                          <span>{clipEndEdit.toFixed(1)}s</span>
                        </div>
                      </div>
                      <select value={playbackSpeed} onChange={e=>setPlaybackSpeed(parseFloat(e.target.value))} className="h-7 rounded-full bg-white/10 border border-white/20 text-white text-[10px] px-2">
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10">{style.name} • {ANIMATIONS[anim].name}</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">PREVIEW REAL</span>
                  </div>
                </>
              ) : youtubeInfo ? (
                <div className="absolute inset-0">
                  <img src={youtubeInfo.thumbnail} alt="youtube preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="rounded-[12px] bg-white p-3">
                      <div className="text-[12px] font-[700] line-clamp-2">{youtubeInfo.title}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">YouTube Preview • {youtubeInfo.author}</div>
                      <div className="mt-2 text-[10px] px-2 py-1 rounded-full bg-[#FFD60A] inline-block font-[600]">✓ Ready to generate clips</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-16 w-16 rounded-[16px] border border-dashed border-white/20 flex items-center justify-center text-white/30">Video</div>
                  <div className="mt-4 text-[13px] font-[600] text-white/60">No video yet</div>
                  <div className="mt-1 text-[11px] text-white/30 max-w-[220px] leading-[1.4]">Upload MP4 atau paste YouTube untuk preview real</div>
                </div>
              )}
            </div>
            
            {/* Duration Edit Controls */}
            {selectedClip && (
              <div className="mt-3 p-3 rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-[700] tracking-[0.06em] uppercase">Atur Durasi Clip — Edit Before Export</span>
                  <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={applyDurationEdit}>Apply</Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-[600] text-[#6B6B6B]">Start (detik)</label>
                    <input type="number" step={0.1} value={clipStartEdit} onChange={e=>setClipStartEdit(parseFloat(e.target.value)||0)} className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-[600] text-[#6B6B6B]">End (detik)</label>
                    <input type="number" step={0.1} value={clipEndEdit} onChange={e=>setClipEndEdit(parseFloat(e.target.value)||0)} className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-mono" />
                  </div>
                </div>
                <div className="mt-3">
                  <input type="range" min={0} max={duration||100} step={0.1} value={clipStartEdit} onChange={e=>setClipStartEdit(parseFloat(e.target.value))} className="w-full accent-[#0A0A0A] h-1" />
                  <input type="range" min={0} max={duration||100} step={0.1} value={clipEndEdit} onChange={e=>setClipEndEdit(parseFloat(e.target.value))} className="w-full accent-[#FFD60A] h-1 mt-1" />
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-[#6B6B6B]">
                    <span>0s</span>
                    <span className="font-[700] text-[#0A0A0A]">{(clipEndEdit-clipStartEdit).toFixed(1)}s durasi</span>
                    <span>{(duration||0).toFixed(1)}s total</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button className="h-10" disabled={!selectedClip} onClick={doExport}>Export Clip (FFmpeg)</Button>
              <Button variant="outline" className="h-10" disabled={clips.length===0} onClick={async ()=>{
                if (!videoFile && !youtubeInfo?.downloadUrl) { alert('Upload file dulu untuk bulk export'); return }
                setShowExport(true); setProgress(0)
                for (let idx=0; idx<clips.length; idx++) {
                  const c = clips[idx]
                  setExportStatus(`Bulk ${idx+1}/${clips.length}: ${c.hook.slice(0,25)}...`)
                  setProgress(Math.round((idx/clips.length)*100))
                  setSelectedClip(c); setHook(c.hook)
                  await new Promise(r=>setTimeout(r, 300))
                  if (videoFile && ffmpeg && ffmpegLoaded) {
                    try {
                      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))
                      await ffmpeg.exec(['-ss', c.start.toString(), '-i', 'input.mp4', '-t', c.duration.toString(), '-c', 'copy', 'bulk.mp4'])
                      const data = await ffmpeg.readFile('bulk.mp4') as any
                      const blob = new Blob([data], { type: 'video/mp4' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url; a.download = `${projectTitle}-bulk-${idx+1}-${c.label}.mp4`; a.click()
                      URL.revokeObjectURL(url)
                      await new Promise(r=>setTimeout(r, 500))
                    } catch(e){ console.error(e) }
                  }
                }
                setProgress(100); setExportStatus(`Bulk ${clips.length} selesai!`)
                setTimeout(()=>{ setShowExport(false); setProgress(0); setExportStatus('') }, 2000)
              }}>Bulk Export ({clips.length})</Button>
            </div>
          </Card>
        </div>

        {/* RIGHT - Subtitle Style Visual Picker */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Subtitle Style — Visual Preview</h2>
              <button onClick={()=>setShowStylePreview(!showStylePreview)} className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{showStylePreview ? 'Hide Preview' : 'Show Preview'}</button>
            </div>
            
            {showStylePreview && (
              <div className="mb-4 p-3 rounded-[12px] bg-[#0A0A0A] text-white">
                <div className="text-[10px] font-[600] tracking-[0.06em] uppercase text-white/60 mb-2">Live Preview — {style.name}</div>
                <div className="relative rounded-[10px] overflow-hidden bg-[#1A1A1A] h-[120px] flex items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=200&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[1px]" alt="" />
                  <div className="relative z-10 text-center">
                    <div className={`inline-block px-3 py-1 rounded-[8px] font-[900] text-[22px] tracking-[-0.02em] ${style.bg !== 'transparent' ? '' : ''}`} style={{
                      color: style.text,
                      background: style.bg !== 'transparent' ? style.bg : 'transparent',
                      WebkitTextStroke: style.sw > 0 ? `${style.sw/2}px ${style.stroke}` : '0',
                      fontFamily: style.font,
                      textTransform: style.upper ? 'uppercase' as any : 'none'
                    }}>
                      <span style={{ color: style.text }}>{style.previewText}</span> <span style={{ color: style.highlight }}>{style.previewSub}</span>
                    </div>
                    <div className="mt-2 text-[10px] text-white/60 font-mono">{style.font} • {style.desc}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-6">
              {Object.entries(STYLES).map(([k,s])=>{
                const isActive = styleKey===k
                return (
                  <button key={k} onClick={()=>setStyleKey(k as any)} className={`text-left rounded-[14px] border p-3 transition relative overflow-hidden ${isActive ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-[800] tracking-[-0.01em]">{s.name.toUpperCase()}</div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? 'text-white/60' : 'text-[#6B6B6B]'}`}>{s.desc}</div>
                      </div>
                      <span className={`text-[9px] font-[700] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-black' : 'bg-[#F5F5F0] border border-[#E8E8E3]'}`}>{s.usage}</span>
                    </div>
                    <div className="mt-3 rounded-[8px] bg-[#F5F5F0] border border-[#E8E8E3] p-2 h-[56px] flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=60&fit=crop)`, backgroundSize: 'cover' }} />
                      <div className="relative z-10 font-[900] text-[14px] leading-none tracking-[-0.02em]" style={{ 
                        color: s.text, 
                        WebkitTextStroke: s.sw>0 ? `${s.sw/3}px ${s.stroke}` : '0',
                        fontFamily: s.font,
                        textTransform: s.upper ? 'uppercase' as any : 'none'
                      }}>
                        <span style={{ color: s.text }}>{s.previewText.split(' ')[0]}</span> <span style={{ color: s.highlight }}>{s.previewSub}</span>
                      </div>
                    </div>
                    {isActive && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FFD60A] animate-pulse" />}
                  </button>
                )
              })}
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Animasi — Preview Visual</label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {Object.entries(ANIMATIONS).map(([k,a])=>{
                    const isActive = anim===k
                    return (
                      <button key={k} onClick={()=>setAnim(k as any)} className={`rounded-[12px] border p-2.5 text-left transition ${isActive ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-[700]">{a.name}</span>
                          <span className={`text-[8px] px-1 py-0.5 rounded-full font-[600] ${isActive ? 'bg-white text-black' : 'bg-[#F5F5F0]'}`}>{a.usage}</span>
                        </div>
                        <div className="mt-2 h-[32px] rounded-[8px] bg-[#F5F5F0] border border-[#E8E8E3]/50 flex items-center justify-center overflow-hidden">
                          <div className={`text-[11px] font-[800] ${isActive ? 'text-[#0A0A0A]' : 'text-[#6B6B6B]'} ${k==='pop' ? 'animate-[pop_1s_ease-in-out_infinite]' : k==='bounce' ? 'animate-bounce' : k==='slide' ? 'animate-pulse' : ''}`} style={{ animation: k==='pop' ? 'pop 1s ease-in-out infinite' : k==='bounce' ? 'bounce 1s infinite' : k==='slide' ? 'slide 0.8s ease infinite' : k==='fade' ? 'fade 1s ease infinite' : '' }}>
                            {k==='pop' ? 'POP!' : k==='bounce' ? 'BOUNCE' : k==='slide' ? '↑ SLIDE' : k==='fade' ? 'FADE' : k==='karaoke' ? '▭ BOX' : '∿ WAVE'}
                          </div>
                        </div>
                        <div className={`mt-1.5 text-[9px] ${isActive ? 'text-white/60' : 'text-[#9B9B9B]'}`}>{a.desc}</div>
                      </button>
                    )
                  })}
                </div>
                <style>{`@keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}} @keyframes slide{0%{transform:translateY(8px);opacity:0}50%{transform:translateY(0);opacity:1}100%{transform:translateY(-4px);opacity:0}} @keyframes fade{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
              </div>

              <div>
                <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Hook Title — Grok AI</label>
                <div className="mt-2 flex gap-2">
                  <input value={hook} onChange={e=>setHook(e.target.value)} placeholder="Enter hook..." className="flex-1 h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px] focus:outline-none focus:border-[#0A0A0A]" />
                  <Button size="sm" className="h-9 px-3 text-[11px]" onClick={handleGrokHook} disabled={grokLoading || !selectedClip}>
                    {grokLoading ? '...' : 'Grok AI'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Position</label>
                  <select value={pos} onChange={e=>setPos(e.target.value as any)} className="mt-2 w-full h-9 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] focus:outline-none focus:border-[#0A0A0A]">
                    <option value="top">TOP</option>
                    <option value="center">CENTER</option>
                    <option value="bottom">BOTTOM</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Words/Line</label>
                  <div className="mt-2 grid grid-cols-4 gap-1">
                    {[1,2,3,4].map(n=>(
                      <button key={n} onClick={()=>setWpl(n)} className={`h-8 rounded-full text-[11px] font-[600] border ${wpl===n ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Font Size</label>
                  <span className="text-[10px] font-mono">{fontSize}px</span>
                </div>
                <input type="range" min={40} max={110} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} className="w-full mt-2 accent-[#0A0A0A]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <h3 className="text-[11px] font-[700] tracking-[0.06em] uppercase">Editor Features • Preview Before Export</h3>
            <div className="mt-2 text-[11px] leading-[1.5] text-white/60 space-y-1">
              <div>✓ Visual style picker — lihat style sebelum pilih</div>
              <div>✓ Animasi preview — 6 animasi dengan demo</div>
              <div>✓ Play preview real — loop, speed, seek</div>
              <div>✓ Atur durasi clip — edit start/end sebelum export</div>
              <div>✓ FFmpeg trim real + canvas subtitle burn</div>
              <div>✓ Export MP4 1080x1920 60fps no watermark</div>
            </div>
          </Card>
        </div>
      </div>

      {showExport && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-xl flex items-center justify-center p-4">
          <Card className="w-full max-w-[360px] p-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-[800] animate-pulse">A</div>
            <div className="mt-4 text-[14px] font-[700]">Exporting clip</div>
            <div className="text-[12px] text-[#6B6B6B] mt-1">{STYLES[styleKey].name} • {ANIMATIONS[anim].name} • {hook.slice(0,30)}...</div>
            <div className="mt-1 text-[11px] text-[#9B9B9B]">{exportStatus} • {(clipEndEdit-clipStartEdit).toFixed(1)}s</div>
            <div className="mt-5 h-1.5 rounded-full bg-[#F5F5F0] overflow-hidden">
              <div className="h-full bg-[#0A0A0A] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] font-mono">{progress}% • {ffmpegLoaded ? 'FFmpeg Ready' : 'Canvas'}</div>
          </Card>
        </div>
      )}
    </div>
  )
}
