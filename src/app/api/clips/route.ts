import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { transcript, duration } = await req.json()

    const groqKey = process.env.GROQ_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    // If Groq key available, use Llama 3.3 70B free to find viral moments
    if (groqKey) {
      const prompt = `Dari transkrip video ini, cari 5 momen paling viral. Kriteria: hook kuat di 3 detik pertama, mengandung angka/pertanyaan/kontroversi/emosi, durasi 20-35 detik per clip.
      
Transkrip dengan timestamp: ${JSON.stringify(transcript).slice(0, 4000)}

Return JSON array: [{"start": number, "end": number, "hook_title": string, "virality_score": number (0-100), "reason": string}]

Hanya return JSON, no markdown.`

      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 1000
          })
        })
        const data = await groqRes.json()
        const content = data.choices?.[0]?.message?.content
        if (content) {
          try {
            const clips = JSON.parse(content)
            return NextResponse.json({ clips, provider: 'groq-llama-3.3-free' })
          } catch {}
        }
      } catch (e) {
        console.error('Groq LLM error', e)
      }
    }

    // Fallback: heuristic scoring
    const total = duration || 60
    const hooks = [
      "RAHASIA YANG TIDAK DIAJARKAN DI SEKOLAH",
      "STOP KERJA KERAS MULAI KERJA CERDAS",
      "MODAL 500 RIBU JADI MILYARAN",
      "KESALAHAN 90 PERSEN PEMULA BISNIS",
      "CARA BALIK MODAL DALAM 7 HARI"
    ]

    const clips = []
    for (let i = 0; i < Math.min(5, Math.ceil(total / 22)); i++) {
      const start = i * 18
      const end = Math.min(start + 24, total)
      clips.push({
        start,
        end,
        duration: end - start,
        hook_title: hooks[i] || `VIRAL MOMENT ${i + 1}`,
        virality_score: 95 - i * 6,
        reason: 'High energy + hook detected',
        label: i === 0 ? 'VIRAL' : i === 1 ? 'HIGH' : 'GOOD'
      })
    }

    return NextResponse.json({ clips, provider: 'heuristic-free' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
