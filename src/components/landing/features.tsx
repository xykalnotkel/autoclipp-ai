"use client"

export function Features({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'

  const features = isId ? [
    {
      title: "Auto Transkrip",
      description: "Word-level timestamp, 99 bahasa. Transkrip cepat dan akurat untuk video apapun.",
      stat: "99%",
      detail: "akurasi"
    },
    {
      title: "Deteksi Viral",
      description: "AI scoring setiap momen. Temukan hook, pertanyaan, angka, puncak emosi otomatis.",
      stat: "94%",
      detail: "viral rate"
    },
    {
      title: "Smart Crop",
      description: "Face tracking jaga subjek tetap center di 9:16 otomatis. Tanpa keyframing manual.",
      stat: "Auto",
      detail: "centering"
    },
    {
      title: "Subtitle Animasi",
      description: "6 style, 6 animasi. Bisa custom font, warna, posisi sepenuhnya.",
      stat: "6",
      detail: "style"
    },
    {
      title: "Export Instan",
      description: "Export clip 1080x1920 60fps siap posting. Tanpa watermark, tanpa menunggu.",
      stat: "60",
      detail: "fps"
    },
    {
      title: "Manajemen Project",
      description: "Atur semua clip, search, filter, dan bulk export konten viral kamu.",
      stat: "∞",
      detail: "project"
    }
  ] : [
    {
      title: "Auto Transcribe",
      description: "Word-level timestamps, 99 languages supported. Fast and accurate transcription for any video.",
      stat: "99%",
      detail: "accuracy"
    },
    {
      title: "Viral Detection",
      description: "AI scores every moment. Finds hooks, questions, numbers, emotional peaks automatically.",
      stat: "94%",
      detail: "viral rate"
    },
    {
      title: "Smart Crop",
      description: "Face tracking keeps subject centered in 9:16 automatically. No manual keyframing needed.",
      stat: "Auto",
      detail: "centering"
    },
    {
      title: "Animated Subtitles",
      description: "6 styles, 6 animations. Fully customizable fonts, colors, and positioning.",
      stat: "6",
      detail: "styles"
    },
    {
      title: "Instant Export",
      description: "Export ready-to-post clips in 1080x1920 60fps. No watermark, no waiting.",
      stat: "60",
      detail: "fps"
    },
    {
      title: "Project Management",
      description: "Organize all your clips, search, filter, and bulk export your viral content.",
      stat: "∞",
      detail: "projects"
    }
  ]

  return (
    <section id="features" className="border-t border-[#E8E8E3] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-[640px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F0] px-3 py-1 text-[11px] font-[650] tracking-[0.04em] uppercase">
            {isId ? 'Fitur' : 'Features'}
          </div>
          <h2 className="mt-4 text-[32px] lg:text-[40px] font-[700] leading-[1.05] tracking-[-0.03em]">
            {isId ? 'Semua yang kamu butuh untuk viral.' : 'Everything you need to go viral.'}
            <br />
            <span className="text-[#6B6B6B]">{isId ? 'Tidak ada yang tidak perlu.' : 'Nothing you dont.'}</span>
          </h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#6B6B6B]">
            {isId ? 'Dibuat untuk kreator yang upload harian. Tanpa timeline kompleks, tanpa learning curve.' : 'Built for creators who ship daily. No complex timelines, no learning curve. Just upload and get clips that convert.'}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8E8E3] rounded-[24px] overflow-hidden border border-[#E8E8E3]">
          {features.map((f, i) => (
            <div key={i} className="bg-[#FCFCF9] p-8 group hover:bg-white transition-colors">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center text-[13px] font-[700]">
                  {String(i+1).padStart(2, '0')}
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-[700] tracking-[-0.01em]">{f.stat}</div>
                  <div className="text-[10px] font-[500] text-[#6B6B6B] tracking-[0.02em]">{f.detail}</div>
                </div>
              </div>
              <h3 className="mt-6 text-[16px] font-[650] tracking-[-0.02em]">{f.title}</h3>
              <p className="mt-2 text-[13px] leading-[1.5] text-[#6B6B6B]">{f.description}</p>
              <div className="mt-6 h-px w-full bg-[#E8E8E3] group-hover:bg-[#0A0A0A] transition-colors" />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] border border-[#E8E8E3] bg-[#0A0A0A] p-8 lg:p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_top_right,_rgba(255,214,10,0.15),transparent_60%)] pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-[20px] font-[700] tracking-[-0.02em]">{isId ? 'Siap viral hari ini?' : 'Ready to go viral today?'}</h3>
              <p className="mt-2 text-[13px] text-white/60 max-w-[420px]">{isId ? 'Gratis selamanya, tanpa watermark, tanpa kartu kredit. Mulai buat clip viral dalam detik.' : 'Free forever, no watermark, no credit card. Start creating viral clips in seconds.'}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-[11px] text-white/60 hidden lg:block">{isId ? 'Dibuat oleh' : 'Made by'} XySpace • {isId ? 'Tanpa watermark' : 'No watermark'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
