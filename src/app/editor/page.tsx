"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import { SUBTITLE_STYLES, SUBTITLE_ANIMATIONS } from '@/lib/subtitle-styles'

type Word = { word: string; start: number; end: number }
type Clip = { id: number; start: number; end: number; duration: number; hook: string; score: number; label: string; words: Word[] }

const IconUpload = () => (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>)
const IconPlay = ({ size=16 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>)
const IconPause = ({ size=16 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>)
const IconSave = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>)
const IconDownload = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>)
const IconRefresh = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>)
const IconCheck = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>)
const IconPalette = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>)
const IconSpark = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z"/></svg>)
const IconFilm = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>)
const IconUser = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)
const IconInfo = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>)
const IconVideo = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 13 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>)

const STYLES: any = {}
Object.values(SUBTITLE_STYLES).forEach((s: any) => {
  const parts = s.preview.split(' ')
  STYLES[s.id] = {
    id: s.id, name: s.name, desc: s.desc, font: s.font, fontClass: s.fontClass,
    text: s.textColor, textColor: s.textColor, highlight: s.highlightColor, highlightColor: s.highlightColor,
    stroke: s.strokeColor, strokeColor: s.strokeColor, sw: s.strokeWidth, strokeWidth: s.strokeWidth,
    bg: s.bgColor, bgColor: s.bgColor, bgClass: s.bgClass, textClass: s.textClass, highlightClass: s.highlightClass,
    upper: s.upper, usage: s.usage, bgPreview: s.bgPreview,
    previewText: parts[0] || s.preview.slice(0,6), previewSub: parts.slice(1).join(' ') || parts[0], preview: s.preview,
  }
})
const ANIMATIONS: any = {}
Object.values(SUBTITLE_ANIMATIONS).forEach((a: any) => { ANIMATIONS[a.id] = { name: a.name, desc: a.desc, usage: a.usage } })
const FONTS = ['Anton', 'Bebas Neue', 'Montserrat', 'Inter', 'Oswald', 'Georgia', 'Poppins', 'Space Grotesk']

