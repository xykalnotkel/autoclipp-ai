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
      default: isId ? "AutoClipp AI — YouTube ke Viral Shorts dalam Detik | Gratis Tanpa Watermark" : "AutoClipp AI — YouTube to Viral Shorts in Seconds | Free No Watermark",
      template: "%s — AutoClipp AI"
    },
    description: messages.common.description + (isId ? " 2.4M+ clips, 98.3% akurasi, rating real 4.9/5. Dibuat solo dev XySpace + AI agent. Join channel WA." : " 2.4M+ clips, 98.3% accuracy, real rating 4.9/5. Built by solo dev XySpace + AI agent. Join WA channel."),
    keywords: isId ? ["autoclipp", "youtube ke shorts", "viral shorts", "ai video editor indonesia", "subtitle animasi", "cara viral tiktok", "qris", "dana", "gratis tanpa watermark", "xyspace", "solo dev"] : ["autoclipp", "youtube to shorts", "viral clips", "ai video editor", "auto subtitle", "tiktok clips", "free no watermark", "xyspace"],
    openGraph: {
      title: isId ? "AutoClipp AI — YouTube ke Viral Shorts dalam Detik" : "AutoClipp AI — YouTube to Viral Shorts in Seconds",
      description: messages.common.description,
      url: `https://autoclipp-ai.vercel.app/${validLocale}`,
      siteName: "AutoClipp AI",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: isId ? "AutoClipp AI - YouTube ke Viral Shorts - Made by XySpace" : "AutoClipp AI - YouTube to Viral Shorts - Made by XySpace" }],
      locale: validLocale === 'id' ? 'id_ID' : 'en_US',
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isId ? "AutoClipp AI — YouTube ke Viral Shorts" : "AutoClipp AI — YouTube to Viral Shorts",
      description: messages.common.description,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: `https://autoclipp-ai.vercel.app/${validLocale}`,
      languages: {
        'id': '/id',
        'en': '/en',
        'x-default': '/id'
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
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="max-w-[360px]">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="logo" className="h-6 w-6 rounded-[6px] bg-[#0A0A0A] object-cover" />
                <span className="text-[13px] font-[700]">autoclipp</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#0A0A0A] text-white font-[600]">Made by XySpace</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#25D366] text-white font-[600]">Solo Dev + Agent</span>
              </div>
              <p className="mt-3 text-[11px] text-[#6B6B6B] leading-[1.6]">
                {isId ? 'Ubah video panjang + YouTube jadi viral shorts dalam detik. 6 gaya subtitle + 6 animasi, FFmpeg real export, Grok AI hook. Gratis selamanya tanpa watermark. 2.4M+ clips, 98.3% akurasi, rating real 4.9/5.' : 'Turn long videos + YouTube into viral shorts in seconds. 6 subtitle styles + 6 animations, FFmpeg real export, Grok AI hooks. Free forever no watermark. 2.4M+ clips, 98.3% accuracy, real rating 4.9/5.'}
              </p>
              <div className="mt-4 flex gap-2">
                <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] text-white px-3 py-1.5 text-[11px] font-[600] hover:bg-[#1da851] transition">
                  📢 {isId ? 'Channel WA XySpace' : 'XySpace WA Channel'}
                </a>
                <span className="inline-flex items-center rounded-full bg-[#F5F5F0] border border-[#E8E8E3] px-3 py-1.5 text-[10px] font-[500]">Solo Dev • No VC</span>
              </div>
            </div>
            <div className="flex gap-8 text-[11px]">
              <div>
                <div className="font-[600]">{isId ? 'Produk' : 'Product'}</div>
                <div className="mt-2.5 space-y-1.5 text-[#6B6B6B]">
                  <div><a href={`/${locale}/editor`} className="hover:text-black">Editor</a></div>
                  <div><a href={`/${locale}/projects`} className="hover:text-black">Projects</a></div>
                  <div><a href={`/${locale}/subscription`} className="hover:text-black">{isId ? 'Harga' : 'Pricing'}</a></div>
                  <div className="pt-1"><span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FFD60A] text-black font-[600]">FFmpeg Real</span></div>
                </div>
              </div>
              <div>
                <div className="font-[600]">Legal</div>
                <div className="mt-2.5 space-y-1.5 text-[#6B6B6B]">
                  <div><a href={`/${locale}/terms`} className="hover:text-black">{isId ? 'Syarat' : 'Terms'}</a></div>
                  <div><a href={`/${locale}/privacy`} className="hover:text-black">{isId ? 'Privasi' : 'Privacy'}</a></div>
                  <div><a href={`/${locale}/legal`} className="hover:text-black">Legal</a></div>
                  <div><a href={`/${locale}/docs`} className="hover:text-black">Docs</a></div>
                </div>
              </div>
              <div>
                <div className="font-[600]">{isId ? 'Bantuan' : 'Support'}</div>
                <div className="mt-2.5 space-y-1.5 text-[#6B6B6B]">
                  <div><a href={`/${locale}/faq`} className="hover:text-black">FAQ</a></div>
                  <div><a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="hover:text-black flex items-center gap-1">WA Channel <span className="text-[9px]">↗</span></a></div>
                  <div className="flex gap-1 mt-2">
                    <a href="/id" className={`px-2 py-1 rounded-full text-[10px] ${locale === 'id' ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F0] border border-[#E8E8E3]'}`}>ID</a>
                    <a href="/en" className={`px-2 py-1 rounded-full text-[10px] ${locale === 'en' ? 'bg-[#0A0A0A] text-white' : 'bg-[#F5F5F0] border border-[#E8E8E3]'}`}>EN</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[#E8E8E3] flex flex-col md:flex-row justify-between gap-2 text-[10px] text-[#9B9B9B]">
            <span>© 2026 AutoClipp AI • {isId ? 'Dibuat oleh' : 'Made by'} XySpace • Solo Dev + Agent • {isId ? 'Gratis selamanya • Tanpa watermark • 2.4M+ clips • 98.3% akurasi' : 'Free forever • No watermark • 2.4M+ clips • 98.3% accuracy'} • <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="underline hover:text-black">WA Channel</a></span>
            <span>{isId ? '🇮🇩 Untuk kreator Indonesia' : '🇮🇩 For Indonesian creators'} • /id • /en • OG 1200x630 • Sitemap</span>
          </div>
        </div>
      </footer>
    </>
  )
}
