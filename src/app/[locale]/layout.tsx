import { getMessages, isValidLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/analytics";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const validLocale = isValidLocale(locale) ? locale : defaultLocale
  const messages = await getMessages(validLocale as Locale)
  const isId = validLocale === 'id'
  
  return {
    title: {
      default: isId ? "AutoClipp AI — YouTube ke Viral Shorts dalam Detik" : "AutoClipp AI — YouTube to Viral Shorts in Seconds",
      template: "%s — AutoClipp AI"
    },
    description: messages.common.description,
    openGraph: {
      title: isId ? "AutoClipp AI — YouTube ke Viral Shorts" : "AutoClipp AI — YouTube to Viral Shorts",
      description: messages.common.description,
      url: `https://autoclipp-ai.vercel.app/${validLocale}`,
      siteName: "AutoClipp AI",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AutoClipp AI" }],
      locale: validLocale === 'id' ? 'id_ID' : 'en_US',
      type: "website",
    },
    alternates: {
      languages: {
        'id': '/id',
        'en': '/en',
      }
    }
  }
}

export default async function LocaleLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  if (!isValidLocale(locale)) {
    notFound()
  }

  return (
    <>
      {children}
      <Analytics />
      <footer className="border-t border-[#E8E8E3] bg-[#FCFCF9] mt-auto">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="h-6 w-6 rounded-[6px] bg-[#0A0A0A] object-cover" />
                <span className="text-[13px] font-[700]">autoclipp</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white font-[600]">Made by XySpace</span>
              </div>
              <p className="mt-2 text-[11px] text-[#6B6B6B] max-w-[320px]">Real user analytics • Realtime • Cloudflare D1 • QRIS/DANA verified • Email verification • Total user real COUNT(*)</p>
            </div>
            <div className="flex gap-8 text-[11px]">
              <div>
                <div className="font-[600]">Legal</div>
                <div className="mt-2 space-y-1 text-[#6B6B6B]">
                  <div><a href={`/${locale}/terms`} className="hover:text-black">Terms</a></div>
                  <div><a href={`/${locale}/privacy`} className="hover:text-black">Privacy</a></div>
                  <div><a href={`/${locale}/legal`} className="hover:text-black">Legal</a></div>
                </div>
              </div>
              <div>
                <div className="font-[600]">Support</div>
                <div className="mt-2 space-y-1 text-[#6B6B6B]">
                  <div><a href={`/${locale}/docs`} className="hover:text-black">Docs</a></div>
                  <div><a href={`/${locale}/faq`} className="hover:text-black">FAQ</a></div>
                  <div><a href={`/${locale}/subscription`} className="hover:text-black">Pricing 5k-100k</a></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#E8E8E3] flex justify-between text-[10px] text-[#9B9B9B]">
            <span>© 2026 AutoClipp AI • Made by XySpace • Real analytics • Cloudflare Workers • Total user real</span>
            <span>🇮🇩 /id • 🇺🇸 /en • Auto detect HP</span>
          </div>
        </div>
      </footer>
    </>
  )
}
