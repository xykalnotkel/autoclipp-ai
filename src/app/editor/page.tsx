"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

type Word = { word: string; start: number; end: number }
type Clip = { id: number; start: number; end: number; duration: number; hook: string; score: number; label: string; words: Word[] }

// Icons - no emoji, use SVG
const IconUpload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
)
const IconPlay = ({ size=16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
)
const IconPause = ({ size=16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
)
const IconSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
)
const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
)
const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
)
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
)
const IconPalette = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
)
const IconSpark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>
)
const IconFilm = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
)

const STYLES: any = {
  hormozi: { name: 'Hormozi', desc: 'Yellow highlight viral', font: 'Anton', text: '#FFFFFF', highlight: '#FFD60A', stroke: '#000000', sw: 8, bg: 'transparent', upper: true, previewText: 'RAHASIA', previewSub: 'KAYA', usage: '67%', bgPreview: '#0A0A0A' },
  mrbeast: { name: 'MrBeast', desc: 'Big bold energetic', font: 'Bebas Neue', text: '#FFFFFF', highlight: '#FF3B30', stroke: '#000000', sw: 10, bg: 'transparent', upper: true, previewText: 'INSANE', previewSub: 'VIRAL', usage: '23%', bgPreview: '#1A1A1A' },
  karaoke: { name: 'Karaoke', desc: 'Box highlight word', font: 'Montserrat', text: '#0A0A0A', highlight: '#FFFFFF', stroke: 'transparent', sw: 0, bg: '#FFD60A', upper: false, previewText: 'Karaoke', previewSub: 'Box', usage: '18%', bgPreview: '#FFD60A' },
  minimal: { name: 'Minimal', desc: 'Clean professional', font: 'Inter', text: '#0A0A0A', highlight: '#0A0A0A', stroke: '#FFFFFF', sw: 0, bg: 'rgba(255,255,255,0.9)', upper: false, previewText: 'Clean', previewSub: 'Pro', usage: '12%', bgPreview: '#F5F5F0' },
  tiktok: { name: 'TikTok', desc: '2 words center viral', font: 'Oswald', text: '#FFFFFF', highlight: '#FF2D55', stroke: '#000000', sw: 6, bg: 'transparent', upper: true, previewText: 'VIRAL', previewSub: 'NOW', usage: '34%', bgPreview: '#000000' },
  editorial: { name: 'Editorial', desc: 'Serif premium', font: 'Georgia', text: '#0A0A0A', highlight: '#0A0A0A', stroke: '#FFFFFF', sw: 4, bg: 'rgba(255,255,255,0.95)', upper: false, previewText: 'Premium', previewSub: 'Story', usage: '9%', bgPreview: '#FFFFFF' },
  netflix: { name: 'Netflix', desc: 'Red cinematic', font: 'Bebas Neue', text: '#FFFFFF', highlight: '#E50914', stroke: '#000000', sw: 6, bg: 'transparent', upper: true, previewText: 'CINEMA', previewSub: 'RED', usage: '15%', bgPreview: '#000000' },
  youtube: { name: 'YouTube', desc: 'White bold clean', font: 'Inter', text: '#FFFFFF', highlight: '#FF0000', stroke: '#000000', sw: 5, bg: 'transparent', upper: false, previewText: 'YouTube', previewSub: 'Style', usage: '28%', bgPreview: '#212121' },
  bold: { name: 'Bold', desc: 'Extra bold white', font: 'Anton', text: '#FFFFFF', highlight: '#FFFFFF', stroke: '#000000', sw: 9, bg: 'transparent', upper: true, previewText: 'BOLD', previewSub: 'TEXT', usage: '19%', bgPreview: '#0A0A0A' },
  glow: { name: 'Glow', desc: 'Neon glow effect', font: 'Montserrat', text: '#FFFFFF', highlight: '#00FF88', stroke: '#000000', sw: 4, bg: 'transparent', upper: true, previewText: 'GLOW', previewSub: 'NEON', usage: '11%', bgPreview: '#0A0A0A' },
  outline: { name: 'Outline', desc: 'Outline only', font: 'Bebas Neue', text: 'transparent', highlight: '#FFFFFF', stroke: '#FFFFFF', sw: 3, bg: 'transparent', upper: true, previewText: 'OUTLINE', previewSub: 'ONLY', usage: '8%', bgPreview: '#000000' },
  shadow: { name: 'Shadow', desc: 'Soft shadow', font: 'Inter', text: '#FFFFFF', highlight: '#FFD60A', stroke: '#000000', sw: 0, bg: 'transparent', upper: false, previewText: 'Shadow', previewSub: 'Soft', usage: '13%', bgPreview: '#2A2A2A' },
}

