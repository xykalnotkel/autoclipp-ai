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

  const isId = locale === 'id'

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
              <p className="mt-2 text-[11px] text-[#6B6B6B] max-w-[340px] leading-[1.5]">
                {isId ? 'Ubah video panjang jadi viral shorts dalam detik. Gratis selamanya, tanpa watermark. Dipercaya ribuan kreator.' : 'Turn long videos into viral shorts in seconds. Free forever, no watermark. Trusted by thousands of creators.'}
              </p>
            </div>
            <div className="flex gap-8 text-[11px]">
              <div>
                <div className="font-[600]">{isId ? 'Legal' : 'Legal'}</div>
                <div className="mt-2 space-y-1 text-[#6B6B6B]">
                  <div><a href={`/${locale}/terms`} className="hover:text-black">{isId ? 'Syarat' : 'Terms'}</a></div>
                  <div><a href={`/${locale}/privacy`} className="hover:text-black">{isId ? 'Privasi' : 'Privacy'}</a></div>
                  <div><a href={`/${locale}/legal`} className="hover:text-black">Legal</a></div>
                </div>
              </div>
              <div>
                <div className="font-[600]">{isId ? 'Bantuan' : 'Support'}</div>
                <div className="mt-2 space-y-1 text-[#6B6B6B]">
                  <div><a href={`/${locale}/docs`} className="hover:text-black">Docs</a></div>
                  <div><a href={`/${locale}/faq`} className="hover:text-black">FAQ</a></div>
                  <div><a href={`/${locale}/subscription`} className="hover:text-black">{isId ? 'Harga' : 'Pricing'}</a></div>
                </div>
              </div>
              <div>
                <div className="font-[600]">{isId ? 'Bahasa' : 'Language'}</div>
                <div className="mt-2 space-y-1 text-[#6B6B6B]">
                  <div><a href="/id" className={`hover:text-black ${locale === 'id' ? 'text-black font-[600]' : ''}`}>🇮🇩 Indonesia</a></div>
                  <div><a href="/en" className={`hover:text-black ${locale === 'en' ? 'text-black font-[600]' : ''}`}>🇺🇸 English</a></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-[#E8E8E3] flex flex-col md:flex-row justify-between gap-2 text-[10px] text-[#9B9B9B]">
            <span>© 2026 AutoClipp AI • {isId ? 'Dibuat oleh' : 'Made by'} XySpace • {isId ? 'Tanpa watermark • Gratis selamanya' : 'No watermark • Free forever'}</span>
            <span>{isId ? '🇮🇩 Untuk kreator Indonesia' : '🇮🇩 For Indonesian creators'} • /id • /en</span>
          </div>
        </div>
      </footer>
    </>
  )
}
