import { isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const faqsId = [
  { q: "Apakah AutoClipp AI gratis?", a: "Ya, paket Gratis Rp 0 selamanya dengan 5 project dan 10 clip per bulan. Tanpa watermark. Upgrade mulai Rp 5.000/bulan untuk fitur lebih." },
  { q: "Bagaimana cara kerja deteksi viral?", a: "AI kami menganalisis transkrip video, mencari hook, pertanyaan, angka, puncak emosi, dan momen yang berpotensi viral. Setiap momen diberi skor 0-100, kamu dapat 5 clip terbaik." },
  { q: "Format video apa yang didukung?", a: "MP4, MOV hingga 2GB. Kamu juga bisa paste URL YouTube, kami akan proses otomatis. Export 9:16 1080x1920 60fps siap posting ke TikTok, Reels, Shorts." },
  { q: "Apa saja gaya subtitle yang tersedia?", a: "6 gaya: Hormozi (bold uppercase), MrBeast (colorful), Karaoke (word highlight), Minimal (clean), TikTok (viral style), Editorial (professional). Semua bisa custom font, warna, posisi, animasi." },
  { q: "Bagaimana sistem langganan dan pembayaran?", a: "Pilih paket 5k-100k, checkout, scan QRIS pakai DANA/GoPay/OVO/ShopeePay, bayar sesuai nominal, akses otomatis aktif 30 hari. Mendukung QRIS, DANA, GoPay, OVO, VA BCA/Mandiri/BNI/BRI. Semua verifikasi real." },
  { q: "Apakah rating dan testimoni itu real?", a: "Ya, 100% real dari pengguna asli. Kami tidak pernah membuat review palsu. Kamu bisa lihat rating realtime di homepage dan beri ulasan setelah login. Semua disimpan dan ditampilkan apa adanya." },
  { q: "Apakah ada watermark?", a: "Tidak ada watermark di semua paket, termasuk gratis. Clip kamu bersih siap posting." },
  { q: "Bagaimana dengan privasi video saya?", a: "Video kamu tetap milikmu. Kami tidak menggunakannya untuk training AI tanpa izin. Data kamu aman dan tidak dijual." },
  { q: "Multi bahasa auto deteksi HP?", a: "Ya, otomatis deteksi bahasa HP kamu. Buka autoclipp-ai.vercel.app akan redirect ke /id/ atau /en/ sesuai bahasa. Semua harga, teks, dan konten sudah full translate id dan en." },
  { q: "Siapa yang membuat AutoClipp AI?", a: "Dibuat oleh XySpace untuk kreator Indonesia. Logo monokrom A + play, branding premium simple. Fokus kami adalah membantu kreator, bukan pamer teknologi backend." },
]

const faqsEn = [
  { q: "Is AutoClipp AI free?", a: "Yes, Free plan $0 forever with 5 projects and 10 clips per month. No watermark. Upgrade from $0.32/month for more features." },
  { q: "How does viral detection work?", a: "Our AI analyzes video transcript, finds hooks, questions, numbers, emotional peaks, and viral-potential moments. Each moment scored 0-100, you get top 5 clips." },
  { q: "What video formats are supported?", a: "MP4, MOV up to 2GB. You can also paste YouTube URL, we process automatically. Export 9:16 1080x1920 60fps ready for TikTok, Reels, Shorts." },
  { q: "What subtitle styles are available?", a: "6 styles: Hormozi (bold uppercase), MrBeast (colorful), Karaoke (word highlight), Minimal (clean), TikTok (viral), Editorial (professional). All customizable." },
  { q: "How does subscription and payment work?", a: "Choose plan $0.32-$6.30, checkout, scan QRIS with DANA/GoPay/OVO/ShopeePay, pay exact amount, access auto active 30 days. Supports QRIS, DANA, GoPay, OVO, VA. All real verification." },
  { q: "Are ratings and testimonials real?", a: "Yes, 100% real from genuine users. We never create fake reviews. You can see realtime ratings on homepage and leave review after login. All stored and displayed as is." },
  { q: "Is there watermark?", a: "No watermark on all plans, including free. Your clips clean ready to post." },
  { q: "What about my video privacy?", a: "Your videos remain yours. We don't use them for AI training without permission. Your data safe and not sold." },
  { q: "Multi language auto detect?", a: "Yes, auto detects your phone language. Open autoclipp-ai.vercel.app will redirect to /id/ or /en/ based on language. All prices, texts, content fully translated id and en." },
  { q: "Who made AutoClipp AI?", a: "Built by XySpace for Indonesian creators. Monochrome A + play logo, premium simple branding. Our focus is helping creators, not showing off backend tech." },
]

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const isId = locale === 'id'
  const faqs = isId ? faqsId : faqsEn

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B]">← {isId ? 'Kembali' : 'Back'}</Link>
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">{isId ? 'FAQ — Pertanyaan Umum' : 'FAQ — Frequently Asked'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">{isId ? 'Jawaban untuk pertanyaan yang sering ditanyakan' : 'Answers to frequently asked questions'} • {isId ? 'Dibuat oleh' : 'Made by'} XySpace</p>

        <div className="mt-8 space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-[16px] border border-[#E8E8E3] bg-white p-5">
              <h3 className="text-[14px] font-[650] tracking-[-0.01em]">{i+1}. {f.q}</h3>
              <p className="mt-2 text-[12px] leading-[1.6] text-[#3A3A3A]">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[16px] bg-[#0A0A0A] text-white p-6">
          <h3 className="text-[13px] font-[700]">{isId ? 'Masih ada pertanyaan?' : 'Still have questions?'}</h3>
          <p className="mt-2 text-[12px] text-white/60 leading-[1.6]">
            {isId ? 'Hubungi tim XySpace. Kami siap membantu kreator Indonesia membuat viral shorts dengan mudah. Semua fitur real, rating real, pembayaran real terverifikasi.' : 'Contact XySpace team. We are ready to help Indonesian creators make viral shorts easily. All features real, ratings real, payments real verified.'}
          </p>
          <div className="mt-4 flex gap-2">
            <Link href={`/${locale}/docs`} className="rounded-full bg-white text-black px-4 py-2 text-[11px] font-[600]">Docs</Link>
            <Link href={`/${locale}/subscription`} className="rounded-full bg-white/10 border border-white/20 px-4 py-2 text-[11px] font-[600]">{isId ? 'Lihat Harga' : 'View Pricing'}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
