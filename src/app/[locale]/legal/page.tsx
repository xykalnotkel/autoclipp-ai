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
        <Link href={`/${locale}`} className="text-[12px] text-[#6B6B6B]">← Back</Link>
        <h1 className="mt-6 text-[32px] font-[750]">Legal Information</h1>
        <p className="text-[12px] text-[#6B6B6B] mt-2">Made by XySpace • Cloudflare Workers • Real Backend</p>

        <div className="mt-8 grid gap-4">
          <div className="rounded-[16px] border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-[14px] font-[700]">Company</h3>
            <p className="mt-2 text-[12px] text-[#6B6B6B] leading-[1.6]">XySpace — Creator tools for Indonesia. AutoClipp AI is product for turning long videos into viral shorts. Logo monochrome A + play, branding simple premium.</p>
          </div>

          <div className="rounded-[16px] border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-[14px] font-[700]">Backend — 100% Ready Real</h3>
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Auth Worker</span><span className="font-mono text-[11px]">autoclipp-auth.akuntiktok76y.workers.dev</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">D1 Database</span><span className="font-mono text-[11px]">autoclipp-auth-db e3e45d1a...</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Frontend</span><span className="font-mono text-[11px]">autoclipp-ai.vercel.app</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Storage</span><span className="font-mono text-[11px]">Cloudinary jxjvz3qi</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Email</span><span className="font-mono text-[11px]">Resend re_UCuv...</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Analytics</span><span className="font-mono text-[11px]">D1 analytics_events real</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Total User</span><span className="font-[600]">Real dari D1 SELECT COUNT(*)</span></div>
              <div className="flex justify-between"><span className="text-[#6B6B6B]">Revenue</span><span className="font-[600]">Real SUM(amount) paid</span></div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-6">
            <h3 className="text-[14px] font-[700]">Made by XySpace</h3>
            <p className="mt-2 text-[12px] text-white/60 leading-[1.6]">Built for Indonesian creators. Simple monochrome logo, SEO OG image 1200x630, favicon, realtime analytics, QRIS/DANA real verification 5k-100k, admin kall/Haekal123 super ketat captcha.</p>
            <div className="mt-4 flex gap-2">
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">Cloudflare</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">Vercel</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#FFD60A] text-black font-[700]">XySpace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
