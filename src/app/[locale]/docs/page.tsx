import { isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function DocsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="mx-auto max-w-[900px] px-6 py-12">
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B]">← {isId ? 'Kembali' : 'Back'}</Link>
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">{isId ? 'Dokumentasi' : 'Documentation'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">{isId ? 'Panduan lengkap menggunakan AutoClipp AI' : 'Complete guide to using AutoClipp AI'} • {isId ? 'Dibuat oleh' : 'Made by'} XySpace</p>

        <div className="mt-8 grid lg:grid-cols-[200px_1fr] gap-8">
          <div className="hidden lg:block sticky top-6 h-fit space-y-6 text-[12px]">
            <div>
              <div className="font-[700] tracking-[0.06em] uppercase text-[11px]">{isId ? 'Mulai' : 'Getting Started'}</div>
              <div className="mt-2 space-y-1.5 text-[#6B6B6B]">
                <div className="text-black font-[600]">{isId ? 'Mulai Cepat' : 'Quick Start'}</div>
                <div>{isId ? 'Upload Video' : 'Upload Video'}</div>
                <div>{isId ? 'Generate Clip' : 'Generate Clips'}</div>
                <div>{isId ? 'Edit & Export' : 'Edit & Export'}</div>
              </div>
            </div>
            <div>
              <div className="font-[700] tracking-[0.06em] uppercase text-[11px]">{isId ? 'Fitur' : 'Features'}</div>
              <div className="mt-2 space-y-1.5 text-[#6B6B6B]">
                <div>{isId ? 'Gaya Subtitle' : 'Subtitle Styles'}</div>
                <div>{isId ? 'Pembayaran' : 'Payments'}</div>
                <div>{isId ? 'Ulasan Real' : 'Real Reviews'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[18px] font-[700] tracking-[-0.02em]">{isId ? 'Mulai dalam 30 detik' : 'Start in 30s'}</h2>
              <div className="mt-4 space-y-3 text-[13px] leading-[1.6] text-[#3A3A3A]">
                <div><strong>1. {isId ? 'Login:' : 'Login:'}</strong> {isId ? 'Buka halaman login, gunakan Google atau email. Verifikasi email kamu untuk keamanan.' : 'Open login page, use Google or email. Verify your email for security.'}</div>
                <div><strong>2. {isId ? 'Upload:' : 'Upload:'}</strong> {isId ? 'Drag & drop video MP4/MOV hingga 2GB di editor, atau paste URL YouTube. Video akan diproses otomatis.' : 'Drag & drop MP4/MOV up to 2GB in editor, or paste YouTube URL. Video will be processed automatically.'}</div>
                <div><strong>3. {isId ? 'Generate:' : 'Generate:'}</strong> {isId ? 'Klik Generate Clips. AI akan transkrip dan temukan 5 momen viral dengan skor tertinggi.' : 'Click Generate Clips. AI will transcribe and find 5 viral moments with highest scores.'}</div>
                <div><strong>4. {isId ? 'Edit:' : 'Edit:'}</strong> {isId ? 'Pilih clip, edit hook, pilih 6 gaya subtitle (Hormozi, MrBeast, Karaoke, Minimal, TikTok, Editorial), atur animasi, font, posisi.' : 'Select clip, edit hook, choose 6 subtitle styles (Hormozi, MrBeast, Karaoke, Minimal, TikTok, Editorial), adjust animation, font, position.'}</div>
                <div><strong>5. {isId ? 'Export:' : 'Export:'}</strong> {isId ? 'Preview 9:16 realtime dengan blur background dan smart crop, lalu export siap posting ke TikTok/Reels/Shorts.' : 'Preview 9:16 realtime with blur background and smart crop, then export ready for TikTok/Reels/Shorts.'}</div>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[16px] font-[700]">{isId ? 'Gaya Subtitle' : 'Subtitle Styles'}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 text-[12px]">
                <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Hormozi</div><div className="text-[#6B6B6B] mt-1">{isId ? 'Bold, uppercase, impactful' : 'Bold, uppercase, impactful'}</div></div>
                <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">MrBeast</div><div className="text-[#6B6B6B] mt-1">{isId ? 'Warna-warni, energetic' : 'Colorful, energetic'}</div></div>
                <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Karaoke</div><div className="text-[#6B6B6B] mt-1">{isId ? 'Highlight kata per kata' : 'Word-by-word highlight'}</div></div>
                <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Minimal</div><div className="text-[#6B6B6B] mt-1">{isId ? 'Clean, simple, elegan' : 'Clean, simple, elegant'}</div></div>
                <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">TikTok</div><div className="text-[#6B6B6B] mt-1">{isId ? 'Style viral TikTok' : 'Viral TikTok style'}</div></div>
                <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Editorial</div><div className="text-[#6B6B6B] mt-1">{isId ? 'Professional, serif' : 'Professional, serif'}</div></div>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[16px] font-[700]">{isId ? 'Langganan & Pembayaran' : 'Subscription & Payment'}</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-[#3A3A3A] space-y-2">
                <p>{isId ? 'Mulai gratis Rp 0 selamanya. Upgrade kapan saja mulai Rp 5.000 hingga Rp 100.000 per bulan. Semua pembayaran terverifikasi real — ketika kamu scan QRIS dan bayar sesuai nominal, akses otomatis aktif.' : 'Start free $0 forever. Upgrade anytime from $0.32 to $6.30 per month. All payments real verified — when you scan QRIS and pay exact amount, access auto active.'}</p>
                <p><strong>{isId ? 'Metode:' : 'Methods:'}</strong> {isId ? 'QRIS, DANA, GoPay, OVO, ShopeePay, Virtual Account BCA/Mandiri/BNI/BRI, Alfamart, Indomaret.' : 'QRIS, DANA, GoPay, OVO, ShopeePay, VA BCA/Mandiri/BNI/BRI, Alfamart, Indomaret.'}</p>
                <p><strong>{isId ? 'Durasi:' : 'Duration:'}</strong> {isId ? '30 hari per pembayaran, bisa diperpanjang otomatis.' : '30 days per payment, can be extended automatically.'}</p>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[16px] font-[700]">{isId ? 'Rating & Feedback Real' : 'Real Rating & Feedback'}</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-[#3A3A3A] space-y-2">
                <p>{isId ? 'Semua rating dan testimoni di homepage adalah dari pengguna asli, bukan fake. Kamu bisa memberikan ulasan setelah login. Rating disimpan real dan ditampilkan realtime.' : 'All ratings and testimonials on homepage are from real users, not fake. You can leave review after login. Ratings stored real and displayed realtime.'}</p>
                <p>{isId ? 'Kami tidak pernah membuat review palsu. Kepercayaan kreator adalah yang utama.' : 'We never create fake reviews. Creator trust is paramount.'}</p>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-6">
              <h2 className="text-[16px] font-[700]">{isId ? 'Tips Viral' : 'Viral Tips'}</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-white/60 space-y-2">
                <p>• {isId ? 'Hook 3 detik pertama menentukan segalanya. Gunakan AI hook generator kami.' : 'First 3 seconds hook determines everything. Use our AI hook generator.'}</p>
                <p>• {isId ? 'Subtitle besar dan animasi meningkatkan retention 40%.' : 'Big subtitles and animation increase retention 40%.'}</p>
                <p>• {isId ? 'Export 1080x1920 60fps untuk kualitas maksimal di TikTok/Reels.' : 'Export 1080x1920 60fps for max quality on TikTok/Reels.'}</p>
                <p>• {isId ? 'Posting jam 7-9 malam untuk engagement tertinggi.' : 'Post 7-9 PM for highest engagement.'}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
