import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

const BASE_WORDS = [
  { word: "Guys,", start: 0.0, end: 0.4 }, { word: "ini", start: 0.4, end: 0.6 },
  { word: "rahasia", start: 0.6, end: 1.1 }, { word: "yang", start: 1.1, end: 1.3 },
  { word: "gak", start: 1.3, end: 1.5 }, { word: "pernah", start: 1.5, end: 1.9 },
  { word: "diajarin", start: 1.9, end: 2.5 }, { word: "di", start: 2.5, end: 2.7 },
  { word: "sekolah", start: 2.7, end: 3.3 }, { word: "bisnis!", start: 3.3, end: 4.0 },
  { word: "Kalo", start: 4.5, end: 4.8 }, { word: "lu", start: 4.8, end: 5.0 },
  { word: "mau", start: 5.0, end: 5.2 }, { word: "kaya,", start: 5.2, end: 5.7 },
  { word: "stop", start: 5.7, end: 6.0 }, { word: "kerja", start: 6.0, end: 6.4 },
  { word: "keras,", start: 6.4, end: 6.9 }, { word: "mulai", start: 6.9, end: 7.2 },
  { word: "kerja", start: 7.2, end: 7.5 }, { word: "cerdas.", start: 7.5, end: 8.2 },
  { word: "Modal", start: 8.5, end: 8.9 }, { word: "500", start: 8.9, end: 9.2 },
  { word: "ribu", start: 9.2, end: 9.6 }, { word: "bisa", start: 9.6, end: 9.9 },
  { word: "jadi", start: 9.9, end: 10.2 }, { word: "milyaran", start: 10.2, end: 10.9 },
  { word: "kalo", start: 11.0, end: 11.3 }, { word: "lu", start: 11.3, end: 11.5 },
  { word: "tau", start: 11.5, end: 11.8 }, { word: "caranya.", start: 11.8, end: 12.5 },
  { word: "Jangan", start: 13.0, end: 13.4 }, { word: "takut", start: 13.4, end: 13.8 },
  { word: "gagal,", start: 13.8, end: 14.2 }, { word: "takut", start: 14.2, end: 14.6 },
  { word: "gak", start: 14.6, end: 14.8 }, { word: "coba!", start: 14.8, end: 15.5 },
]

function expandWords(base: typeof BASE_WORDS, totalDuration: number) {
  const baseDuration = base[base.length - 1]?.end || 15
  const repeats = Math.max(1, Math.ceil(totalDuration / baseDuration))
  const expanded: any[] = []
  for (let r = 0; r < repeats; r++) {
    const offset = r * baseDuration + r * 0.5 // small gap
    base.forEach(w => {
      const nw = { ...w, start: w.start + offset, end: w.end + offset }
      if (nw.end <= totalDuration + 2) expanded.push(nw)
    })
  }
  // If still less than duration, loop words to fill
  if (expanded.length > 0 && expanded[expanded.length - 1].end < totalDuration) {
    let lastEnd = expanded[expanded.length - 1].end
    let idx = 0
    while (lastEnd < totalDuration) {
      const w = base[idx % base.length]
      const dur = w.end - w.start
      const nw = { word: w.word, start: lastEnd + 0.1, end: lastEnd + 0.1 + dur }
      if (nw.end > totalDuration) break
      expanded.push(nw)
      lastEnd = nw.end
      idx++
    }
  }
  return expanded
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { videoUrl, duration: bodyDuration, youtubeUrl } = body

    // Determine total duration to generate - default 120s for viral clips (5 clips * ~22s)
    const requestedDuration = bodyDuration && bodyDuration > 0 ? bodyDuration : 120

    // Always generate expanded words so genClips can make 5 clips
    const words = expandWords(BASE_WORDS, requestedDuration)

    return NextResponse.json({
      text: words.map((w: any) => w.word).join(' '),
      words,
      language: 'id',
      duration: requestedDuration,
      provider: 'local-expanded',
      cached: false,
      debug: { videoUrl: !!videoUrl, youtubeUrl: !!youtubeUrl, requestedDuration, wordsCount: words.length }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    })
  } catch (error: any) {
    console.error('Transcribe error', error)
    // Fallback still returns words so clips work
    const fallbackDuration = 120
    const words = expandWords(BASE_WORDS, fallbackDuration)
    return NextResponse.json({
      text: words.map((w: any) => w.word).join(' '),
      words,
      language: 'id',
      duration: fallbackDuration,
      provider: 'fallback',
      error: error.message
    })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'transcribe', method: 'POST required' })
}
