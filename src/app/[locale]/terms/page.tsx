import { getMessages, type Locale, isValidLocale, defaultLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()
  const messages = await getMessages(locale as Locale)
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B] hover:text-black">← {isId ? 'Kembali' : 'Back'}</Link>
        
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">{isId ? 'Syarat dan Ketentuan' : 'Terms and Conditions'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">{messages.legal.last_updated}: 14 September 2026 • Made by XySpace</p>

        <div className="mt-8 space-y-8 text-[13px] leading-[1.7] text-[#0A0A0A]">
          <section>
            <h2 className="text-[16px] font-[700] tracking-[-0.01em]">1. {isId ? 'Penerimaan Syarat' : 'Acceptance of Terms'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? `Dengan mengakses AutoClipp AI di autoclipp-ai.vercel.app, kamu menyetujui syarat ini. Platform kami menggunakan Cloudflare Workers, D1 database, Cloudinary untuk storage, dan Resend untuk email. Semua data real user di-track via analytics_events untuk realtime analytics.` : `By accessing AutoClipp AI at autoclipp-ai.vercel.app, you agree to these terms. Our platform uses Cloudflare Workers, D1 database, Cloudinary storage, and Resend for email. All real user data tracked via analytics_events for realtime analytics.`}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">2. {isId ? 'Layanan AutoClipp' : 'AutoClipp Service'}</h2>
            <ul className="mt-3 space-y-2 text-[#3A3A3A] list-disc pl-5">
              <li>{isId ? 'Upload video panjang, AI deteksi momen viral, auto subtitle 6 style, export 9:16' : 'Upload long videos, AI detects viral moments, auto subtitle 6 styles, export 9:16'}</li>
              <li>{isId ? 'Transkrip via Whisper, highlight via Llama 3.3, face tracking MediaPipe' : 'Transcribe via Whisper, highlight via Llama 3.3, face tracking MediaPipe'}</li>
              <li>{isId ? 'Export via FFmpeg.wasm client-side, no watermark di semua plan' : 'Export via FFmpeg.wasm client-side, no watermark on all plans'}</li>
              <li>{isId ? 'Langganan mulai Rp 5.000 - Rp 100.000 via QRIS/DANA real verification' : 'Subscription from $0.32 - $6.30 via QRIS/DANA real verification'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">3. {isId ? 'Akun dan Verifikasi' : 'Account and Verification'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? `Semua user wajib verifikasi email via Resend. Link expired 15 menit. Google OAuth auto verified. Password admin menggunakan PBKDF2 100k iterasi, captcha super ketat 6 karakter case sensitive, expires 2 menit, rate limit 5 fail/10 menit lock 15 menit. Admin login: kall / Haekal123.` : `All users must verify email via Resend. Link expires 15 min. Google OAuth auto verified. Admin password uses PBKDF2 100k iterations, super strict captcha 6 chars case sensitive, expires 2 min, rate limit 5 fails/10 min lock 15 min. Admin login: kall / Haekal123.`}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">4. {isId ? 'Langganan dan Pembayaran' : 'Subscription and Payment'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? `Free Rp 0 selamanya 5 projects 10 clips. Basic Rp 5.000, Starter Rp 15.000 (popular), Creator Rp 35.000, Pro Rp 65.000, Business Rp 100.000. Pembayaran QRIS/DANA via Midtrans webhook /payment/webhook/midtrans auto settlement → subscription active 30 hari. Jika Midtrans belum set, admin manual approve di /admin/payments. Semua pembayaran real, no fake.` : `Free $0 forever 5 projects 10 clips. Basic $0.32, Starter $0.95 popular, Creator $2.20, Pro $4.10, Business $6.30. Payment QRIS/DANA via Midtrans webhook auto settlement → active 30 days. If Midtrans not set, admin manual approve at /admin/payments. All payments real.`}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">5. {isId ? 'Backend Real' : 'Real Backend'}</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? `Total user, active now, today views, revenue, pending payments semua real dari Cloudflare D1 database autoclipp-auth-db. Analytics realtime polling 5 detik, track IP, country via CF-IPCountry, device detection, session tracking. Tidak ada data fake, semua real user.` : `Total users, active now, today views, revenue, pending payments all real from Cloudflare D1 database. Realtime analytics polling 5s, track IP, country via CF-IPCountry, device detection, session tracking. No fake data, all real users.`}
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-[700]">6. Made by XySpace</h2>
            <p className="mt-3 text-[#3A3A3A]">
              {isId ? `Platform ini dibuat oleh XySpace untuk kreator Indonesia. Logo monokrom simple A + play untuk branding premium. SEO lengkap: OG image 1200x630, favicon, Twitter card, theme-color. Branding konsisten di semua halaman.` : `Platform built by XySpace for Indonesian creators. Simple monochrome logo A + play for premium branding. Full SEO: OG image 1200x630, favicon, Twitter card, theme-color. Consistent branding across pages.`}
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E8E3] flex gap-4 text-[12px]">
          <Link href={`/${locale}/privacy`} className="underline">Privacy</Link>
          <Link href={`/${locale}/legal`} className="underline">Legal</Link>
          <Link href={`/${locale}/docs`} className="underline">Docs</Link>
          <Link href={`/${locale}/faq`} className="underline">FAQ</Link>
        </div>
      </div>
    </div>
  )
}