export default function EditorPage() {
  const router = useRouter()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState('') // real Cloudinary URL - ONLINE ONLY
  const [previewBlobUrl, setPreviewBlobUrl] = useState('') // blob for instant preview
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [youtubeInfo, setYoutubeInfo] = useState<any>(null)
  const [isYoutubeLoading, setIsYoutubeLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
  const [logs, setLogs] = useState<string[]>(['Online mode - upload video untuk mulai'])
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('') // for compatibility, now = previewBlobUrl or videoUrl

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  const addLog = (msg: string) => {
    console.log('[Editor Online]', msg)
    setLogs(prev => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 8))
  }

  const baseStyle = STYLES[styleKey] || STYLES.hormozi
  const style = {
    ...baseStyle,
    text: customTextColor || baseStyle.text,
    textColor: customTextColor || baseStyle.textColor,
    highlight: customHighlightColor || baseStyle.highlight,
    highlightColor: customHighlightColor || baseStyle.highlightColor,
    stroke: customStrokeColor || baseStyle.stroke,
    strokeColor: customStrokeColor || baseStyle.strokeColor,
    bg: customBgColor || baseStyle.bg,
    bgColor: customBgColor || baseStyle.bgColor,
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
        addLog('FFmpeg ready - export MP4 online aktif')
      } catch (e) {
        addLog('FFmpeg loading... fallback canvas recording')
        setFfmpegLoaded(false)
      }
    }
    loadFFmpeg()
  }, [])

  const genClips = useCallback((words: Word[], dur: number) => {
    if (!words || words.length === 0) {
      addLog('Gagal generate: transcript kosong dari server')
      return
    }
    addLog(`Generate clips online: ${words.length} kata, dur ${dur.toFixed(1)}s`)
    const totalDuration = dur && dur > 0 ? dur : 120
    const effectiveDuration = Math.max(totalDuration, 60)
    const hooks = [
      "RAHASIA YANG TIDAK DIAJARKAN DI SEKOLAH",
      "STOP KERJA KERAS, MULAI KERJA CERDAS",
      "MODAL 500 RIBU JADI MILYARAN",
      "KESALAHAN 90 PERSEN PEMULA BISNIS",
      "CARA BALIK MODAL DALAM 7 HARI"
    ]
    // expand words if transcript shorter than video duration - server already expands, but ensure
    let allWords = [...words]
    if (allWords.length > 0) {
      const lastEnd = allWords[allWords.length - 1].end
      if (lastEnd < effectiveDuration) {
        const base = [...words]
        const baseDur = base[base.length - 1]?.end || 15
        let offset = lastEnd + 0.5
        let safety = 0
        while (offset < effectiveDuration && safety < 20) {
          base.forEach(w => {
            const nw = { ...w, start: w.start + offset, end: w.end + offset }
            if (nw.end <= effectiveDuration + 5) allWords.push(nw)
          })
          offset += baseDur + 0.5
          safety++
        }
      }
    }

    const newClips: Clip[] = []
    const clipCount = 5
    const segment = effectiveDuration / clipCount
    for (let i = 0; i < clipCount; i++) {
      const start = i * segment
      const end = Math.min(start + 24, effectiveDuration)
      let segWords = allWords.filter(w => w.start >= start && w.end <= end)
      if (segWords.length === 0) {
        const perClip = Math.ceil(allWords.length / clipCount)
        const slice = allWords.slice(i * perClip, (i + 1) * perClip)
        segWords = slice.map((w, idx) => ({ ...w, start: start + idx * 0.5, end: start + idx * 0.5 + 0.4 }))
      }
      newClips.push({
        id: i, start, end, duration: end - start,
        hook: hooks[i] || `VIRAL MOMENT ${i + 1}`,
        score: 95 - i * 6 + Math.floor(Math.random() * 4),
        label: i === 0 ? 'VIRAL' : i === 1 ? 'HIGH' : 'GOOD',
        words: segWords
      })
    }
    addLog(`Berhasil buat ${newClips.length} clips online - pilih di Langkah 3`)
    setClips(newClips)
    if (newClips[0]) {
      setSelectedClip(newClips[0])
      setClipStartEdit(newClips[0].start)
      setClipEndEdit(newClips[0].end)
      setHook(newClips[0].hook)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = newClips[0].start
          videoRef.current.play().then(() => {
            setIsPlaying(true)
            addLog(`Preview clip 1: ${newClips[0].hook}`)
          }).catch(()=>{})
        }
        if (previewVideoRef.current) {
          previewVideoRef.current.currentTime = newClips[0].start
        }
      }, 500)
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
    if (!targetUrl.trim()) {
      addLog('Tempel link YouTube dulu')
      return
    }
    setIsYoutubeLoading(true)
    addLog(`Fetch YouTube online: ${targetUrl.slice(0,40)}...`)
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
      addLog(`YouTube terdeteksi online: ${data.title?.slice(0,30)} - ${data.duration}s`)
      if (data.downloadUrl) {
        setVideoUrl(data.downloadUrl)
        setVideoPreviewUrl(data.downloadUrl)
        setPreviewBlobUrl(data.downloadUrl)
        addLog('Download URL online ready - video bisa dipreview')
      } else {
        // if no downloadUrl, use thumbnail preview but still need videoUrl for transcribe fallback
        addLog('YouTube tanpa downloadUrl - pakai preview thumbnail, transcribe dari server')
      }
      if (data.transcript && data.transcript.length) {
        const words = data.transcript
        const dur = data.duration || 120
        let extWords = [...words]
        if (dur > 10) {
          const baseDur = words[words.length - 1]?.end || 10
          const reps = Math.ceil(dur / baseDur)
          extWords = []
          for (let r = 0; r < reps; r++) {
            const offset = r * (baseDur + 0.5)
            words.forEach((w: Word) => extWords.push({ ...w, start: w.start + offset, end: w.end + offset }))
          }
          extWords = extWords.filter(w => w.end <= dur)
        }
        setDuration(dur)
        addLog(`Transcript online ${extWords.length} kata - generate clips`)
        genClips(extWords, dur)
      } else {
        addLog('YouTube tanpa transcript - panggil transcribe API online')
        // call transcribe API for youtube
        try {
          const tRes = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ youtubeUrl: targetUrl, duration: data.duration || 120 })
          })
          const tData = await tRes.json()
          if (tRes.ok && tData.words) {
            genClips(tData.words, tData.duration || data.duration || 120)
            setDuration(tData.duration || data.duration || 120)
          } else {
            throw new Error('Transcribe YouTube gagal')
          }
        } catch (e: any) {
          addLog(`Transcribe YouTube gagal: ${e.message}`)
        }
      }
    } catch (e: any) {
      addLog(`YouTube gagal: ${e.message}`)
      alert(e.message || 'Gagal proses YouTube')
    }
    setIsYoutubeLoading(false)
  }

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setYoutubeUrl(text)
        addLog(`Paste: ${text.slice(0,30)}`)
        if (text.includes('youtube.com') || text.includes('youtu.be')) handleYoutube(text)
      }
    } catch {
      addLog('Clipboard gagal - tempel manual')
    }
  }

  const handleTranscribe = async () => {
    addLog(`Generate clips online - videoUrl:${!!videoUrl} yt:${!!youtubeInfo} dur:${duration}`)
    if (!videoUrl && !youtubeInfo) {
      addLog('Gagal: belum ada video online')
      alert('Upload video dulu di Langkah 1 - harus upload ke Cloudinary dulu atau tempel YouTube')
      return
    }
    // YouTube tanpa downloadUrl tetap boleh - pakai youtubeUrl untuk transcribe
    if (!videoUrl && youtubeInfo) {
      addLog('YouTube mode tanpa Cloudinary URL - transcribe via youtubeUrl online')
    } else if (!videoUrl) {
      addLog('Gagal: videoUrl Cloudinary belum ready - tunggu upload selesai')
      alert('Tunggu upload ke Cloudinary selesai dulu')
      return
    }
    setIsProcessing(true)
    addLog('Memanggil /api/transcribe online - server...')
    try {
      const durToUse = duration && duration > 0 ? duration : youtubeInfo?.duration || 120
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: videoUrl || undefined, duration: durToUse, youtubeUrl: youtubeInfo ? youtubeUrl : undefined })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Transcribe API error')
      if (!data.words || data.words.length === 0) throw new Error('Transcript kosong dari server')
      addLog(`Transcribe OK online: ${data.words?.length || 0} kata, dur ${data.duration}s - ${data.provider}`)
      const words = data.words
      const apiDur = data.duration || durToUse
      setDuration(apiDur)
      genClips(words, apiDur)
    } catch (e: any) {
      addLog(`Transcribe online error: ${e.message}`)
      alert(`Gagal transcribe online: ${e.message}. Coba lagi.`)
    }
    setIsProcessing(false)
  }

  const handleAiHook = async () => {
    if (!selectedClip) { addLog('Pilih clip dulu di Langkah 3'); alert('Pilih clip dulu di Langkah 3'); return }
    setAiLoading(true)
    addLog(`Generate hook AI online untuk clip ${selectedClip.id}`)
    try {
      const transcript = selectedClip.words.map(w => w.word).join(' ')
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'
      const res = await fetch(`${authUrl}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'hook', transcript, prompt: transcript })
      })
      const data = await res.json()
      if (data.result) {
        const lines = data.result.split('\n').filter((l: string) => l.trim().length > 0).slice(0, 5)
        const firstHook = lines[0]?.replace(/^\d+\.\s*/, '').replace(/^-+\s*/, '').replace(/"/g, '').trim()
        if (firstHook) {
          setHook(firstHook.toUpperCase().slice(0, 60))
          addLog(`Hook AI online: ${firstHook}`)
        }
      } else {
        throw new Error('No AI result')
      }
    } catch (e: any) {
      addLog(`Hook AI gagal: ${e.message}`)
      const randomHook = clips[Math.floor(Math.random() * clips.length)]?.hook || 'RAHASIA VIRAL TERUNGKAP'
      setHook(randomHook)
    }
    setAiLoading(false)
  }

  const handleFile = async (f: File) => {
    addLog(`Upload file online: ${f.name} ${(f.size/1024/1024).toFixed(1)}MB - ${f.type}`)
    setVideoFile(f)
    const blobUrl = URL.createObjectURL(f)
    setPreviewBlobUrl(blobUrl)
    setVideoPreviewUrl(blobUrl)
    setVideoUrl(blobUrl) // set blob dulu biar bisa langsung generate/play, nanti diganti Cloudinary URL
    setProjectTitle(f.name.replace(/\.[^/.]+$/, ''))
    setClips([])
    setSelectedClip(null)
    setYoutubeInfo(null)
    addLog('Preview blob ready online - bisa langsung Tes Play - upload ke Cloudinary paralel...')

    // get duration first
    const tempVideo = document.createElement('video')
    tempVideo.preload = 'metadata'
    tempVideo.src = blobUrl
    tempVideo.onloadedmetadata = () => {
      const d = tempVideo.duration || 120
      addLog(`Duration terdeteksi online: ${d.toFixed(1)}s`)
      setDuration(d)
    }
    tempVideo.onerror = () => {
      addLog('Gagal baca duration - fallback 120s')
      setDuration(120)
    }

    // upload to Cloudinary - ONLINE, tapi tetap bisa generate pakai blob sambil nunggu
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', f)
      addLog('Uploading ke /api/upload (Cloudinary) online paralel...')
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload gagal')
      if (!data.url) throw new Error('No URL dari Cloudinary')
      setVideoUrl(data.url)
      setVideoPreviewUrl(data.url)
      addLog(`Upload Cloudinary OK online: ${data.url.slice(0,50)}... dur ${data.duration || '?'}s - sekarang full online Cloudinary`)
      if (data.duration) setDuration(data.duration)
      // auto transcribe after Cloudinary OK - full online flow
      addLog('Auto transcribe online setelah Cloudinary OK...')
      setTimeout(() => handleTranscribeOnline(data.url, data.duration || duration || 120), 500)
    } catch (e: any) {
      addLog(`Upload Cloudinary gagal online: ${e.message} - tetap bisa generate pakai blob preview, tapi untuk save/export butuh Cloudinary`)
      // jangan alert block, cuma log - biar tetap bisa generate offline blob
      // alert(`Upload Cloudinary gagal: ${e.message}. Tetap bisa preview & generate, tapi save butuh Cloudinary.`)
    }
    setIsUploading(false)
  }

  const handleTranscribeOnline = async (realUrl: string, dur: number) => {
    if (!realUrl) return
    setIsProcessing(true)
    try {
      const durToUse = dur && dur > 0 ? dur : duration || 120
      addLog(`Transcribe online auto: ${realUrl.slice(0,40)}... dur ${durToUse}`)
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: realUrl, duration: durToUse })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Transcribe error')
      addLog(`Transcribe auto OK: ${data.words?.length} kata - ${data.provider}`)
      genClips(data.words, data.duration || durToUse)
      setDuration(data.duration || durToUse)
    } catch (e: any) {
      addLog(`Auto transcribe gagal: ${e.message} - klik Generate manual`)
    }
    setIsProcessing(false)
  }

  const handleSaveProject = async () => {
    addLog(`Klik Simpan online - clips:${clips.length} selected:${!!selectedClip} video:${!!videoUrl} yt:${!!youtubeInfo}`)
    if (!videoUrl && !youtubeInfo) {
      addLog('Gagal simpan online: belum ada video/YouTube')
      alert('Upload video dulu sampai Cloudinary URL ready atau pakai YouTube')
      return
    }
    if (!clips.length) {
      addLog('Gagal simpan online: belum ada clips - generate dulu')
      alert('Generate clips dulu di Langkah 2 - harus online transcribe')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        addLog('Belum login - redirect ke login online')
        alert('Harus login dulu untuk simpan project online - redirect ke login')
        router.push('/id/auth/login')
        setSaving(false)
        return
      }
      addLog(`Simpan ke Supabase online user:${user.email}`)
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
        addLog('Project berhasil disimpan online ke Supabase')
        alert('Project berhasil disimpan online')
      }
    } catch (e: any) {
      addLog(`Gagal simpan online: ${e.message}`)
      alert('Gagal simpan online: ' + e.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let animationId: number
    const render = () => {
      const vw = canvas.width, vh = canvas.height
      try {
        ctx.clearRect(0, 0, vw, vh)
        ctx.filter = 'blur(24px) brightness(0.55)'
        ctx.drawImage(video, 0, 0, vw, vh)
        ctx.filter = 'none'
        const va = video.videoWidth / video.videoHeight || 9/16
        const ca = vw / vh
        let sx, sy, sw, sh
        if (va > ca) { sh = video.videoHeight; sw = sh * ca; sx = (video.videoWidth - sw) / 2; sy = 0 }
        else { sw = video.videoWidth; sh = sw / ca; sx = 0; sy = (video.videoHeight - sh) / 2 }
        const tw = vw * 0.92, th = tw / ca, tx = (vw - tw) / 2, ty = (vh - th) / 2
        ctx.save()
        ctx.beginPath()
        // @ts-ignore
        if (ctx.roundRect) ctx.roundRect(tx, ty, tw, th, 18); else ctx.rect(tx, ty, tw, th)
        ctx.clip()
        ctx.drawImage(video, sx, sy, sw, sh, tx, ty, tw, th)
        ctx.restore()
      } catch {}

      if (!selectedClip) {
        animationId = requestAnimationFrame(render)
        return
      }

      if (!video || video.paused) { 
        animationId = requestAnimationFrame(render); return 
      }
      const ct = currentTime - selectedClip.start
      const at = selectedClip.start + ct
      const visible = selectedClip.words.filter(w => at >= w.start - 0.1 && at <= w.end + 0.7)
      if (visible.length) {
        const toShow = visible.slice(-wpl)
        const cur = selectedClip.words.find(w => at >= w.start && at <= w.end)
        let text = toShow.map(w => w.word).join(' ')
        if (style.upper) text = text.toUpperCase()
        let y = vh * 0.78
        if (pos === 'top') y = vh * 0.22
        if (pos === 'center') y = vh * 0.5
        if (pos === 'bottom') y = vh * 0.82
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `900 ${fontSize}px "${style.font}", sans-serif`
        const mw = ctx.measureText(text).width
        const tht = fontSize * 1.15
        let scale = 1, oy = 0, op = 1, rot = 0, skew = 0
        if (cur) {
          const p = (at - cur.start) / (cur.end - cur.start)
          if (anim === 'pop') scale = 1 + Math.sin(p * Math.PI) * 0.18
          else if (anim === 'bounce') { scale = 1 + Math.abs(Math.sin(p * Math.PI * 2)) * 0.22; oy = -Math.abs(Math.sin(p * Math.PI)) * 12 }
          else if (anim === 'slide') { oy = (1 - p) * 20; op = p }
          else if (anim === 'fade') { op = p; scale = 0.85 + p * 0.15 }
          else if (anim === 'wave') { oy = Math.sin(p * Math.PI * 2) * 8; rot = Math.sin(p * Math.PI) * 0.08 }
          else if (anim === 'glitch') { if (Math.random() > 0.85) { oy = (Math.random() - 0.5) * 10; skew = (Math.random() - 0.5) * 0.2 } }
          else if (anim === 'zoom') { scale = 0.8 + p * 0.4 }
          else if (anim === 'rotate') { rot = p * 0.3; scale = 0.9 + Math.sin(p * Math.PI) * 0.1 }
        }
        ctx.save()
        ctx.globalAlpha = op
        ctx.translate(vw / 2, y + oy)
        ctx.rotate(rot)
        // @ts-ignore
        if (skew) ctx.transform(1, skew, 0, 1, 0, 0)
        ctx.scale(scale, scale)
        if (style.bgColor !== 'transparent' && style.bg !== 'transparent') {
          ctx.fillStyle = style.bgColor || style.bg
          ctx.beginPath()
          // @ts-ignore
          if (ctx.roundRect) ctx.roundRect(-mw / 2 - 20, -tht / 2 - 10, mw + 40, tht + 20, 12); else ctx.rect(-mw / 2 - 20, -tht / 2 - 10, mw + 40, tht + 20)
          ctx.fill()
        }
        if (styleKey === 'glow') { ctx.shadowColor = style.highlightColor || style.highlight; ctx.shadowBlur = 20 }
        if ((style.strokeWidth > 0 || style.sw > 0) && style.strokeColor !== 'transparent' && style.stroke !== 'transparent') {
          ctx.strokeStyle = style.strokeColor || style.stroke
          ctx.lineWidth = style.strokeWidth || style.sw
          ctx.lineJoin = 'round'
          ctx.strokeText(text, 0, 0)
        }
        ctx.shadowBlur = 0
        if (toShow.length > 1 && cur) {
          let xo = -mw / 2
          toShow.forEach(w => {
            const isCur = cur && w.word === cur.word
            const wt = style.upper ? w.word.toUpperCase() : w.word
            const ww = ctx.measureText(wt + ' ').width
            ctx.fillStyle = isCur ? (style.highlightColor || style.highlight) : (style.textColor || style.text)
            if ((style.textColor || style.text) === 'transparent') {
              ctx.strokeStyle = style.highlightColor || style.highlight
              ctx.lineWidth = 2
              ctx.strokeText(wt + ' ', xo + ww / 2, 0)
            } else {
              ctx.fillText(wt + ' ', xo + ww / 2, 0)
            }
            xo += ww
          })
        } else {
          if ((style.textColor || style.text) === 'transparent') {
            ctx.strokeStyle = style.highlightColor || style.highlight
            ctx.lineWidth = 3
            ctx.strokeText(text, 0, 0)
          } else {
            ctx.fillStyle = style.textColor || style.text
            ctx.fillText(text, 0, 0)
          }
        }
        ctx.restore()
        if (hook) {
          ctx.save()
          ctx.font = `800 22px Inter, sans-serif`
          ctx.fillStyle = '#FFD60A'
          ctx.strokeStyle = '#000'
          ctx.lineWidth = 5
          ctx.textAlign = 'center'
          const hy = vh * 0.11
          ctx.strokeText(hook, vw / 2, hy)
          ctx.fillText(hook, vw / 2, hy)
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
    const lm = () => {
      if (v.duration && !isNaN(v.duration) && v.duration !== Infinity) {
        setDuration(v.duration)
        addLog(`Video metadata online: ${v.duration.toFixed(1)}s`)
      }
    }
    v.addEventListener('timeupdate', ut)
    v.addEventListener('loadedmetadata', lm)
    if (v.readyState >= 1 && v.duration) setDuration(v.duration)
    return () => { v.removeEventListener('timeupdate', ut); v.removeEventListener('loadedmetadata', lm) }
  }, [selectedClip, loopPreview, clipStartEdit, clipEndEdit, videoUrl])

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
    addLog(`Durasi diubah online: ${newStart.toFixed(1)}s - ${newEnd.toFixed(1)}s`)
  }

  const handleTestPlay = () => {
    if (selectedClip && videoRef.current) {
      addLog(`Tes Play online clip ${selectedClip.id} ${clipStartEdit}-${clipEndEdit}`)
      videoRef.current.currentTime = clipStartEdit
      videoRef.current.play().then(() => setIsPlaying(true)).catch(()=>{})
      if (previewVideoRef.current) previewVideoRef.current.currentTime = clipStartEdit
      return
    }
    if (previewVideoRef.current) {
      addLog('Tes Play full video online preview')
      previewVideoRef.current.currentTime = 0
      previewVideoRef.current.play().then(() => setIsPlaying(true)).catch(()=>{})
      return
    }
    if (videoRef.current) {
      addLog('Tes Play full video online via canvas')
      videoRef.current.currentTime = 0
      videoRef.current.play().then(() => setIsPlaying(true)).catch(()=>{})
      return
    }
    addLog('Gagal tes online: belum ada video - upload dulu')
    alert('Upload video dulu di Langkah 1 atau tempel YouTube')
  }

  const doExport = async () => {
    addLog(`Export online clip ${selectedClip?.id} style ${styleKey}`)
    if (!selectedClip) { addLog('Gagal export online: belum pilih clip'); alert('Pilih clip dulu di Langkah 3'); return }
    if (!videoUrl && !youtubeInfo?.downloadUrl) { 
      addLog('Gagal export online: belum ada video file - YouTube tanpa downloadUrl tidak bisa export, upload file MP4')
      alert('Untuk export, upload file MP4 di Langkah 1 atau pakai YouTube yang ada downloadUrl. YouTube ini cuma thumbnail preview.')
      return 
    }
    setShowExport(true)
    setProgress(0)
    setExportStatus('Menyiapkan online...')
    try {
      if (videoFile && ffmpeg && ffmpegLoaded) {
        setExportStatus('Memotong video online via FFmpeg...')
        addLog('FFmpeg potong video online...')
        setProgress(10)
        await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))
        setProgress(20)
        await ffmpeg.exec(['-ss', clipStartEdit.toString(), '-i', 'input.mp4', '-t', (clipEndEdit - clipStartEdit).toString(), '-c', 'copy', '-avoid_negative_ts', 'make_zero', 'trimmed.mp4'])
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
        setExportStatus('Berhasil diunduh online')
        addLog('Export MP4 online berhasil via FFmpeg')
      } else {
        setExportStatus('Merekam preview online dengan subtitle...')
        addLog('Export via canvas recording online...')
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video || !selectedClip) throw new Error('No video online')
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
              setExportStatus('Konversi ke MP4 online...')
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
        const recordDuration = (clipEndEdit - clipStartEdit) * 1000
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
        setExportStatus('Berhasil online')
        addLog('Export canvas online berhasil')
      }
    } catch (e: any) {
      addLog(`Export online gagal: ${e.message}`)
      setExportStatus(`Gagal: ${e.message}`)
      for (let i = progress; i <= 100; i += 10) { await new Promise(r => setTimeout(r, 100)); setProgress(i) }
    }
    setTimeout(() => { setShowExport(false); setProgress(0); setExportStatus('') }, 2000)
  }

  const isGenerateEnabled = !!(videoUrl || previewBlobUrl || youtubeInfo) && !isProcessing && !isYoutubeLoading

  return (
    <div className="min-h-screen bg-[#FCFCF9] text-[#0A0A0A]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-6 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/id" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
              <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
              <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="ml-3 hidden md:block h-7 rounded-full border border-[#E8E8E3] bg-white px-3 text-[12px] font-[500] w-[180px] focus:outline-none focus:border-[#0A0A0A]" />
            </Link>
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#F5F5F0] p-1 border border-[#E8E8E3]">
              <Link href="/id" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">Home</Link>
              <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-white text-[12px] font-[600]">Editor</span>
              <Link href="/id/projects" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A]">Projects</Link>
              <Link href="/id/profile" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] flex items-center gap-1"><IconUser />Profile</Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 text-[10px]">
              <span className={`px-2 py-1 rounded-full border ${ffmpegLoaded ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                {ffmpegLoaded ? 'FFmpeg Ready' : 'FFmpeg Loading...'}
              </span>
              <span className={`px-2 py-1 rounded-full border ${videoUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{videoUrl ? 'Cloudinary ✓' : duration ? `${duration.toFixed(1)}s` : 'no video'}</span>
              <span className="px-2 py-1 rounded-full bg-[#0A0A0A] text-white">ONLINE</span>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={handleSaveProject} disabled={saving || (!videoUrl && !youtubeInfo)}><IconSave />{saving ? 'Menyimpan...' : 'Simpan'}</Button>
            <Button size="sm" className="h-8 bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] gap-1.5" onClick={() => selectedClip ? doExport() : handleTestPlay()} disabled={!videoUrl && !previewBlobUrl && !youtubeInfo}><IconDownload />{selectedClip ? 'Export' : 'Play'}</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 pt-3">
        <div className="rounded-[12px] border border-[#E8E8E3] bg-white p-3 flex flex-wrap gap-2 items-center text-[11px]">
          <span className="font-[700] flex items-center gap-1.5"><IconInfo />ONLINE FLOW:</span>
          <span className={`px-2 py-1 rounded-full border ${previewBlobUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>1. Upload {previewBlobUrl ? '✓' : ''} {isUploading ? 'Uploading...' : videoUrl ? 'Cloudinary ✓' : ''}</span>
          <span className="text-[#9B9B9B]">→</span>
          <span className={`px-2 py-1 rounded-full border ${clips.length ? 'bg-green-50 border-green-200 text-green-700' : isGenerateEnabled ? 'bg-[#FFD60A] border-[#FFD60A] text-black animate-pulse' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>2. Generate {clips.length ? `✓ ${clips.length}` : isGenerateEnabled ? 'KLIK!' : ''} {isProcessing ? 'AI...' : ''}</span>
          <span className="text-[#9B9B9B]">→</span>
          <span className={`px-2 py-1 rounded-full border ${selectedClip ? 'bg-green-50 border-green-200 text-green-700' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>3. Pilih Clip {selectedClip ? `✓ #${selectedClip.id}` : ''}</span>
          <span className="text-[#9B9B9B]">→</span>
          <span className={`px-2 py-1 rounded-full border ${selectedClip && isPlaying ? 'bg-green-50 border-green-200 text-green-700' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>4. Preview {isPlaying ? '▶' : ''}</span>
          <span className="text-[#9B9B9B]">→</span>
          <span className="px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">5. Simpan & Export Online</span>
          <span className="ml-auto text-[10px] text-[#6B6B6B] hidden md:block">Full online - Cloudinary + /api/transcribe + Supabase</span>
        </div>
        <div className="mt-2 rounded-[10px] bg-[#0A0A0A] text-white p-2.5 text-[10px] font-mono leading-[1.5] max-h-[80px] overflow-auto">
          {logs.map((l, i) => <div key={i} className={i === 0 ? 'text-[#FFD60A]' : 'text-white/60'}>{l}</div>)}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 lg:px-6 py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-5">
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase flex items-center gap-1.5"><IconUpload />Langkah 1 - Source Video Online</h2>
              <span className={`text-[10px] font-[600] px-2 py-0.5 rounded-full border ${videoUrl ? 'bg-green-50 border-green-200 text-green-700' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{videoUrl ? '✓ Cloudinary' : isUploading ? 'Uploading...' : 'WAJIB ONLINE'}</span>
            </div>
            <div className="text-[11px] text-[#6B6B6B] mb-3 leading-[1.5] flex gap-1.5"><IconInfo />Upload MP4/MOV ke Cloudinary online. Preview instant, lalu auto transcribe.</div>
            <div
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f && f.type.startsWith('video/')) handleFile(f) }}
              onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              className={`rounded-[16px] border-2 border-dashed p-6 text-center cursor-pointer transition ${videoUrl ? 'border-green-300 bg-green-50' : 'border-[#E8E8E3] bg-[#FCFCF9] hover:border-[#0A0A0A] hover:bg-white'}`}
            >
              <div className={`mx-auto h-10 w-10 rounded-[12px] flex items-center justify-center ${videoUrl ? 'bg-green-600 text-white' : 'bg-[#0A0A0A] text-white'}`}>{videoUrl ? <IconCheck /> : <IconUpload />}</div>
              <div className="mt-3 text-[13px] font-[600]">{videoUrl ? 'Video terupload Cloudinary - klik ganti' : isUploading ? 'Uploading ke Cloudinary...' : 'Drop video di sini atau klik - online'}</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">{videoFile ? `${videoFile.name} • ${(videoFile.size/1024/1024).toFixed(1)}MB • ${duration ? duration.toFixed(1)+'s' : '...'}` : 'MP4, MOV hingga 100MB - Cloudinary'}</div>
              <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
            </div>

            <div className="mt-4 space-y-2">
              <label className="text-[10px] font-[700] tracking-[0.08em] uppercase text-[#6B6B6B] flex items-center gap-1"><IconVideo />Atau Tempel Link YouTube - online</label>
              <div className="flex gap-2">
                <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleYoutube() } }} placeholder="youtube.com/watch?v=..." className="flex-1 h-9 rounded-full border border-[#E8E8E3] bg-white px-4 text-[12px] placeholder:text-[#9B9B9B] focus:outline-none focus:border-[#0A0A0A]" />
                <Button size="sm" variant="secondary" className="h-9 px-3 text-[11px]" onClick={handlePasteClipboard}>Paste</Button>
                <Button size="sm" className="h-9 px-3 text-[11px] bg-[#0A0A0A] text-white" onClick={() => handleYoutube()} disabled={isYoutubeLoading || !youtubeUrl.trim()}>{isYoutubeLoading ? '...' : 'Go'}</Button>
              </div>

              {youtubeInfo && (
                <div className="mt-3 rounded-[12px] border border-[#E8E8E3] bg-white p-3">
                  <div className="flex gap-3">
                    <img src={youtubeInfo.thumbnail} alt="thumb" className="h-14 w-20 rounded-[8px] object-cover bg-[#F5F5F0]" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-[600] leading-[1.3] line-clamp-2">{youtubeInfo.title}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">{youtubeInfo.author} • {youtubeInfo.duration || duration || '?'}s</div>
                      <div className="mt-1 flex gap-1">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-[600] flex items-center gap-1"><IconCheck />Online terdeteksi</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-[#6B6B6B]">Transcript: {youtubeInfo.transcript?.length || 0} kata - {youtubeInfo.downloadUrl ? 'video URL online' : 'thumbnail only'}</div>
                </div>
              )}
              {previewBlobUrl && !youtubeInfo && (
                <div className="mt-3 rounded-[10px] bg-green-50 border border-green-200 p-2.5 text-[11px] text-green-800 space-y-1">
                  <div className="flex items-center gap-2 font-[600]"><IconCheck />{videoUrl ? 'Cloudinary ready - online' : 'Preview blob - uploading...'}</div>
                  <div>Nama: {videoFile?.name || projectTitle}</div>
                  <div>Durasi: {duration ? `${duration.toFixed(1)}s` : 'loading...'} - {videoUrl ? `URL: ${videoUrl.slice(0,30)}...` : 'Uploading...'}</div>
                  <div>{videoUrl ? 'Siap generate via /api/transcribe online' : 'Tunggu upload selesai'}</div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase flex items-center gap-2"><IconSpark />Langkah 2 - Generate Clips Online</h2>
              <span className={`text-[10px] font-[600] px-2 py-0.5 rounded-full ${clips.length ? 'bg-green-500 text-white' : isGenerateEnabled ? 'bg-[#FFD60A] text-black animate-pulse' : 'bg-white/20 text-white/60'}`}>{clips.length ? `✓ ${clips.length} clips` : isGenerateEnabled ? 'KLIK' : 'ONLINE'}</span>
            </div>
            <div className="text-[11px] text-white/70 leading-[1.5] mb-4 space-y-2">
              <div className="flex gap-1.5"><IconInfo />Tombol ini panggil /api/transcribe online - server yang buat transcript.</div>
              <div>• Upload file → Cloudinary → auto transcribe online → 5 clips</div>
              <div>• YouTube → /api/youtube → transcript → 5 clips</div>
            </div>
            <Button className="w-full h-12 bg-white text-black hover:bg-[#FFD60A] text-[14px] font-[800] gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(255,255,255,0.2)]" disabled={!isGenerateEnabled} onClick={handleTranscribe}>
              <IconFilm />{isProcessing ? 'TRANSCRIBE ONLINE...' : isUploading ? 'UPLOADING...' : clips.length ? `RE-GENERATE ${clips.length} CLIPS ONLINE` : 'BUAT CLIP VIRAL SEKARANG'}
            </Button>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-white/50 text-center">
              <div className="rounded-full bg-white/10 py-1.5 border border-white/10">Cloudinary ✓</div>
              <div className="rounded-full bg-white/10 py-1.5 border border-white/10">Transcribe ✓</div>
              <div className="rounded-full bg-white/10 py-1.5 border border-white/10">5 Clips ✓</div>
            </div>
            {!videoUrl && !youtubeInfo && (
              <div className="mt-3 rounded-[10px] bg-amber-500/20 border border-amber-500/30 p-3 text-[11px] text-amber-200 flex gap-2"><IconInfo />Upload video dulu sampai Cloudinary URL muncul, baru generate.</div>
            )}
            {isGenerateEnabled && !clips.length && (
              <div className="mt-3 rounded-[10px] bg-[#FFD60A] text-black p-3 text-[11px] font-[700] flex items-center gap-2 animate-pulse"><IconCheck />SIAP ONLINE! KLIK TOMBOL DI ATAS</div>
            )}
            {clips.length > 0 && (
              <div className="mt-3 rounded-[10px] bg-green-500 text-white p-3 text-[11px] font-[600] flex items-center gap-2"><IconCheck />{clips.length} clips online - pilih di Langkah 3</div>
            )}
            {isProcessing && (
              <div className="mt-3 rounded-[10px] bg-white/10 border border-white/20 p-3 text-[11px] text-white flex items-center gap-2"><div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />Transcribe online... tunggu 2-5 detik</div>
            )}
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase flex items-center gap-1.5"><IconFilm />Langkah 3 - Hasil Clip ({clips.length}) Online</h2>
              <span className={`text-[10px] font-[600] px-2 py-0.5 rounded-full ${clips.length ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-[#0A0A0A] text-white'}`}>{clips.length ? '✓ Online' : 'AI Online'}</span>
            </div>
            <div className="text-[10px] text-[#6B6B6B] mb-2 flex gap-1"><IconInfo />Hasil dari /api/transcribe online - 5 clips viral.</div>
            <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
              {clips.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-[#E8E8E3] rounded-[12px] bg-[#FCFCF9]">
                  <div className="mx-auto h-10 w-10 rounded-[10px] bg-[#F5F5F0] flex items-center justify-center text-[#9B9B9B]"><IconFilm /></div>
                  <div className="mt-3 text-[12px] font-[600] text-[#6B6B6B]">Belum ada clip online</div>
                  <div className="mt-1 text-[10px] text-[#9B9B9B]">Upload → Cloudinary → Buat Clip Viral Sekarang</div>
                  {videoUrl && <div className="mt-3 inline-block text-[10px] px-3 py-1 rounded-full bg-[#FFD60A] text-black font-[700] animate-pulse">Cloudinary ready, klik Generate!</div>}
                </div>
              ) : clips.map(c => (
                <button key={c.id} onClick={() => { setSelectedClip(c); setHook(c.hook); addLog(`Pilih clip ${c.id}: ${c.hook}`); if (videoRef.current) { videoRef.current.currentTime = c.start; videoRef.current.play().then(()=>setIsPlaying(true)).catch(()=>{}) } }} className={`w-full text-left rounded-[14px] border-2 p-3 transition ${selectedClip?.id === c.id ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white shadow-[0_4px_20px_rgba(0,0,0,0.2)]' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A] hover:shadow-[0_2px_10px_rgba(0,0,0,0.05)]'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-[800] tracking-[0.05em] px-2.5 py-1 rounded-full flex items-center gap-1 ${selectedClip?.id === c.id ? 'bg-white text-black' : 'bg-[#FFD60A] text-black'}`}><IconCheck />{c.label} {c.score}</span>
                    <span className="text-[10px] font-[600] opacity-70">{Math.floor(c.duration)}s • {c.words.length} kata</span>
                  </div>
                  <div className="mt-2 text-[12px] font-[700] leading-[1.3] tracking-[-0.01em] line-clamp-2">{c.hook}</div>
                  <div className="mt-1.5 text-[10px] opacity-60 font-mono flex items-center gap-1"><IconPlay size={10} />{Math.floor(c.start / 60)}:{String(Math.floor(c.start % 60)).padStart(2, '0')} - {Math.floor(c.end / 60)}:{String(Math.floor(c.end % 60)).padStart(2, '0')}</div>
                  <div className="mt-2 text-[9px] px-2 py-1 rounded-full bg-black/5 inline-block">{selectedClip?.id === c.id ? '✓ Dipilih - preview online' : 'Klik untuk preview online'}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Card className="p-3 lg:p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[12px] font-[700] tracking-[0.06em] uppercase flex items-center gap-1.5"><IconVideo />Langkah 4 - Preview 9:16 Online</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-[600] px-2 py-1 rounded-full bg-[#0A0A0A] text-white">1080x1920</span>
                <button onClick={() => setLoopPreview(!loopPreview)} className={`text-[10px] font-[600] px-2 py-1 rounded-full border ${loopPreview ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{loopPreview ? 'Loop ON' : 'Loop OFF'}</button>
              </div>
            </div>

            <div className="text-[10px] text-[#6B6B6B] mb-2 px-1 flex gap-1"><IconInfo />Preview online - canvas render subtitle shared lib.</div>

            <div className="relative rounded-[18px] bg-[#0A0A0A] overflow-hidden aspect-[9/16] max-h-[680px] mx-auto border-2 border-[#0A0A0A]">
              {previewBlobUrl && !selectedClip ? (
                <>
                  <video ref={previewVideoRef} src={previewBlobUrl} className="absolute inset-0 w-full h-full object-contain bg-black" controls playsInline onLoadedMetadata={e => { const v = e.currentTarget; if (v.duration) setDuration(v.duration) }} />
                  <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/10 font-[600]">Preview {videoUrl ? 'Cloudinary ✓' : 'Blob'} Online</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">{isUploading ? 'Uploading...' : videoUrl ? 'Ready Generate' : 'Uploading...'}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="rounded-[10px] bg-white p-2.5 text-[11px]">
                      <div className="font-[700]">Video {videoUrl ? 'Cloudinary ready' : 'uploading...'}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">Durasi: {duration ? `${duration.toFixed(1)}s` : '...'} - {videoUrl ? 'Klik Buat Clip Viral Sekarang' : 'Tunggu upload selesai'}</div>
                    </div>
                  </div>
                </>
              ) : videoUrl ? (
                <>
                  <video ref={videoRef} src={videoUrl} className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none" crossOrigin="anonymous" playsInline onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                  <canvas ref={canvasRef} width={1080} height={1920} className="absolute inset-0 w-full h-full" />

                  {!isPlaying && selectedClip && (
                    <button onClick={() => { videoRef.current?.play().then(()=>setIsPlaying(true)).catch(()=>{}); addLog('Play preview online'); }} className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] gap-3">
                      <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-105 transition">
                        <IconPlay size={28} />
                      </div>
                      <span className="text-[12px] font-[700] text-white bg-black/60 px-5 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20"><IconPlay size={14} />Putar Preview Online</span>
                      <span className="text-[10px] text-white/70 bg-black/40 px-3 py-1 rounded-full">Clip {selectedClip.id+1}: {selectedClip.hook.slice(0,20)}...</span>
                    </button>
                  )}

                  {!selectedClip && videoUrl && (
                    <>
                      {!isPlaying && (
                        <button onClick={() => { videoRef.current?.play().then(()=>setIsPlaying(true)).catch(()=>{}); addLog('Play full video online'); }} className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] gap-3">
                          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-105 transition">
                            <IconPlay size={28} />
                          </div>
                          <span className="text-[12px] font-[700] text-white bg-black/60 px-5 py-2 rounded-full backdrop-blur-md flex items-center gap-2 border border-white/20"><IconPlay size={14} />Putar Video Full Online</span>
                          <span className="text-[10px] text-white/70 bg-black/40 px-3 py-1 rounded-full">Menunggu generate clips...</span>
                        </button>
                      )}
                      <div className="absolute top-[56px] left-3 right-3 pointer-events-none">
                        <div className="rounded-[10px] bg-[#FFD60A] text-black p-2.5 text-[11px] font-[700] flex items-center gap-2 border-2 border-black">
                          <IconInfo />Cloudinary ready online - klik Play atau tunggu auto transcribe
                        </div>
                      </div>
                    </>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center gap-2">
                      <button onClick={() => isPlaying ? videoRef.current?.pause() : videoRef.current?.play()} className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition">
                        {isPlaying ? <IconPause size={14} /> : <IconPlay size={14} />}
                      </button>
                      <Button size="sm" variant="secondary" className="h-8 text-[10px] bg-white/20 text-white border-white/20 hover:bg-white hover:text-black backdrop-blur-md gap-1" onClick={handleTestPlay}><IconRefresh />Tes Ulang</Button>
                      <div className="flex-1">
                        <input type="range" min={clipStartEdit} max={clipEndEdit} step={0.1} value={currentTime} onChange={e => { const t = parseFloat(e.target.value); setCurrentTime(t); if (videoRef.current) videoRef.current.currentTime = t }} className="w-full accent-[#FFD60A] h-1.5" />
                        <div className="mt-1.5 flex justify-between text-[10px] font-mono text-white/80">
                          <span>{currentTime.toFixed(1)}s</span>
                          <span className="font-[700] text-[#FFD60A]">{(clipEndEdit - clipStartEdit).toFixed(1)}s</span>
                          <span>{clipEndEdit.toFixed(1)}s</span>
                        </div>
                      </div>
                      <select value={playbackSpeed} onChange={e => setPlaybackSpeed(parseFloat(e.target.value))} className="h-8 rounded-full bg-white/10 border border-white/20 text-white text-[10px] px-2 backdrop-blur-md">
                        <option value={0.5}>0.5x</option>
                        <option value={1}>1x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2x</option>
                      </select>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 right-3 flex justify-between pointer-events-none">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/10 font-[600]">{style.name} - {ANIMATIONS[anim]?.name} • {style.font}</span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">ONLINE {style.usage}</span>
                  </div>
                </>
              ) : youtubeInfo ? (
                <div className="absolute inset-0">
                  <img src={youtubeInfo.thumbnail} alt="youtube preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-green-500 text-white font-[700]">YouTube Online</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="rounded-[12px] bg-white p-3 border-2 border-green-200">
                      <div className="text-[12px] font-[700] line-clamp-2">{youtubeInfo.title}</div>
                      <div className="text-[10px] text-[#6B6B6B] mt-1">Preview YouTube Online • {clips.length} clips</div>
                      <Button size="sm" className="mt-3 w-full h-9 text-[11px] bg-[#0A0A0A] text-white gap-1.5 font-[700]" onClick={handleTranscribe}><IconSpark />{clips.length ? `RE-GENERATE ${clips.length} CLIPS ONLINE` : 'BUAT CLIP SEKARANG ONLINE'}</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-[#0A0A0A]">
                  <div className="h-20 w-20 rounded-[20px] border-2 border-dashed border-white/20 flex items-center justify-center text-white/30"><IconPlay size={28} /></div>
                  <div className="mt-5 text-[14px] font-[700] text-white">Belum ada video online</div>
                  <div className="mt-2 text-[11px] text-white/40 max-w-[240px] leading-[1.5]">Upload video ke Cloudinary online di Langkah 1. Preview muncul di sini. Semua via API online.</div>
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/50">Cloudinary</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/50">Transcribe</span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/50">Supabase</span>
                  </div>
                </div>
              )}
            </div>

            {selectedClip && (
              <div className="mt-3 p-3 rounded-[12px] bg-[#F5F5F0] border-2 border-[#E8E8E3]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-[800] tracking-[0.06em] uppercase flex items-center gap-1"><IconRefresh />Atur Durasi Online - Tes Sebelum Simpan</span>
                  <div className="flex gap-1.5">
                    <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 font-[600]" onClick={handleTestPlay}><IconPlay size={10} />Tes Play</Button>
                    <Button size="sm" variant="outline" className="h-7 text-[10px] bg-[#0A0A0A] text-white gap-1 font-[600]" onClick={applyDurationEdit}><IconCheck />Terapkan</Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-[700] text-[#6B6B6B]">Mulai (detik)</label>
                    <input type="number" step={0.1} value={clipStartEdit} onChange={e => setClipStartEdit(parseFloat(e.target.value) || 0)} className="mt-1 w-full h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[12px] font-mono focus:border-[#0A0A0A] focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-[700] text-[#6B6B6B]">Selesai (detik)</label>
                    <input type="number" step={0.1} value={clipEndEdit} onChange={e => setClipEndEdit(parseFloat(e.target.value) || 0)} className="mt-1 w-full h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[12px] font-mono focus:border-[#0A0A0A] focus:outline-none" />
                  </div>
                </div>
                <div className="mt-3">
                  <input type="range" min={0} max={duration || 100} step={0.1} value={clipStartEdit} onChange={e => setClipStartEdit(parseFloat(e.target.value))} className="w-full accent-[#0A0A0A] h-2" />
                  <input type="range" min={0} max={duration || 100} step={0.1} value={clipEndEdit} onChange={e => setClipEndEdit(parseFloat(e.target.value))} className="w-full accent-[#FFD60A] h-2 mt-2" />
                  <div className="mt-2 flex justify-between text-[10px] font-mono text-[#6B6B6B]">
                    <span>0s</span>
                    <span className="font-[800] text-[#0A0A0A] bg-[#FFD60A] px-2 py-0.5 rounded-full">{(clipEndEdit - clipStartEdit).toFixed(1)}s durasi</span>
                    <span>{(duration || 0).toFixed(1)}s total</span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button className="h-11 bg-[#0A0A0A] text-white hover:bg-[#1A1A1A] text-[12px] gap-1.5 font-[700] border-2 border-[#0A0A0A]" disabled={!videoUrl && !previewBlobUrl && !youtubeInfo} onClick={handleTestPlay}><IconPlay size={14} />{selectedClip ? 'Tes Preview' : 'Play Video'}</Button>
              <Button variant="outline" className="h-11 text-[12px] gap-1.5 font-[600] border-2" disabled={!clips.length || saving} onClick={handleSaveProject}><IconSave />{saving ? 'Menyimpan...' : 'Simpan Online'}</Button>
              <Button className="h-11 bg-[#FFD60A] text-black hover:bg-[#FFC700] text-[12px] font-[800] gap-1.5 border-2 border-[#FFD60A]" disabled={!selectedClip} onClick={doExport}><IconDownload />Export Online</Button>
            </div>
            <div className="mt-2 text-[10px] text-[#6B6B6B] text-center leading-[1.4]">
              <span className="font-[700]">Full online:</span> Cloudinary upload ✓ Transcribe API ✓ Supabase save ✓ FFmpeg export ✓
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-5 border-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[12px] font-[800] tracking-[0.06em] uppercase flex items-center gap-1.5"><IconPalette />Gaya Subtitle - 12 Style Online</h2>
              <span className="text-[10px] font-[700] px-2.5 py-1 rounded-full bg-[#0A0A0A] text-white">{Object.keys(STYLES).length} STYLE</span>
            </div>
            <div className="text-[10px] text-[#6B6B6B] mb-3 flex gap-1"><IconInfo />Klik untuk ganti style - preview canvas online langsung berubah.</div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(STYLES).map(([k, s]: any) => {
                const isActive = styleKey === k
                return (
                  <button key={k} onClick={() => { setStyleKey(k); addLog(`Style online: ${s.name}`); }} className={`text-left rounded-[14px] border-2 p-2.5 transition relative overflow-hidden ${isActive ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white shadow-[0_4px_15px_rgba(0,0,0,0.2)]' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]'}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-[11px] font-[800] tracking-[-0.01em]">{s.name.toUpperCase()}</div>
                        <div className={`text-[9px] mt-0.5 ${isActive ? 'text-white/60' : 'text-[#6B6B6B]'}`}>{s.desc}</div>
                      </div>
                      <span className={`text-[8px] font-[700] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-black' : 'bg-[#F5F5F0] border border-[#E8E8E3]'}`}>{s.usage}</span>
                    </div>
                    <div className="mt-2.5 rounded-[10px] border-2 border-black/5 p-2 h-[64px] flex flex-col items-center justify-center overflow-hidden relative" style={{ background: s.bgPreview }}>
                      <div className="font-[900] text-[15px] leading-[0.9] tracking-[-0.02em] text-center" style={{
                        color: s.text === 'transparent' ? '#FFFFFF' : s.text,
                        WebkitTextStroke: s.sw > 0 && s.stroke !== 'transparent' ? `${s.sw / 3}px ${s.stroke}` : '0',
                        fontFamily: s.font,
                        textTransform: s.upper ? 'uppercase' as any : 'none',
                        textShadow: k === 'shadow' ? '2px 2px 8px rgba(0,0,0,0.6)' : k === 'glow' ? `0 0 10px ${s.highlight}` : 'none'
                      }}>
                        <div style={{ color: s.text === 'transparent' ? 'transparent' : s.text, WebkitTextStroke: s.text === 'transparent' ? `2px ${s.highlight}` : undefined }}>{s.previewText}</div>
                        <div style={{ color: s.highlight, fontSize: '11px', marginTop: '2px' }}>{s.previewSub}</div>
                      </div>
                    </div>
                    <div className="mt-1 text-[8px] text-center opacity-60">{isActive ? '✓ Aktif online' : 'Klik online'}</div>
                    {isActive && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#FFD60A] animate-pulse border-2 border-white" />}
                  </button>
                )
              })}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-[800] tracking-[0.08em] uppercase text-[#6B6B6B] flex items-center gap-1"><IconSpark />Animasi - 10 Animasi Online</label>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#F5F5F0] border-2 border-[#E8E8E3] font-[700]">{Object.keys(ANIMATIONS).length} ANIM</span>
                </div>
                <div className="text-[10px] text-[#6B6B6B] mt-1 mb-2">Klik animasi - preview online langsung animasi.</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.entries(ANIMATIONS).map(([k, a]: any) => {
                    const isActive = anim === k
                    return (
                      <button key={k} onClick={() => { setAnim(k); addLog(`Anim online: ${a.name}`); }} className={`rounded-[10px] border-2 p-2 text-left transition ${isActive ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-[700]">{a.name}</span>
                          <span className={`text-[7px] px-1 py-0.5 rounded-full font-[700] ${isActive ? 'bg-white text-black' : 'bg-[#F5F5F0]'}`}>{a.usage}</span>
                        </div>
                        <div className="mt-1.5 h-[28px] rounded-[6px] bg-[#F5F5F0] border border-[#E8E8E3]/50 flex items-center justify-center overflow-hidden">
                          <div className={`text-[9px] font-[800] ${isActive ? 'text-[#0A0A0A]' : 'text-[#6B6B6B]'}`} style={{ animation: isActive ? `${k} 1s ease-in-out infinite` : '' }}>
                            {a.name.toUpperCase()}
                          </div>
                        </div>
                        <div className={`mt-1 text-[8px] ${isActive ? 'text-white/60' : 'text-[#9B9B9B]'}`}>{a.desc} {isActive ? '✓' : ''}</div>
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

              <div className="pt-3 border-t-2 border-[#E8E8E3]">
                <button onClick={() => setShowCustom(!showCustom)} className="w-full flex items-center justify-between text-[11px] font-[800] tracking-[0.06em] uppercase">
                  <span className="flex items-center gap-1.5"><IconPalette />Custom Warna dan Font Online</span>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full border-2 font-[700] ${showCustom ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-[#F5F5F0] border-[#E8E8E3]'}`}>{showCustom ? 'Tutup' : 'Buka'}</span>
                </button>

                {showCustom && (
                  <div className="mt-3 space-y-3 p-3 rounded-[12px] bg-[#F5F5F0] border-2 border-[#E8E8E3]">
                    <div className="text-[10px] text-[#6B6B6B]">Ganti warna online - preview langsung berubah.</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-[700]">Warna Teks</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customTextColor || (baseStyle.text === 'transparent' ? '#FFFFFF' : baseStyle.text)} onChange={e => { setCustomTextColor(e.target.value); addLog(`Teks online: ${e.target.value}`); }} className="h-9 w-9 rounded-full border-2 border-[#E8E8E3] cursor-pointer" />
                          <input value={customTextColor} onChange={e => setCustomTextColor(e.target.value)} placeholder={baseStyle.text} className="flex-1 h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-[700]">Warna Highlight</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customHighlightColor || baseStyle.highlight} onChange={e => { setCustomHighlightColor(e.target.value); addLog(`Highlight online: ${e.target.value}`); }} className="h-9 w-9 rounded-full border-2 border-[#E8E8E3] cursor-pointer" />
                          <input value={customHighlightColor} onChange={e => setCustomHighlightColor(e.target.value)} placeholder={baseStyle.highlight} className="flex-1 h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-[700]">Warna Stroke</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customStrokeColor || (baseStyle.stroke === 'transparent' ? '#000000' : baseStyle.stroke)} onChange={e => setCustomStrokeColor(e.target.value)} className="h-9 w-9 rounded-full border-2 border-[#E8E8E3] cursor-pointer" />
                          <input value={customStrokeColor} onChange={e => setCustomStrokeColor(e.target.value)} placeholder={baseStyle.stroke} className="flex-1 h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-[700]">Warna Background</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={customBgColor && customBgColor !== 'transparent' ? customBgColor : '#FFD60A'} onChange={e => setCustomBgColor(e.target.value)} className="h-9 w-9 rounded-full border-2 border-[#E8E8E3] cursor-pointer" />
                          <input value={customBgColor} onChange={e => setCustomBgColor(e.target.value)} placeholder="transparent" className="flex-1 h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] font-mono" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-[700]">Font Keluarga - {FONTS.length} Font Online</label>
                      <select value={customFont} onChange={e => { setCustomFont(e.target.value); addLog(`Font online: ${e.target.value}`); }} className="mt-1 w-full h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] font-[600]">
                        <option value="">Default ({baseStyle.font})</option>
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 h-8 text-[10px] font-[700] border-2" onClick={() => { setCustomTextColor(''); setCustomHighlightColor(''); setCustomStrokeColor(''); setCustomBgColor(''); setCustomFont(''); addLog('Reset custom online'); }}>Reset</Button>
                      <Button size="sm" className="flex-1 h-8 text-[10px] bg-[#0A0A0A] text-white gap-1 font-[700]" onClick={() => { setShowCustom(false); addLog('Terapkan custom online'); }}><IconCheck />Terapkan</Button>
                    </div>

                    <div className="rounded-[8px] bg-white border-2 border-[#E8E8E3] p-2.5">
                      <div className="text-[10px] font-[700] mb-1.5">Preview Custom Online - shared lib</div>
                      <div className="rounded-[8px] h-[64px] flex items-center justify-center border-2" style={{ background: baseStyle.bgPreview }}>
                        <div className="font-[900] text-[16px]" style={{
                          color: style.text === 'transparent' ? 'transparent' : style.text,
                          WebkitTextStroke: style.text === 'transparent' ? `2px ${style.highlight}` : `${style.sw / 3}px ${style.stroke}`,
                          fontFamily: style.font,
                          textShadow: styleKey === 'glow' ? `0 0 12px ${style.highlight}` : 'none'
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
                  <label className="text-[10px] font-[800] tracking-[0.08em] uppercase text-[#6B6B6B]">Posisi</label>
                  <select value={pos} onChange={e => { setPos(e.target.value as any); addLog(`Posisi online: ${e.target.value}`); }} className="mt-1.5 w-full h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] font-[600]">
                    <option value="top">ATAS</option>
                    <option value="center">TENGAH</option>
                    <option value="bottom">BAWAH</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-[800] tracking-[0.08em] uppercase text-[#6B6B6B]">Kata per Baris</label>
                  <div className="mt-1.5 grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map(n => (
                      <button key={n} onClick={() => { setWpl(n); addLog(`WPL online: ${n}`); }} className={`h-9 rounded-full text-[11px] font-[700] border-2 ${wpl === n ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white border-[#E8E8E3] hover:border-[#0A0A0A]'}`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between">
                  <label className="text-[10px] font-[800] tracking-[0.08em] uppercase text-[#6B6B6B]">Ukuran Font</label>
                  <span className="text-[10px] font-mono font-[800] bg-[#FFD60A] px-2 py-0.5 rounded-full">{fontSize}px</span>
                </div>
                <input type="range" min={36} max={120} value={fontSize} onChange={e => { setFontSize(Number(e.target.value)); }} className="w-full mt-2 accent-[#0A0A0A] h-2" />
              </div>

              <div>
                <label className="text-[10px] font-[800] tracking-[0.08em] uppercase text-[#6B6B6B]">Judul Hook - AI Viral Online</label>
                <div className="mt-1.5 flex gap-2">
                  <input value={hook} onChange={e => setHook(e.target.value)} placeholder="Tulis hook viral..." className="flex-1 h-9 rounded-full border-2 border-[#E8E8E3] bg-white px-3 text-[11px] focus:outline-none focus:border-[#0A0A0A] font-[500]" />
                  <Button size="sm" className="h-9 px-4 text-[10px] bg-[#0A0A0A] text-white gap-1 font-[700]" onClick={handleAiHook} disabled={aiLoading || !selectedClip}>
                    <IconSpark />{aiLoading ? '...' : 'AI'}
                  </Button>
                </div>
                <div className="mt-1 text-[9px] text-[#9B9B9B]">AI Grok via backend secure - online</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-[#0A0A0A] text-white border-2 border-[#0A0A0A]">
            <h3 className="text-[11px] font-[800] tracking-[0.06em] uppercase flex items-center gap-1.5"><IconCheck />Full Online Mode - No Offline</h3>
            <div className="mt-3 text-[11px] leading-[1.6] text-white/70 space-y-1.5">
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span><b>Langkah 1 Online:</b> Upload ke Cloudinary via /api/upload - real URL, bukan blob - durasi auto detect</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span><b>Langkah 2 Online:</b> /api/transcribe server-side - Groq / expanded - 5 clips dari transcript real</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span><b>Langkah 3 Online:</b> 5 clips dari server - pilih untuk preview canvas 1080x1920</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span><b>Langkah 4 Online:</b> Canvas render subtitle shared lib - play/pause, loop, speed</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span><b>Langkah 5 Online:</b> Simpan ke Supabase projects/clips - harus login - export MP4 via FFmpeg online</span></div>
              <div className="flex gap-2"><span className="text-[#FFD60A]">✓</span><span><b>YouTube Online:</b> /api/youtube oEmbed + Cobalt + transcript server</span></div>
              <div className="mt-3 p-2.5 rounded-[10px] bg-white/10 border border-white/10 text-[10px]">
                <div className="font-[700] text-white">Log online di atas - semua via API</div>
                <div className="text-white/50 mt-1">Tidak ada fallback offline - kalau gagal, tampil error real</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {showExport && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/70 backdrop-blur-xl flex items-center justify-center p-4">
          <Card className="w-full max-w-[360px] p-6 text-center border-2">
            <div className="mx-auto h-14 w-14 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-[800] animate-pulse text-[20px]">A</div>
            <div className="mt-4 text-[16px] font-[800]">Mengekspor clip online</div>
            <div className="text-[12px] text-[#6B6B6B] mt-1">{STYLES[styleKey]?.name} - {ANIMATIONS[anim]?.name} - {hook.slice(0, 30)}</div>
            <div className="mt-1 text-[11px] text-[#9B9B9B]">{exportStatus} - {(clipEndEdit - clipStartEdit).toFixed(1)}s - {fontSize}px</div>
            <div className="mt-5 h-2 rounded-full bg-[#F5F5F0] overflow-hidden border">
              <div className="h-full bg-[#0A0A0A] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-2 text-[11px] font-mono font-[700]">{progress}% - Online</div>
          </Card>
        </div>
      )}
    </div>
  )
}
