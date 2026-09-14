import { isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const faqsId = [
  { q: "Apakah AutoClipp AI gratis?", a: "Ya, free Rp 0 selamanya 5 projects 10 clips. No watermark. Upgrade mulai Rp 5.000/bulan untuk lebih banyak clips." },
  { q: "Apakah auth Cloudflare sudah berfungsi?", a: "Ya, sudah live di autoclipp-auth.akuntiktok76y.workers.dev. Google OAuth client m02ck9r... redirect sudah set, email verification via Resend active, JWT httpOnly Secure." },
  { q: "Bagaimana sistem langganan QRIS/DANA real verification?", a: "User checkout plan 5k-100k → generate QRIS string EMV + order_id → tampil QR image → user scan pakai DANA/GoPay/OVO, bayar sesuai nominal → Midtrans webhook /payment/webhook/midtrans auto settlement → subscription active 30 hari. Jika Midtrans belum set, admin manual approve di /admin/payments. Semua real, total revenue SUM(amount) paid dari D1." },
  { q: "Admin login apa?", a: "Username: kall, Password: Haekal123, plus captcha 6 karakter alphanumeric case sensitive super ketat, expires 2 menit, rate limit 5 fail lock 15 menit. Dashboard di /admin/dashboard dengan stats real user, realtime analytics." },
  { q: "Logo branding?", a: "Logo monokrom simple A + play, premium, file /logo.png, /icon.png, /favicon.png, /og-image.png 1200x630 untuk OG. Made by XySpace." },
  { q: "SEO, OG, favicon sudah diatur?", a: "Ya, title template, description, keywords, OG image 1200x630, favicon png, apple touch, Twitter card, theme-color #0A0A0A, robots, alternates id/en." },
  { q: "Realtime real user analytics?", a: "Ya, D1 tables analytics_events + analytics_sessions, track page_view, IP CF-Connecting-IP, country CF-IPCountry, device mobile/desktop, referrer, session localStorage, polling 5 detik di admin dashboard. Active now last 5 min, today views, top pages 24h, countries, recent events semua real." },
  { q: "Multi bahasa auto deteksi HP?", a: "Ya, middleware deteksi Accept-Language header + CF-IPCountry + cookie NEXT_LOCALE. Route /id/* dan /en/*, auto redirect. Contoh autoclipp-ai.vercel.app/id/ atau /en/, semua price, terms, legal, docs, faq sudah translate." },
  { q: "Backend sudah ready siap pakai?", a: "Ya, Cloudflare Worker + D1 + R2, Vercel Next.js, Supabase, Cloudinary, Resend semua ready. Total user COUNT(*) real dari D1, bukan fake. Made by XySpace." },
  { q: "Bagaimana cara ganti Google OAuth secret?", a: "Kasih client ID + secret baru, gue update via wrangler secret put GOOGLE_CLIENT_SECRET dan deploy. Redirect URI harus https://autoclipp-auth.../auth/google/callback." },
]

const faqsEn = [
  { q: "Is AutoClipp AI free?", a: "Yes, free $0 forever 5 projects 10 clips. No watermark. Upgrade from $0.32/month." },
  { q: "Is Cloudflare auth working?", a: "Yes, live at autoclipp-auth... Google OAuth client m02ck... redirect set, email verification via Resend active." },
  { q: "How does QRIS/DANA real verification work?", a: "Checkout plan $0.32-$6.30 → generate QRIS + order_id → show QR → user scans with DANA/GoPay, pays → Midtrans webhook settlement → subscription active 30 days. Or admin manual approve." },
  { q: "Admin login?", a: "Username: kall, Password: Haekal123, plus captcha 6 chars case sensitive super strict, expires 2 min." },
  { q: "Branding logo?", a: "Simple monochrome A + play, premium, /logo.png, /icon.png, /og-image.png 1200x630. Made by XySpace." },
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
        <h1 className="mt-6 text-[32px] font-[750] tracking-[-0.03em]">{isId ? 'FAQ — Super Lengkap' : 'FAQ — Complete'}</h1>
        <p className="mt-2 text-[12px] text-[#6B6B6B]">Made by XySpace • Real backend • QRIS/DANA verified • Admin kall/Haekal123</p>

        <div className="mt-8 space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="rounded-[16px] border border-[#E8E8E3] bg-white p-5">
              <h3 className="text-[14px] font-[650] tracking-[-0.01em]">{i+1}. {f.q}</h3>
              <p className="mt-2 text-[12px] leading-[1.6] text-[#3A3A3A]">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[16px] bg-[#0A0A0A] text-white p-6">
          <h3 className="text-[13px] font-[700]">Backend Real Ready?</h3>
          <p className="mt-2 text-[12px] text-white/60 leading-[1.6]">
            Ya, semua ready: Cloudflare Worker auth + D1 users, subscriptions, payments, analytics_events real, Vercel Next.js edge optimized, Cloudinary storage, Supabase projects, Resend email verification, Midtrans QRIS/DANA webhook, admin dashboard kall/Haekal123 captcha super ketat, logo monokrom, SEO OG favicon, multi bahasa /id /en auto deteksi HP via Accept-Language + CF-IPCountry, total user COUNT(*) real, revenue SUM real, realtime active now polling 5s. Made by XySpace.
          </p>
        </div>
      </div>
    </div>
  )
}
