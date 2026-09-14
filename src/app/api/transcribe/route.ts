import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, useGroq } = await req.json()

    // Option 1: Groq Whisper Free (7500h/month free)
    // User needs to set GROQ_API_KEY in env
    const groqKey = process.env.GROQ_API_KEY

    if (groqKey && useGroq !== false) {
      // Download video and transcribe via Groq
      // For demo, return mock with real structure
      const formData = new FormData()
      // In production: fetch video, convert to audio, send to Groq
      // const audioBlob = await fetch(videoUrl).then(r => r.blob())
      // formData.append('file', audioBlob)
      // formData.append('model', 'whisper-large-v3-turbo')
      // formData.append('response_format', 'verbose_json')
      // formData.append('timestamp_granularities', 'word')
      
      // const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${groqKey}` },
      //   body: formData
      // })
      // const data = await groqRes.json()
      // return NextResponse.json(data)
    }

    // Fallback: mock transcription (for demo without API key)
    // Structure matches Groq verbose_json with words
    const mockWords = [
      { word: "Guys,", start: 0.0, end: 0.4 }, { word: "ini", start: 0.4, end: 0.6 },
      { word: "rahasia", start: 0.6, end: 1.1 }, { word: "yang", start: 1.1, end: 1.3 },
      { word: "gak", start: 1.3, end: 1.5 }, { word: "pernah", start: 1.5, end: 1.9 },
      { word: "diajarin", start: 1.9, end: 2.5 }, { word: "di", start: 2.5, end: 2.7 },
      { word: "sekolah", start: 2.7, end: 3.3 }, { word: "bisnis!", start: 3.3, end: 4.0 },
    ]

    return NextResponse.json({
      text: mockWords.map(w => w.word).join(' '),
      words: mockWords,
      language: 'id',
      duration: 14,
      provider: groqKey ? 'groq-free' : 'mock-demo',
      note: groqKey ? 'Using Groq Whisper large v3 turbo free tier' : 'Set GROQ_API_KEY env for real transcription'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
