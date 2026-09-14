import { isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B] hover:text-black">← {isId ? 'Kembali' : 'Back'}</Link>
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">{isId ? 'Kebijakan Privasi' : 'Privacy Policy'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">{isId ? 'Terakhir diperbarui' : 'Last updated'}: 14 Sep 2026 • {isId ? 'Dibuat oleh' : 'Made by'} XySpace</p>

        <div className="mt-8 space-y-8 text-[13px] leading-[1.7]">
          <section>
            <h2 className="text-[16px] font-[700]">1. {isId ? 'Data yang Kami Kumpulkan' : 'Data We Collect'}</h2>
            <div className="mt-3 space-y-3 text-[#3A3A3A]">
              <p><strong>{isId ? 'Akun:' : 'Account:'}</strong> {isId ? 'Email, nama, foto profil dari Google OAuth atau email. Kami tidak pernah menyimpan password dalam bentuk plain text.' : 'Email, name, profile picture from Google OAuth or email. We never store passwords in plain text.'}</p>
              <p><strong>{isId ? 'Video:' : 'Video:'}</strong> {isId ? 'Video yang kamu upload untuk diproses. Kami tidak menggunakan videomu untuk training AI tanpa izin.' : 'Videos you upload for processing. We do not use your videos for AI training without permission.'}</p>
              <p><strong>{isId ? 'Penggunaan:' : 'Usage:'}</strong> {isId ? 'Data penggunaan seperti halaman yang dikunjungi, waktu di halaman, untuk meningkatkan pengalaman. Semua data analitik real dari pengguna asli, bukan fake.' : 'Usage data like pages visited, time on page, to improve experience. All analytics real from genuine users, not fake.'}</p>
              <p><strong>{isId ? 'Pembayaran:' : 'Payment:'}</strong> {isId ? 'Informasi pembayaran seperti paket yang dipilih, metode pembayaran, status transaksi. Kami tidak menyimpan nomor kartu.' : 'Payment info like chosen plan, payment method, transaction status. We do not store card numbers.'}</p>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">2. {isId ? 'Bagaimana Kami Menggunakan Data' : 'How We Use Data'}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-[#3A3A3A]">
              <li>{isId ? 'Untuk menyediakan dan meningkatkan layanan AutoClipp AI' : 'To provide and improve AutoClipp AI service'}</li>
              <li>{isId ? 'Untuk autentikasi dan keamanan akun kamu' : 'For authentication and your account security'}</li>
              <li>{isId ? 'Untuk memproses langganan dan verifikasi pembayaran' : 'To process subscription and payment verification'}</li>
              <li>{isId ? 'Untuk mengirim email verifikasi dan notifikasi penting' : 'To send verification emails and important notifications'}</li>
              <li>{isId ? 'Untuk analitik agar kami tahu fitur apa yang paling membantu' : 'For analytics so we know which features help most'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">3. {isId ? 'Keamanan Data' : 'Data Security'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Kami menerapkan keamanan berlapis: enkripsi, cookie httpOnly Secure, SameSite, rate limiting, dan captcha untuk area sensitif. Akses admin terbatas dan diawasi. Kami tidak pernah membagikan password atau kredensial sensitif di halaman publik.' : 'We implement layered security: encryption, httpOnly Secure cookies, SameSite, rate limiting, and captcha for sensitive areas. Admin access is restricted and monitored. We never share passwords or sensitive credentials on public pages.'}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">4. {isId ? 'Hak Kamu' : 'Your Rights'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Kamu bisa meminta akses, koreksi, atau penghapusan data pribadimu kapan saja dengan menghubungi kami. Data analitik tidak dijual ke pihak ketiga, hanya untuk optimasi internal. Kami menghormati privasi kreator Indonesia.' : 'You can request access, correction, or deletion of your personal data anytime by contacting us. Analytics data is not sold to third parties, only for internal optimization. We respect Indonesian creators privacy.'}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">5. {isId ? 'Kontak' : 'Contact'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Jika ada pertanyaan tentang privasi, hubungi tim XySpace melalui halaman support. Kami akan merespon dalam 1x24 jam.' : 'If you have privacy questions, contact XySpace team via support page. We will respond within 24 hours.'}
            </p>
          </section>
        </div>

        <div className="mt-12 rounded-[16px] bg-[#0A0A0A] text-white p-6">
          <h3 className="text-[13px] font-[700]">{isId ? 'Komitmen Kami' : 'Our Commitment'}</h3>
          <p className="mt-2 text-[12px] text-white/60 leading-[1.6]">
            {isId ? 'Privasi kamu penting. Kami hanya mengumpulkan yang diperlukan, menjaga dengan aman, dan tidak pernah menjual data. Semua rating dan feedback di homepage adalah dari pengguna asli yang real, bukan bot.' : 'Your privacy matters. We only collect what is needed, keep it secure, and never sell data. All ratings and feedback on homepage are from real genuine users, not bots.'}
          </p>
        </div>
      </div>
    </div>
  )
}
