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
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">Documentation — {isId ? 'Lengkap' : 'Complete'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">Made by XySpace • Backend real ready • QRIS/DANA verification</p>

        <div className="mt-8 grid lg:grid-cols-[200px_1fr] gap-8">
          <div className="hidden lg:block sticky top-6 h-fit space-y-6 text-[12px]">
            <div>
              <div className="font-[700] tracking-[0.06em] uppercase text-[11px]">Getting Started</div>
              <div className="mt-2 space-y-1.5 text-[#6B6B6B]">
                <div className="text-black font-[600]">Quick Start</div>
                <div>Auth Cloudflare</div>
                <div>Upload Video</div>
                <div>Generate Clips</div>
              </div>
            </div>
            <div>
              <div className="font-[700] tracking-[0.06em] uppercase text-[11px]">Features</div>
              <div className="mt-2 space-y-1.5 text-[#6B6B6B]">
                <div>Subtitle Styles</div>
                <div>QRIS Payment</div>
                <div>Admin Dashboard</div>
                <div>Analytics Realtime</div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[18px] font-[700] tracking-[-0.02em]">Quick Start — {isId ? 'Mulai dalam 30 detik' : 'Start in 30s'}</h2>
              <div className="mt-4 space-y-3 text-[13px] leading-[1.6] text-[#3A3A3A]">
                <div><strong>1. Login:</strong> Buka /auth/login → Google OAuth (client m02ck9r... redirect sudah set) atau email magic link via Resend. Email wajib verified.</div>
                <div><strong>2. Upload:</strong> Drop video MP4/MOV di /editor atau paste YouTube URL (backend yt-dlp). File upload ke Cloudinary via /api/upload server-side.</div>
                <div><strong>3. Generate:</strong> Klik Generate Clips → POST /api/transcribe (edge) → POST /api/clips (Llama 3.3) → dapat 5 viral clips dengan score.</div>
                <div><strong>4. Edit:</strong> Pilih clip, ganti hook, pilih 6 subtitle styles (Hormozi, MrBeast, Karaoke, Minimal, TikTok, Editorial), animasi pop/bounce/slide, font size, words per line, position.</div>
                <div><strong>5. Export:</strong> Preview 9:16 realtime canvas dengan blur background + smart crop, export via FFmpeg.wasm.</div>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[16px] font-[700]">Auth — Cloudflare Workers + D1</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-[#3A3A3A] space-y-2">
                <p><strong>Worker:</strong> autoclipp-auth.akuntiktok76y.workers.dev — Hono framework, D1 binding DB, JWT HS256, PBKDF2 password.</p>
                <p><strong>Google OAuth:</strong> Client ID 495336144977-m02ck9r... + secret GOCSPX-rAbj... redirect https://autoclipp-auth.../auth/google/callback sudah set di JSON lu, langsung berfungsi.</p>
                <p><strong>Email:</strong> POST /auth/email/send → generate token 15 min, simpan D1 email_tokens, kirim Resend. GET /auth/email/verify?token= → verify, set email_verified=1, sign JWT, set cookie auth_token httpOnly Secure 7 hari.</p>
                <p><strong>Middleware:</strong> Next.js middleware cek auth_token, fetch /auth/me ke Cloudflare, cek email_verified, redirect ke /auth/login atau /auth/verify jika belum.</p>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[16px] font-[700]">Payment QRIS/DANA Real Verification — 5k-100k IDR</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-[#3A3A3A] space-y-2">
                <p><strong>Create:</strong> POST /payment/create-qris dengan plan_id basic/starter/creator/pro/business (5000-100000) + payment_method qris/dana → generate order_id AUTOCLIPP-XXXX, QRIS string EMV, simpan D1 payments status pending.</p>
                <p><strong>QRIS:</strong> Return qris_url untuk QR image, user scan pakai DANA/GoPay/OVO/ShopeePay/BCA mobile, bayar sesuai nominal.</p>
                <p><strong>Midtrans:</strong> Jika MIDTRANS_SERVER_KEY set, charge ke api.sandbox.midtrans.com/v2/charge, dapat qr_string. Webhook POST /payment/webhook/midtrans dengan transaction_status settlement → update paid, insert subscriptions active 30 hari, email Resend.</p>
                <p><strong>Manual Admin:</strong> Jika Midtrans belum set, admin cek mutasi, approve di /admin/payments → subscription aktif. Frontend polling /payment/status/:id tiap 3 detik.</p>
                <p><strong>Real:</strong> Semua total revenue SUM(amount) paid, pending count, active subscriptions COUNT(*) real dari D1, bukan fake.</p>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-6">
              <h2 className="text-[16px] font-[700]">Admin Dashboard — kall / Haekal123 + Captcha Super Ketat</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-white/60 space-y-2">
                <p><strong>Login:</strong> /admin/login dengan username kall, password Haekal123, captcha 6 chars alphanumeric case sensitive, SVG noise, expires 2 menit, one-time, rate limit 5 fail/10 min lock 15 min IP, PBKDF2 100k.</p>
                <p><strong>Dashboard:</strong> /admin/dashboard → stats total_users, pending_payments, paid_payments, active_subscriptions, total_revenue real dari D1, plus realtime analytics active_now, today_views, top_pages, countries, recent events polling 5s.</p>
                <p><strong>Payments:</strong> /admin/payments → list payments dengan QRIS image, approve/reject, subscription auto active.</p>
                <p><strong>Users:</strong> /admin/users → real users dari D1, email verified status, provider, current plan.</p>
              </div>
            </section>

            <section className="rounded-[20px] border border-[#E8E8E3] bg-white p-6">
              <h2 className="text-[16px] font-[700]">SEO + Branding + Realtime Analytics</h2>
              <div className="mt-3 text-[12px] leading-[1.6] text-[#3A3A3A] space-y-2">
                <p><strong>Logo:</strong> Monokrom simple A + play, /logo.png, /icon.png, /favicon.png, /og-image.png 1200x630, branding premium.</p>
                <p><strong>SEO:</strong> metadataBase, title template, description, keywords, OG, Twitter card, robots, icons, theme-color, alternates languages id/en.</p>
                <p><strong>Realtime:</strong> D1 analytics_events + analytics_sessions, track page_view, time_on_page, IP CF-Connecting-IP, country CF-IPCountry, device mobile/desktop, referrer, session_id localStorage, keepalive fetch.</p>
                <p><strong>Multi Bahasa:</strong> /id/* dan /en/*, middleware auto detect dari Accept-Language header + CF-IPCountry + cookie NEXT_LOCALE, redirect otomatis HP.</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
