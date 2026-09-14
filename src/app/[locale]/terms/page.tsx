import { isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B] hover:text-black">← {isId ? 'Kembali' : 'Back'}</Link>
        
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">{isId ? 'Syarat dan Ketentuan' : 'Terms and Conditions'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">{isId ? 'Terakhir diperbarui' : 'Last updated'}: 14 September 2026 • {isId ? 'Dibuat oleh' : 'Made by'} XySpace</p>

        <div className="mt-8 space-y-8 text-[13px] leading-[1.7] text-[#0A0A0A]">
          <section>
            <h2 className="text-[16px] font-[700] tracking-[-0.01em]">1. {isId ? 'Penerimaan Syarat' : 'Acceptance of Terms'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Dengan mengakses dan menggunakan AutoClipp AI, kamu menyetujui syarat dan ketentuan ini. Jika kamu tidak setuju, jangan gunakan layanan kami. Layanan ini disediakan untuk membantu kreator mengubah video panjang menjadi short-form yang siap viral.' : 'By accessing and using AutoClipp AI, you agree to these terms and conditions. If you do not agree, please do not use our service. This service is provided to help creators turn long videos into viral-ready short clips.'}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">2. {isId ? 'Deskripsi Layanan' : 'Service Description'}</h2>
            <ul className="mt-3 space-y-2 text-[#3A3A3A] list-disc pl-5">
              <li>{isId ? 'Upload video panjang atau paste link YouTube, sistem akan mendeteksi momen viral otomatis' : 'Upload long videos or paste YouTube link, system automatically detects viral moments'}</li>
              <li>{isId ? 'Transkrip otomatis dengan akurasi tinggi, mendukung 99+ bahasa' : 'High-accuracy auto transcription supporting 99+ languages'}</li>
              <li>{isId ? '6 gaya subtitle animasi, custom font, warna, posisi, dan animasi' : '6 animated subtitle styles, custom font, color, position, and animation'}</li>
              <li>{isId ? 'Smart crop dengan face tracking, export 9:16 siap posting tanpa watermark' : 'Smart crop with face tracking, 9:16 export ready to post without watermark'}</li>
              <li>{isId ? 'Manajemen project untuk mengatur semua clip kamu' : 'Project management to organize all your clips'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">3. {isId ? 'Akun Pengguna' : 'User Account'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Kamu bertanggung jawab untuk menjaga keamanan akunmu. Semua user wajib verifikasi email untuk keamanan. Kamu bisa login dengan Google atau email magic link. Jangan bagikan kredensial login ke orang lain. Kami berhak menangguhkan akun yang melanggar syarat.' : 'You are responsible for maintaining your account security. All users must verify email for security. You can login with Google or email magic link. Do not share login credentials. We reserve the right to suspend accounts violating terms.'}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">4. {isId ? 'Langganan dan Pembayaran' : 'Subscription and Payment'}</h2>
            <div className="mt-3 space-y-3 text-[#3A3A3A]">
              <p>
                {isId ? 'Paket Gratis Rp 0 selamanya dengan 5 project dan 10 clip per bulan. Untuk kebutuhan lebih, tersedia paket mulai Rp 5.000 hingga Rp 100.000 per bulan. Semua paket tanpa watermark dan bisa dibatalkan kapan saja.' : 'Free plan $0 forever with 5 projects and 10 clips per month. For more needs, plans from $0.32 to $6.30 per month. All plans no watermark and cancel anytime.'}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>{isId ? 'Basic Rp 5.000 — 20 project, 50 clip, 1080p' : 'Basic $0.32 — 20 projects, 50 clips, 1080p'}</li>
                <li>{isId ? 'Starter Rp 15.000 (populer) — 50 project, 150 clip, custom font' : 'Starter $0.95 (popular) — 50 projects, 150 clips, custom font'}</li>
                <li>{isId ? 'Creator Rp 35.000 — 150 project, 500 clip, 4K' : 'Creator $2.20 — 150 projects, 500 clips, 4K'}</li>
                <li>{isId ? 'Pro Rp 65.000 — Unlimited project, 2000 clip, tim 10' : 'Pro $4.10 — Unlimited projects, 2000 clips, team of 10'}</li>
                <li>{isId ? 'Business Rp 100.000 — Unlimited semua, white label' : 'Business $6.30 — Unlimited everything, white label'}</li>
              </ul>
              <p>{isId ? 'Pembayaran mendukung QRIS, DANA, GoPay, OVO, ShopeePay, dan Virtual Account. Akses langganan aktif otomatis setelah pembayaran terverifikasi, berlaku 30 hari.' : 'Payments support QRIS, DANA, GoPay, OVO, ShopeePay, and Virtual Accounts. Subscription access active automatically after verified payment, valid 30 days.'}</p>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">5. {isId ? 'Konten dan Hak Cipta' : 'Content and Copyright'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Kamu tetap memiliki hak atas video yang kamu upload. Kamu bertanggung jawab memastikan kamu memiliki hak untuk menggunakan konten tersebut. Jangan upload konten yang melanggar hak cipta, kekerasan, atau ilegal. Kami berhak menghapus konten yang melanggar.' : 'You retain rights to videos you upload. You are responsible for ensuring you have rights to use that content. Do not upload copyrighted, violent, or illegal content. We may remove violating content.'}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">6. {isId ? 'Dibuat oleh XySpace' : 'Made by XySpace'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'AutoClipp AI dibuat oleh XySpace untuk kreator Indonesia. Misi kami adalah menyederhanakan workflow editing agar kreator bisa fokus membuat konten, bukan editing manual. Logo kami simple monokrom A + play untuk kesan premium dan profesional.' : 'AutoClipp AI is built by XySpace for Indonesian creators. Our mission is to simplify editing workflow so creators can focus on creating, not manual editing. Our logo is simple monochrome A + play for premium professional look.'}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E8E3] flex gap-4 text-[12px]">
          <Link href={`/${locale}/privacy`} className="underline hover:text-black">{isId ? 'Privasi' : 'Privacy'}</Link>
          <Link href={`/${locale}/legal`} className="underline hover:text-black">Legal</Link>
          <Link href={`/${locale}/docs`} className="underline hover:text-black">Docs</Link>
          <Link href={`/${locale}/faq`} className="underline hover:text-black">FAQ</Link>
        </div>
      </div>
    </div>
  )
}
