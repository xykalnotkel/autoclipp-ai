import { isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B]">← {isId ? 'Kembali' : 'Back'}</Link>
        <h1 className="mt-6 text-[32px] font-[750]">{isId ? 'Informasi Legal' : 'Legal Information'}</h1>
        <p className="text-[12px] text-[#6B6B6B] mt-2">{isId ? 'Dibuat oleh' : 'Made by'} XySpace • 2026</p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-[16px] border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-[14px] font-[700]">{isId ? 'Perusahaan' : 'Company'}</h3>
            <p className="mt-2 text-[12px] text-[#6B6B6B] leading-[1.6]">
              {isId ? 'XySpace adalah studio yang fokus membangun tools untuk kreator Indonesia. AutoClipp AI adalah produk unggulan kami untuk mengubah video panjang menjadi viral shorts. Kami percaya kreator harus fokus pada cerita, bukan editing manual yang melelahkan.' : 'XySpace is a studio focused on building tools for Indonesian creators. AutoClipp AI is our flagship product for turning long videos into viral shorts. We believe creators should focus on storytelling, not tedious manual editing.'}
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#0A0A0A] text-white font-[600]">XySpace</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">Indonesia</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3]">2026</span>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-[14px] font-[700]">{isId ? 'Produk' : 'Product'}</h3>
            <div className="mt-3 space-y-2 text-[12px] text-[#3A3A3A] leading-[1.6]">
              <p><strong>AutoClipp AI</strong> — {isId ? 'Platform AI untuk mengubah YouTube / video panjang menjadi viral shorts otomatis.' : 'AI platform to turn YouTube / long videos into viral shorts automatically.'}</p>
              <ul className="list-disc pl-5 space-y-1 mt-2 text-[#6B6B6B]">
                <li>{isId ? 'Auto transkrip 99+ bahasa dengan word-level timestamp' : 'Auto transcribe 99+ languages with word-level timestamp'}</li>
                <li>{isId ? 'Deteksi momen viral berbasis AI' : 'AI-based viral moment detection'}</li>
                <li>{isId ? 'Subtitle animasi 6 style, smart crop face tracking' : '6 animated subtitle styles, smart crop face tracking'}</li>
                <li>{isId ? 'Export 9:16 tanpa watermark, gratis selamanya untuk fitur inti' : '9:16 export no watermark, free forever for core features'}</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-[14px] font-[700]">{isId ? 'Harga Transparan' : 'Transparent Pricing'}</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Free</div><div className="text-[#6B6B6B]">{isId ? 'Rp 0 selamanya' : '$0 forever'}</div></div>
              <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Basic</div><div className="text-[#6B6B6B]">{isId ? 'Rp 5.000 / bulan' : '$0.32 / month'}</div></div>
              <div className="rounded-[12px] bg-[#0A0A0A] text-white p-3"><div className="font-[700]">Starter ★</div><div className="text-white/60">{isId ? 'Rp 15.000 / bulan' : '$0.95 / month'}</div></div>
              <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Creator</div><div className="text-[#6B6B6B]">{isId ? 'Rp 35.000 / bulan' : '$2.20 / month'}</div></div>
              <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Pro</div><div className="text-[#6B6B6B]">{isId ? 'Rp 65.000 / bulan' : '$4.10 / month'}</div></div>
              <div className="rounded-[12px] bg-[#F5F5F0] p-3"><div className="font-[700]">Business</div><div className="text-[#6B6B6B]">{isId ? 'Rp 100.000 / bulan' : '$6.30 / month'}</div></div>
            </div>
            <p className="mt-3 text-[11px] text-[#6B6B6B]">{isId ? 'Semua paket mendukung QRIS, DANA, GoPay, OVO. Batalkan kapan saja.' : 'All plans support QRIS, DANA, GoPay, OVO. Cancel anytime.'}</p>
          </div>

          <div className="rounded-[16px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-6">
            <h3 className="text-[14px] font-[700]">Made by XySpace</h3>
            <p className="mt-2 text-[12px] text-white/60 leading-[1.6]">
              {isId ? 'Dibuat untuk kreator Indonesia dengan cinta. Logo monokrom A + play merepresentasikan simplicity dan fokus. Kami tidak membahas detail teknis backend di halaman publik — yang penting adalah hasil: clip viral dalam detik.' : 'Built for Indonesian creators with love. Monochrome A + play logo represents simplicity and focus. We do not discuss backend technical details on public pages — what matters is result: viral clips in seconds.'}
            </p>
            <div className="mt-4 flex gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">Premium</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">Simple</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">XySpace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
