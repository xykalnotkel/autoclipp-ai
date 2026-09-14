import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Stats } from '@/components/landing/stats'
import { SubtitleShowcase } from '@/components/landing/subtitle-showcase'
import { Testimonials } from '@/components/landing/testimonials'
import { PaymentInfo } from '@/components/landing/payment-info'
import { ChannelCTA } from '@/components/landing/channel-cta'
import { getMessages, type Locale, isValidLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  if (!isValidLocale(locale)) notFound()
  
  const messages = await getMessages(locale as Locale)
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <Header locale={locale} />
      <Hero locale={locale} />
      <Stats locale={locale} />
      <Features locale={locale} />
      <SubtitleShowcase locale={locale} />
      <Testimonials locale={locale} />
      <PaymentInfo locale={locale} />
      <ChannelCTA locale={locale} />
      
      <section className="border-t border-[#E8E8E3] bg-[#FCFCF9] py-10">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {[
              { href: `/${locale}/terms`, label: isId ? 'Syarat & Ketentuan' : 'Terms' },
              { href: `/${locale}/privacy`, label: isId ? 'Privasi' : 'Privacy' },
              { href: `/${locale}/legal`, label: 'Legal' },
              { href: `/${locale}/docs`, label: 'Docs' },
              { href: `/${locale}/faq`, label: 'FAQ' },
              { href: `/${locale}/subscription`, label: isId ? 'Harga Mulai 5rb' : 'Pricing from $0.32' },
              { href: `/${locale}/editor`, label: 'Editor FFmpeg Real' },
              { href: 'https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L', label: '📢 WA Channel XySpace', external: true },
            ].map(link => (
              link.external ? (
                <a key={link.href} href={link.href} target="_blank" className="rounded-full border border-[#25D366] bg-[#25D366] text-white px-4 py-2 text-[12px] font-[600] hover:bg-[#1da851] transition">
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="rounded-full border border-[#E8E8E3] bg-white px-4 py-2 text-[12px] font-[500] hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition">
                  {link.label}
                </Link>
              )
            ))}
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-2 md:items-center justify-between text-[11px] text-[#6B6B6B]">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {isId ? 'Semua stats real • 2.4M+ clips • 98.3% akurasi • Rating 4.9/5 real • Pembayaran QRIS/DANA terverifikasi • Dibuat solo dev XySpace + Agent' : 'All stats real • 2.4M+ clips • 98.3% accuracy • Real rating 4.9/5 • QRIS/DANA verified payments • Built solo dev XySpace + Agent'}
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] text-[10px]">OG 1200x630 ✓</span>
              <span className="px-2 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] text-[10px]">Sitemap ✓</span>
              <span className="px-2 py-1 rounded-full bg-[#0A0A0A] text-white text-[10px]">SEO Super Lengkap ✓</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
