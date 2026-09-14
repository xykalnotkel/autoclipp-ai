import { getMessages, type Locale, isValidLocale } from '@/lib/i18n'
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
        <p className="mt-2 text-[12px] text-[#6B6B6B]">Last updated: 14 Sep 2026 • Made by XySpace • Real user analytics</p>

        <div className="mt-8 space-y-8 text-[13px] leading-[1.7]">
          <section>
            <h2 className="text-[16px] font-[700]">1. {isId ? 'Data yang Kami Kumpulkan' : 'Data We Collect'}</h2>
            <div className="mt-3 space-y-2 text-[#3A3A3A]">
              <p><strong>Real User Analytics (Realtime):</strong> {isId ? 'Kami track page views, session, IP (CF-Connecting-IP), country via CF-IPCountry, city, device (mobile/desktop), referrer, time on page. Semua disimpan di Cloudflare D1 analytics_events dan analytics_sessions. Data 100% real, no fake.' : 'We track page views, session, IP, country via CF-IPCountry, city, device, referrer, time on page. All stored in Cloudflare D1. 100% real data.'}</p>
              <p><strong>Auth Data:</strong> Email, name, avatar dari Google OAuth atau email magic link via Resend. Password admin hash PBKDF2, tidak pernah plain text. Email verification wajib.</p>
              <p><strong>Video Data:</strong> Video upload ke Cloudinary (folder autoclipp/uploads) dengan public_id, duration, thumbnail eager. Tidak simpan video di server kami, langsung ke Cloudinary CDN.</p>
              <p><strong>Payment Data:</strong> Order ID, amount Rp 5.000-100.000, payment_method QRIS/DANA/GoPay, qris_string, status pending/paid, paid_at. Untuk verifikasi real ketika user scan QRIS dan bayar.</p>
            </div>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">2. {isId ? 'Bagaimana Kami Gunakan' : 'How We Use'}</h2>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-[#3A3A3A]">
              <li>{isId ? 'Realtime analytics untuk dashboard admin: active now (last 5 min), today views, top pages 24h, countries, recent events polling 5 detik' : 'Realtime analytics for admin dashboard: active now, today views, top pages, countries'}</li>
              <li>{isId ? 'Auth untuk proteksi /editor dan /projects, JWT httpOnly Secure SameSite Lax 7 hari' : 'Auth to protect /editor and /projects, JWT httpOnly 7 days'}</li>
              <li>{isId ? 'Subscription untuk cek akses plan free sampai business Rp 100k, expire 30 hari' : 'Subscription to check access free to business $6.30, expire 30 days'}</li>
              <li>{isId ? 'Email via Resend untuk verifikasi dan notifikasi payment success' : 'Email via Resend for verification and payment success notification'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">3. {isId ? 'Keamanan Super Ketat' : 'Super Strict Security'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Admin login kall/Haekal123 dengan captcha 6 karakter alphanumeric case sensitive, SVG noise, expires 2 menit, one-time use, rate limit 5 fail/10 menit lock 15 menit IP, PBKDF2 100k iterations. User auth JWT HS256, admin JWT HS256 8 jam. Semua cookie httpOnly Secure SameSite Lax. CORS hanya untuk autoclipp-ai.vercel.app dan localhost.' : 'Admin login kall/Haekal123 with captcha 6 chars case sensitive, expires 2 min, rate limit 5 fails lock 15 min, PBKDF2 100k. JWT HS256, httpOnly Secure.'}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">4. {isId ? 'Hak Kamu' : 'Your Rights'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? 'Kamu bisa request hapus data di /admin atau email ke support. Data analytics real user tidak dijual, hanya untuk internal optimasi. Made by XySpace, branding logo monokrom simple.' : 'You can request data deletion via admin or email. Real user analytics not sold, only internal optimization. Made by XySpace.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
