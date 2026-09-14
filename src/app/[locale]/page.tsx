import { Header } from '@/components/landing/header'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { getMessages, type Locale, isValidLocale, defaultLocale } from '@/lib/i18n'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  
  if (!isValidLocale(locale)) notFound()
  
  const messages = await getMessages(locale as Locale)
  const isId = locale === 'id'

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <Header />
      <Hero />
      <Features />
      
      <section className="border-t border-[#E8E8E3] bg-[#FCFCF9] py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {[
              { href: `/${locale}/terms`, label: isId ? 'Syarat & Ketentuan' : 'Terms' },
              { href: `/${locale}/privacy`, label: isId ? 'Privasi' : 'Privacy' },
              { href: `/${locale}/legal`, label: 'Legal' },
              { href: `/${locale}/docs`, label: 'Docs' },
              { href: `/${locale}/faq`, label: 'FAQ' },
              { href: `/${locale}/subscription`, label: isId ? 'Langganan 5rb-100rb' : 'Pricing 5k-100k' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="rounded-full border border-[#E8E8E3] bg-white px-4 py-2 text-[12px] font-[500] hover:border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