const ANIMATIONS: any = {
  pop: { name: 'Pop', desc: 'Scale pop', usage: '45%' },
  bounce: { name: 'Bounce', desc: 'Bouncy', usage: '22%' },
  slide: { name: 'Slide', desc: 'Slide up', usage: '15%' },
  fade: { name: 'Fade', desc: 'Fade in', usage: '8%' },
  karaoke: { name: 'Karaoke', desc: 'Box word', usage: '18%' },
  wave: { name: 'Wave', desc: 'Wave motion', usage: '11%' },
  typewriter: { name: 'Typewriter', desc: 'Ketik per huruf', usage: '14%' },
  glitch: { name: 'Glitch', desc: 'Glitch effect', usage: '7%' },
  zoom: { name: 'Zoom', desc: 'Zoom in', usage: '12%' },
  rotate: { name: 'Rotate', desc: 'Rotate 3D', usage: '6%' },
}

const FONTS = ['Anton', 'Bebas Neue', 'Montserrat', 'Inter', 'Oswald', 'Georgia', 'Poppins', 'Space Grotesk']

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
  const [styleKey, setStyleKey] = useState<string>('hormozi')
  const [anim, setAnim] = useState<string>('pop')
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
  const [aiLoading, setAiLoading] = useState(false)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)
  const [ffmpeg, setFfmpeg] = useState<FFmpeg | null>(null)
  const [loopPreview, setLoopPreview] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [clipStartEdit, setClipStartEdit] = useState(0)
  const [clipEndEdit, setClipEndEdit] = useState(0)
  const [customTextColor, setCustomTextColor] = useState('')
  const [customHighlightColor, setCustomHighlightColor] = useState('')
  const [customStrokeColor, setCustomStrokeColor] = useState('')
  const [customBgColor, setCustomBgColor] = useState('')
  const [customFont, setCustomFont] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const baseStyle = STYLES[styleKey] || STYLES.hormozi
  const style = {
    ...baseStyle,
    text: customTextColor || baseStyle.text,
    highlight: customHighlightColor || baseStyle.highlight,
    stroke: customStrokeColor || baseStyle.stroke,
    bg: customBgColor || baseStyle.bg,
    font: customFont || baseStyle.font,
  }

  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const ff = new FFmpeg()
        ff.on('progress', ({ progress }) => setProgress(Math.round(progress * 100)))
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'
        await ff.load({
          coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        })
        setFfmpeg(ff)
        setFfmpegLoaded(true)
      } catch (e) {
        console.log('Fallback mode', e)
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
      if (!res.ok) throw new Error(data.error || 'Gagal ambil YouTube')
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
      alert(e.message || 'Gagal proses YouTube')
    }
    setIsYoutubeLoading(false)
  }

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setYoutubeUrl(text)
        if (text.includes('youtube.com') || text.includes('youtu.be')) handleYoutube(text)
      }
    } catch {}
  }

  const handleTranscribe = async () => {
    if (youtubeInfo && clips.length > 0) {
      if (!selectedClip && clips[0]) { setSelectedClip(clips[0]); setHook(clips[0].hook) }
      return
    }
    if (!videoUrl && !youtubeInfo) { alert('Upload video atau tempel link YouTube dulu di Langkah 1'); return }
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
    } catch {
      genClips(MOCK, duration || 30)
    }
    setIsProcessing(false)
  }

  const handleAiHook = async () => {
    if (!selectedClip) { alert('Pilih clip dulu di Langkah 2'); return }
    setAiLoading(true)
    try {
      const transcript = selectedClip.words.map(w=>w.word).join(' ')
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'
      const res = await fetch(`${authUrl}/ai/generate`, {
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
    setAiLoading(false)
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
    if (!clips.length) { alert('Generate clips dulu di Langkah 2 — klik tombol Buat Clip Viral'); return }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { alert('Login dulu untuk simpan project'); setSaving(false); return }
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
        const { error: clipError } = await supabase.from('clips').insert(clipsToInsert)
        if (clipError) throw clipError
        alert('Project berhasil disimpan ke daftar project')
      }
    } catch (e: any) {
      console.error(e)
      alert('Gagal simpan: ' + e.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video || !selectedClip) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number
    const render = () => {
      if (!video || video.paused) { animationId = requestAnimationFrame(render); return }
      const vw = canvas.width, vh = canvas.height
      ctx.clearRect(0,0,vw,vh)
      try {
        ctx.filter = 'blur(24px) brightness(0.55)'
        ctx.drawImage(video, 0,0,vw,vh)
        ctx.filter = 'none'
      } catch { ctx.drawImage(video, 0,0,vw,vh) }
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
        ctx.font = `900 ${fontSize}px "${style.font}", sans-serif`
        const mw = ctx.measureText(text).width
        const tht = fontSize*1.15
        let scale=1, oy=0, op=1, rot=0, skew=0
        if (cur) {
          const p = (at - cur.start)/(cur.end-cur.start)
          if (anim==='pop') scale = 1 + Math.sin(p*Math.PI)*0.18
          else if (anim==='bounce') { scale=1+Math.abs(Math.sin(p*Math.PI*2))*0.22; oy=-Math.abs(Math.sin(p*Math.PI))*12 }
          else if (anim==='slide') { oy=(1-p)*20; op=p }
          else if (anim==='fade') { op = p; scale = 0.85 + p*0.15 }
          else if (anim==='wave') { oy = Math.sin(p*Math.PI*2)*8; rot = Math.sin(p*Math.PI)*0.08 }
          else if (anim==='glitch') { if (Math.random()>0.85) { oy = (Math.random()-0.5)*10; skew = (Math.random()-0.5)*0.2 } }
          else if (anim==='zoom') { scale = 0.8 + p*0.4 }
          else if (anim==='rotate') { rot = p*0.3; scale = 0.9 + Math.sin(p*Math.PI)*0.1 }
        }
        ctx.save()
        ctx.globalAlpha=op
        ctx.translate(vw/2, y+oy)
        ctx.rotate(rot)
        // @ts-ignore
        if (skew) ctx.transform(1, skew, 0, 1, 0, 0)
        ctx.scale(scale,scale)
        if (style.bg !== 'transparent') {
          ctx.fillStyle = style.bg
          ctx.beginPath()
          // @ts-ignore
          if (ctx.roundRect) ctx.roundRect(-mw/2-20, -tht/2-10, mw+40, tht+20, 12); else ctx.rect(-mw/2-20, -tht/2-10, mw+40, tht+20)
          ctx.fill()
        }
        if (styleKey==='glow') { ctx.shadowColor = style.highlight; ctx.shadowBlur = 20 }
        if (style.sw>0 && style.stroke !== 'transparent') {
          ctx.strokeStyle = style.stroke
          ctx.lineWidth = style.sw
          ctx.lineJoin='round'
          ctx.strokeText(text,0,0)
        }
        ctx.shadowBlur = 0
        if (toShow.length>1 && cur) {
          let xo = -mw/2
          toShow.forEach(w=>{
            const isCur = cur && w.word===cur.word
            const wt = style.upper ? w.word.toUpperCase() : w.word
            const ww = ctx.measureText(wt+' ').width
            ctx.fillStyle = isCur ? style.highlight : style.text
            if (style.text === 'transparent') {
              ctx.strokeStyle = style.highlight
              ctx.lineWidth = 2
              ctx.strokeText(wt+' ', xo+ww/2, 0)
            } else {
              ctx.fillText(wt+' ', xo+ww/2, 0)
            }
            xo+=ww
          })
        } else {
          if (style.text === 'transparent') {
            ctx.strokeStyle = style.highlight
            ctx.lineWidth = 3
            ctx.strokeText(text,0,0)
          } else {
            ctx.fillStyle = style.text
            ctx.fillText(text,0,0)
          }
        }
        ctx.restore()
        if (hook) {
          ctx.save()
          ctx.font=`800 22px Inter, sans-serif`
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

  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = playbackSpeed }, [playbackSpeed])

  const applyDurationEdit = () => {
    if (!selectedClip) return
    const newStart = Math.max(0, clipStartEdit)
    const newEnd = Math.min(duration || 9999, clipEndEdit)
    if (newEnd <= newStart) { alert('Waktu selesai harus lebih besar dari mulai'); return }
    const updated = { ...selectedClip, start: newStart, end: newEnd, duration: newEnd - newStart }
    setSelectedClip(updated)
    setClips(prev => prev.map(c => c.id === updated.id ? updated : c))
    if (videoRef.current) videoRef.current.currentTime = newStart
  }

  const handleTestPlay = () => {
    if (!selectedClip || !videoRef.current) { alert('Generate clips dulu di Langkah 2 — klik tombol Buat Clip Viral'); return }
    videoRef.current.currentTime = clipStartEdit
    videoRef.current.play()
    setIsPlaying(true)
  }

  const doExport = async () => {
    if (!selectedClip) { alert('Pilih clip dulu di Langkah 3'); return }
    setShowExport(true)
    setProgress(0)
    setExportStatus('Menyiapkan...')
    try {
      if (videoFile && ffmpeg && ffmpegLoaded) {
        setExportStatus('Memotong video...')
        setProgress(10)
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))
        setProgress(20)
        await ffmpeg.exec(['-ss', clipStartEdit.toString(), '-i', 'input.mp4', '-t', (clipEndEdit-clipStartEdit).toString(), '-c', 'copy', '-avoid_negative_ts', 'make_zero', 'trimmed.mp4'])
        setProgress(70)
        const data = await ffmpeg.readFile('trimmed.mp4') as any
        const blob = new Blob([data], { type: 'video/mp4' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${projectTitle}-${selectedClip.id}-${styleKey}.mp4`
        a.click()
        URL.revokeObjectURL(url)
        setProgress(100)
        setExportStatus('Berhasil diunduh')
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
              setExportStatus('Konversi ke MP4...')
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
        setExportStatus('Berhasil')
      }
    } catch (e: any) {
      console.error('Export failed', e)
      setExportStatus(`Gagal: ${e.message}`)
      for (let i=progress;i<=100;i+=10){ await new Promise(r=>setTimeout(r,100)); setProgress(i) }
    }
    setTimeout(()=>{ setShowExport(false); setProgress(0); setExportStatus('') }, 2000)
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
                {ffmpegLoaded ? 'Ready' : 'Loading...'}
              </span>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={handleSaveProject} disabled={saving || !clips.length}><IconSave />{saving ? 'Menyimpan...' : 'Simpan'}</Button>
            <Button size="sm" className="h-8 bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] gap-1.5" onClick={doExport} disabled={!selectedClip}><IconDownload />Export</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-5">
        {/* LEFT - Source */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Langkah 1 - Source Video</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">WAJIB</span>
            </div>
            <div
              onDrop={e=>{ e.preventDefault(); const f=e.dataTransfer.files[0]; if(f&&f.type.startsWith('video/')) handleFile(f)}}
              onDragOver={e=>e.preventDefault()}
              onClick={()=>fileRef.current?.click()}
              className="rounded-[16px] border border-dashed border-[#E8E8E3] bg-[#FCFCF9] p-6 text-center hover:border-[#0A0A0A] hover:bg-white cursor-pointer transition"
            >
              <div className="mx-auto h-10 w-10 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center"><IconUpload /></div>
              <div className="mt-3 text-[13px] font-[600] tracking-[-0.01em]">Drop video di sini atau klik</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">MP4, MOV hingga 2GB</div>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFile(f)}} />
            </div>
            
            <div className="mt-4 space-y-2">
              <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Atau Tempel Link YouTube</label>
              <div className="flex gap-2">
                <input 
                  value={youtubeUrl} 
                  onChange={e=>setYoutubeUrl(e.target.value)}
                  onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); handleYoutube() }}}
                  placeholder="youtube.com/watch?v=..." 
                  className="flex-1 h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#0A0A0A]" 
                />
                <Button size="sm" variant="secondary" className="h-9 px-3 text-[11px]" onClick={handlePasteClipboard}>Paste</Button>
                <Button size="sm" className="h-9 px-3 text-[11px] bg-[#0A0A0A] text-white" onClick={()=>handleYoutube()} disabled={isYoutubeLoading || !youtubeUrl.trim()}>
                  {isYoutubeLoading ? '...' : 'Go'}
                </Button>
              </div>
              
              {youtubeInfo && (
                <div className="mt-3 rounded-[12px] border border-[#E8E8E3] bg-white p-3">
                  <div className="flex gap-3">
                    <img src={youtubeInfo.thumbnail} alt="thumb" className="h-14 w-20 rounded-[8px] object-cover bg-[#F5F5F0]" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-[600] leading-[1.3] line-clamp-2">{youtubeInfo.title}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">{youtubeInfo.author}</div>
                      <div className="mt-1 flex gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600] flex items-center gap-1"><IconCheck />Terdeteksi</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase flex items-center gap-2"><IconSpark />Langkah 2 - Generate Clips</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-white text-black">WAJIB KLIK</span>
            </div>
            <div className="text-[11px] text-white/60 leading-[1.5] mb-4">
              Setelah upload video atau tempel YouTube di Langkah 1, klik tombol besar di bawah untuk buat 5 clip viral otomatis. Tombol ini ada di sini!
            </div>
            <Button className="w-full h-12 bg-white text-black hover:bg-[#FFD60A] text-[13px] font-[700] gap-2" disabled={!isGenerateEnabled} onClick={handleTranscribe}>
              <IconFilm />{isProcessing ? 'Memproses...' : isYoutubeLoading ? 'Mengambil YouTube...' : youtubeInfo ? `Buat Clip Viral` : 'Buat Clip Viral Sekarang'}
            </Button>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-white/50 text-center">
              <div className="rounded-full bg-white/10 py-1">AI Deteksi</div>
              <div className="rounded-full bg-white/10 py-1">5 Clips</div>
              <div className="rounded-full bg-white/10 py-1">Auto Hook</div>
            </div>
            {!videoUrl && !youtubeInfo && (
              <div className="mt-3 rounded-[10px] bg-amber-500/20 border border-amber-500/20 p-2.5 text-[11px] text-amber-200">
                Upload video dulu di Langkah 1, baru tombol ini aktif
              </div>
            )}
            {isGenerateEnabled && (
              <div className="mt-3 rounded-[10px] bg-[#FFD60A] text-black p-2.5 text-[11px] font-[600] flex items-center gap-2">
                <IconCheck />Siap! Klik untuk generate clips
              </div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Langkah 3 - Hasil Clip ({clips.length})</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white">AI Viral</span>
            </div>
            <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
              {clips.length===0 ? (
                <div className="py-8 text-center border border-dashed border-[#E8E8E3] rounded-[12px]">
                  <div className="mx-auto h-8 w-8 rounded-[8px] bg-[#F5F5F0] flex items-center justify-center text-[#9B9B9B]"><IconFilm /></div>
                  <div className="mt-2 text-[11px] font-[600] text-[#6B6B6B]">Belum ada clip</div>
                  <div className="mt-1 text-[10px] text-[#9B9B9B]">Klik "Buat Clip Viral" di Langkah 2</div>
                </div>
              ) : clips.map(c=>(
                <button key={c.id} onClick={()=>{ setSelectedClip(c); setHook(c.hook); if(videoRef.current){ videoRef.current.currentTime=c.start; videoRef.current.play(); setIsPlaying(true) } }} className={`w-full text-left rounded-[14px] border p-3 transition ${selectedClip?.id===c.id ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-[700] tracking-[0.05em] px-2 py-0.5 rounded-full flex items-center gap-1 ${selectedClip?.id===c.id ? 'bg-white text-black' : 'bg-[#FFD60A] text-black'}`}><IconCheck />{c.label} {c.score}</span>
                    <span className="text-[10px] font-[500] opacity-70">{Math.floor(c.duration)}s</span>
                  </div>
                  <div className="mt-2 text-[12px] font-[600] leading-[1.3] tracking-[-0.01em] line-clamp-2">{c.hook}</div>
                  <div className="mt-1.5 text-[10px] opacity-60 font-mono">{Math.floor(c.start/60)}:{String(Math.floor(c.start%60)).padStart(2,'0')} - {Math.floor(c.end/60)}:{String(Math.floor(c.end%60)).padStart(2,'0')}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* CENTER - Preview with PLAY BUTTON ICON */}
        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card className="p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Langkah 4 - Preview 9:16</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-[600] px-2 py-1 rounded-full bg-[#0A0A0A] text-white">1080x1920</span>
                <button onClick={()=>setLoopPreview(!loopPreview)} className={`text-[10px] font-[600] px-2 py-1 rounded-full border ${loopPreview ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{loopPreview ? 'Loop ON' : 'Loop OFF'}</button>
              </div>
            </div>
            <div className="relative rounded-[18px] bg-[#0A0A0A] overflow-hidden aspect-[9/16] max-h-[680px] mx-auto">
              {videoUrl ? (
                <>
                  <video ref={videoRef} src={videoUrl} className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none" crossOrigin="anonymous" playsInline onPlay={()=>setIsPlaying(true)} onPause={()=>setIsPlaying(false)} />
                  <canvas ref={canvasRef} width={1080} height={1920} className="absolute inset-0 w-full h-full" />
                  
                  {!isPlaying && (
                    <button onClick={()=>videoRef.current?.play()} className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] gap-3">
                      <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-105 transition">
                        <IconPlay size={28} />
                      </div>
                      <span className="text-[12px] font-[600] text-white bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"><IconPlay size={14} />Putar Preview</span>
                    </button>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center gap-2">
                      <button onClick={()=> isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition">
                        {isPlaying ? <IconPause size={14} /> : <IconPlay size={14} />}
                      </button>
                      <Button size="sm" variant="secondary" className="h-8 text-[10px] bg-white/20 text-white border-white/20 hover:bg-white hover:text-black backdrop-blur-md gap-1" onClick={handleTestPlay}><IconRefresh />Tes Ulang</Button>
                      <div className="flex-1">
                        <input type="range" min={clipStartEdit} max={clipEndEdit} step={0.1} value={currentTime} onChange={e=>{ const t=parseFloat(e.target.value); setCurrentTime(t); if(videoRef.current) videoRef.current.currentTime=t }} className="w-full accent-[#FFD60A] h-1.5" />
                        <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/80">
                          <span>{currentTime.toFixed(1)}s</span>
                          <span className="font-[700] text-[#FFD60A]">{(clipEndEdit-clipStartEdit).toFixed(1)}s</span>
                          <span>{clipEndEdit.toFixed(1)}s</span>
                        </div>
                      </div>
                      <select value={playbackSpeed} onChange={e=>setPlaybackSpeed(parseFloat(e.target.value))} className="h-8 rounded-full bg-white/10 border border-white/20 text-white text-[10px] px-2 backdrop-blur-md">
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 font-[600]">{style.name} - {ANIMATIONS[anim]?.name}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">PREVIEW</span>
                  </div>
                </>
              ) : youtubeInfo ? (
                <div className="absolute inset-0">
                  <img src={youtubeInfo.thumbnail} alt="youtube preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="rounded-[12px] bg-white p-3">
                      <div className="text-[12px] font-[700] line-clamp-2">{youtubeInfo.title}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">Preview YouTube</div>
                      <Button size="sm" className="mt-3 w-full h-8 text-[11px] bg-[#0A0A0A] text-white gap-1.5" onClick={handleTranscribe}><IconSpark />Buat Clip Sekarang</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-16 w-16 rounded-[16px] border border-dashed border-white/20 flex items-center justify-center text-white/30"><IconPlay size={24} /></div>
                  <div className="mt-4 text-[13px] font-[600] text-white/60">Belum ada video</div>
                  <div className="mt-1 text-[11px] text-white/30 max-w-[220px] leading-[1.4]">Upload di Langkah 1 lalu Generate di Langkah 2</div>
                </div>
              )}
            </div>
            
            {selectedClip && (
              <div className="mt-3 p-3 rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-[700] tracking-[0.06em] uppercase">Atur Durasi - Tes Sebelum Simpan</span>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-6 text-[10px] gap-1" onClick={handleTestPlay}><IconPlay size={10} />Tes Play</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[10px] bg-[#0A0A0A] text-white gap-1" onClick={applyDurationEdit}><IconCheck />Terapkan</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-[600] text-[#6B6B6B]">Mulai (detik)</label>
                    <input type="number" step={0.1} value={clipStartEdit} onChange={e=>setClipStartEdit(parseFloat(e.target.value)||0)} className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-[600] text-[#6B6B6B]">Selesai (detik)</label>
                    <input type="number" step={0.1} value={clipEndEdit} onChange={e=>setClipEndEdit(parseFloat(e.target.value)||0)} className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-mono" />
                  </div>
                </div>
                <div className="mt-3">
                  <input type="range" min={0} max={duration||100} step={0.1} value={clipStartEdit} onChange={e=>setClipStartEdit(parseFloat(e.target.value))} className="w-full accent-[#0A0A0A] h-1.5" />
                  <input type="range" min={0} max={duration||100} step={0.1} value={clipEndEdit} onChange={e=>setClipEndEdit(parseFloat(e.target.value))} className="w-full accent-[#FFD60A] h-1.5 mt-1" />
                  <div className="mt-1 flex justify-between text-[10px] font-mono text-[#6B6B6B]">
                    <span>0s</span>
                    <span className="font-[700] text-[#0A0A0A]">{(clipEndEdit-clipStartEdit).toFixed(1)}s durasi</span>
                    <span>{(duration||0).toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button className="h-10 bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] text-[12px] gap-1.5" disabled={!selectedClip} onClick={handleTestPlay}><IconPlay size={14} />Tes Preview</Button>
              <Button variant="outline" className="h-10 text-[12px] gap-1.5" disabled={!selectedClip || saving} onClick={handleSaveProject}><IconSave />{saving ? 'Menyimpan...' : 'Simpan'}</Button>
              <Button className="h-10 bg-[#FFD60A] text-black hover:bg-[#FFC700] text-[12px] font-[700] gap-1.5" disabled={!selectedClip} onClick={doExport}><IconDownload />Export</Button>
            </div>
            <div className="mt-2 text-[10px] text-[#9B9B9B] text-center">
              Langkah: 1 Upload - 2 Generate Clip Viral - 3 Pilih Clip - 4 Tes Play - 5 Simpan & Export
            </div>
          </Card>
        </div>

        {/* RIGHT - Styles */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase">Gaya Subtitle - 12 Style</h2>
              <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white">{Object.keys(STYLES).length} STYLE</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(STYLES).map(([k,s]: any)=>{
                const isActive = styleKey===k
                return (
                  <button key={k} onClick={()=>setStyleKey(k)} className={`text-left rounded-[14px] border p-2.5 transition relative overflow-hidden ${isActive ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-[800] tracking-[-0.01em]">{s.name.toUpperCase()}</div>
                        <div className={`text-[9px] mt-0.5 ${isActive ? 'text-white/60' : 'text-[#6B6B6B]'}`}>{s.desc}</div>
                      </div>
                      <span className={`text-[8px] font-[700] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-black' : 'bg-[#F5F5F0] border border-[#E8E8E3]'}`}>{s.usage}</span>
                    </div>
                    <div className="mt-2.5 rounded-[10px] border border-black/5 p-2 h-[64px] flex flex-col items-center justify-center overflow-hidden relative" style={{ background: s.bgPreview }}>
                      <div className="font-[900] text-[15px] leading-[0.9] tracking-[-0.02em] text-center" style={{ 
                        color: s.text === 'transparent' ? '#FFFFFF' : s.text, 
                        WebkitTextStroke: s.sw>0 && s.stroke !== 'transparent' ? `${s.sw/3}px ${s.stroke}` : '0',
                        fontFamily: s.font,
                        textTransform: s.upper ? 'uppercase' as any : 'none',
                        textShadow: k==='shadow' ? '2px 2px 8px rgba(0,0,0,0.6)' : k==='glow' ? `0 0 10px ${s.highlight}` : 'none'
                      }}>
                        <div style={{ color: s.text === 'transparent' ? 'transparent' : s.text, WebkitTextStroke: s.text === 'transparent' ? `2px ${s.highlight}` : undefined }}>{s.previewText}</div>
                        <div style={{ color: s.highlight, fontSize: '11px', marginTop: '2px' }}>{s.previewSub}</div>
                      </div>
                    </div>
                    {isActive && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FFD60A] animate-pulse" />}
                  </button>
                )
              })}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Animasi - 10 Animasi</label>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">{Object.keys(ANIMATIONS).length} ANIM</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-1.5">
                  {Object.entries(ANIMATIONS).map(([k,a]: any)=>{
                    const isActive = anim===k
                    return (
                      <button key={k} onClick={()=>setAnim(k)} className={`rounded-[10px] border p-2 text-left transition ${isActive ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-[700]">{a.name}</span>
                          <span className={`text-[7px] px-1 py-0.5 rounded-full font-[600] ${isActive ? 'bg-white text-black' : 'bg-[#F5F5F0]'}`}>{a.usage}</span>
                        </div>
                        <div className="mt-1.5 h-[28px] rounded-[6px] bg-[#F5F5F0] border border-[#E8E8E3]/50 flex items-center justify-center overflow-hidden">
                          <div className={`text-[9px] font-[800] ${isActive ? 'text-[#0A0A0A]' : 'text-[#6B6B6B]'}`} style={{ animation: isActive ? `${k} 1s ease-in-out infinite` : '' }}>
                            {a.name.toUpperCase()}
                          </div>
                        </div>
                        <div className={`mt-1 text-[8px] ${isActive ? 'text-white/60' : 'text-[#9B9B9B]'}`}>{a.desc}</div>
                      </button>
                    )
                  })}
                </div>
                <style>{`
                  @keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}
                  @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
                  @keyframes slide{0%{transform:translateY(8px);opacity:0}50%{transform:translateY(0);opacity:1}100%{transform:translateY(-4px);opacity:0}}
                  @keyframes fade{0%,100%{opacity:0.2}50%{opacity:1}}
                  @keyframes glitch{0%{transform:translate(0)}20%{transform:translate(-2px,2px)}40%{transform:translate(2px,-2px)}60%{transform:translate(-1px,1px)}80%{transform:translate(1px,-1px)}100%{transform:translate(0)}}
                  @keyframes zoom{0%{transform:scale(0.8)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
                  @keyframes rotate{0%{transform:rotateY(0deg)}50%{transform:rotateY(15deg)}100%{transform:rotateY(0deg)}}
                  @keyframes wave{0%,100%{transform:translateY(0)}25%{transform:translateY(-4px)}75%{transform:translateY(4px)}}
                `}</style>
              </div>

              <div className="pt-2 border-t border-[#E8E8E3]">
                <button onClick={()=>setShowCustom(!showCustom)} className="w-full flex items-center justify-between text-[11px] font-[700] tracking-[0.06em] uppercase">
                  <span className="flex items-center gap-1.5"><IconPalette />Custom Warna dan Font</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${showCustom ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{showCustom ? 'Tutup' : 'Buka'}</span>
                </button>
                
                {showCustom && (
                  <div className="mt-3 space-y-3 p-3 rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3]">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-[600]">Warna Teks</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customTextColor || baseStyle.text === 'transparent' ? '#FFFFFF' : baseStyle.text} onChange={e=>setCustomTextColor(e.target.value)} className="h-8 w-8 rounded-full border border-[#E8E8E3] cursor-pointer" />
                          <input value={customTextColor} onChange={e=>setCustomTextColor(e.target.value)} placeholder={baseStyle.text} className="flex-1 h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-[600]">Warna Highlight</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customHighlightColor || baseStyle.highlight} onChange={e=>setCustomHighlightColor(e.target.value)} className="h-8 w-8 rounded-full border border-[#E8E8E3] cursor-pointer" />
                          <input value={customHighlightColor} onChange={e=>setCustomHighlightColor(e.target.value)} placeholder={baseStyle.highlight} className="flex-1 h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-[600]">Warna Stroke</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customStrokeColor || (baseStyle.stroke === 'transparent' ? '#000000' : baseStyle.stroke)} onChange={e=>setCustomStrokeColor(e.target.value)} className="h-8 w-8 rounded-full border border-[#E8E8E3] cursor-pointer" />
                          <input value={customStrokeColor} onChange={e=>setCustomStrokeColor(e.target.value)} placeholder={baseStyle.stroke} className="flex-1 h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-[600]">Warna Background</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customBgColor && customBgColor !== 'transparent' ? customBgColor : '#FFD60A'} onChange={e=>setCustomBgColor(e.target.value)} className="h-8 w-8 rounded-full border border-[#E8E8E3] cursor-pointer" />
                          <input value={customBgColor} onChange={e=>setCustomBgColor(e.target.value)} placeholder="transparent" className="flex-1 h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-[600]">Font Keluarga - {FONTS.length} Font</label>
                      <select value={customFont} onChange={e=>setCustomFont(e.target.value)} className="mt-1 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px]">
                        <option value="">Default ({baseStyle.font})</option>
                        {FONTS.map(f=><option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 h-7 text-[10px]" onClick={()=>{ setCustomTextColor(''); setCustomHighlightColor(''); setCustomStrokeColor(''); setCustomBgColor(''); setCustomFont('') }}>Reset</Button>
                      <Button size="sm" className="flex-1 h-7 text-[10px] bg-[#0A0A0A] text-white gap-1" onClick={()=>setShowCustom(false)}><IconCheck />Terapkan</Button>
                    </div>

                    <div className="rounded-[8px] bg-white border border-[#E8E8E3] p-2.5">
                      <div className="text-[10px] font-[600] mb-1.5">Preview Custom Warna</div>
                      <div className="rounded-[8px] h-[60px] flex items-center justify-center" style={{ background: baseStyle.bgPreview }}>
                        <div className="font-[900] text-[16px]" style={{ 
                          color: style.text === 'transparent' ? 'transparent' : style.text,
                          WebkitTextStroke: style.text === 'transparent' ? `2px ${style.highlight}` : `${style.sw/3}px ${style.stroke}`,
                          fontFamily: style.font,
                          textShadow: styleKey==='glow' ? `0 0 12px ${style.highlight}` : 'none'
                        }}>
                          <span style={{ color: style.text === 'transparent' ? undefined : style.text }}>{baseStyle.previewText}</span> <span style={{ color: style.highlight }}>{baseStyle.previewSub}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Posisi</label>
                  <select value={pos} onChange={e=>setPos(e.target.value as any)} className="mt-1.5 w-full h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px]">
                    <option value="top">ATAS</option>
                    <option value="center">TENGAH</option>
                    <option value="bottom">BAWAH</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Kata per Baris</label>
                  <div className="mt-1.5 grid grid-cols-4 gap-1">
                    {[1,2,3,4].map(n=>(
                      <button key={n} onClick={()=>setWpl(n)} className={`h-8 rounded-full text-[11px] font-[600] border ${wpl===n ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Ukuran Font</label>
                  <span className="text-[10px] font-mono font-[600]">{fontSize}px</span>
                </div>
                <input type="range" min={36} max={120} value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} className="w-full mt-2 accent-[#0A0A0A] h-1.5" />
              </div>

              <div>
                <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B]">Judul Hook - AI Viral</label>
                <div className="mt-1.5 flex gap-2">
                  <input value={hook} onChange={e=>setHook(e.target.value)} placeholder="Tulis hook viral..." className="flex-1 h-8 rounded-full border border-[#E8E8E3] bg-white px-3 text-[11px] focus:outline-none focus:border-[#0A0A0A]" />
                  <Button size="sm" className="h-8 px-3 text-[10px] bg-[#0A0A0A] text-white gap-1" onClick={handleAiHook} disabled={aiLoading || !selectedClip}>
                    <IconSpark />{aiLoading ? '...' : 'AI'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <h3 className="text-[11px] font-[700] tracking-[0.06em] uppercase">Fitur Editor Lengkap</h3>
            <div className="mt-2 text-[11px] leading-[1.5] text-white/60 space-y-1">
              <div className="flex items-center gap-1.5"><IconCheck />12 gaya subtitle + preview visual (bukan hitam)</div>
              <div className="flex items-center gap-1.5"><IconCheck />10 animasi + demo live + icon</div>
              <div className="flex items-center gap-1.5"><IconCheck />Custom warna teks, highlight, stroke, bg + 8 font</div>
              <div className="flex items-center gap-1.5"><IconCheck />Tombol play besar + tes sebelum export + icon</div>
              <div className="flex items-center gap-1.5"><IconCheck />Langkah jelas: 1 Upload - 2 Generate - 3 Preview - 4 Export</div>
              <div className="flex items-center gap-1.5"><IconCheck />Simpan project + export MP4 1080x1920 - fungsi aktif</div>
            </div>
          </Card>
        </div>
      </div>

      {showExport && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-xl flex items-center justify-center p-4">
          <Card className="w-full max-w-[360px] p-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-[800] animate-pulse">A</div>
            <div className="mt-4 text-[14px] font-[700]">Mengekspor clip</div>
            <div className="text-[12px] text-[#6B6B6B] mt-1">{STYLES[styleKey]?.name} - {ANIMATIONS[anim]?.name} - {hook.slice(0,30)}</div>
            <div className="mt-1 text-[11px] text-[#9B9B9B]">{exportStatus} - {(clipEndEdit-clipStartEdit).toFixed(1)}s - {fontSize}px</div>
            <div className="mt-5 h-1.5 rounded-full bg-[#F5F5F0] overflow-hidden">
              <div className="h-full bg-[#0A0A0A] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] font-mono">{progress}% - Siap unduh</div>
          </Card>
        </div>
      )}
    </div>
  )
}
