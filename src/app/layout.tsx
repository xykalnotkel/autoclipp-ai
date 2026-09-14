import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://autoclipp-ai.vercel.app'),
  title: {
    default: "AutoClipp AI — YouTube ke Viral Shorts dalam Detik | Gratis Selamanya",
    template: "%s — AutoClipp AI"
  },
  description: "Upload video panjang atau paste link YouTube. AI deteksi momen viral, auto subtitle 6 style + 6 animasi, export 9:16 1080x1920 60fps siap posting. Gratis selamanya tanpa watermark. Mulai Rp 5.000/bulan. Dibuat oleh XySpace solo dev + AI agent. Rating real 4.9/5 dari pengguna asli.",
  keywords: [
    "autoclipp", "autoclipp ai", "youtube to shorts", "viral clips", "ai video editor", 
    "auto subtitle", "subtitle animasi", "tiktok clips", "indonesia", "qris", "dana", 
    "gopay", "youtube clipping", "shorts maker", "ai clipping", "viral detection",
    "hormozi subtitle", "mrbeast subtitle", "xyspace", "solo dev", "free no watermark",
    "ffmpeg wasm", "grok ai", "auto hook", "cara viral tiktok"
  ],
  authors: [{ name: "XySpace", url: "https://autoclipp-ai.vercel.app" }],
  creator: "XySpace",
  publisher: "XySpace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/favicon.png"
  },
  openGraph: {
    title: "AutoClipp AI — YouTube ke Viral Shorts dalam Detik",
    description: "Upload video panjang atau paste link YouTube. AI temukan momen viral, tambah subtitle animasi 6 style, export 9:16 siap posting. Gratis selamanya tanpa watermark. 2.4M+ clips, 98.3% akurasi, rating real 4.9/5. Made by XySpace.",
    url: "https://autoclipp-ai.vercel.app",
    siteName: "AutoClipp AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoClipp AI - YouTube to Viral Shorts - Made by XySpace",
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoClipp AI — YouTube ke Viral Shorts dalam Detik",
    description: "Free AI tool: YouTube to viral shorts in seconds. 6 subtitle styles, 6 animations, FFmpeg real export, Grok AI hooks. Gratis selamanya, tanpa watermark. Made by XySpace.",
    images: ["/og-image.png"],
    creator: "@autoclipp_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://autoclipp-ai.vercel.app/id',
    languages: {
      'id': 'https://autoclipp-ai.vercel.app/id',
      'en': 'https://autoclipp-ai.vercel.app/en',
    }
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  category: "video editing",
  classification: "Video Editing, AI Tools, Content Creation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AutoClipp AI",
    "alternateName": "autoclipp",
    "description": "Upload video panjang atau paste link YouTube. AI deteksi momen viral, auto subtitle 6 style + 6 animasi, export 9:16 siap posting. Gratis selamanya tanpa watermark.",
    "applicationCategory": "VideoApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "name": "Free",
        "price": "0",
        "priceCurrency": "IDR",
        "description": "Gratis selamanya, 5 projects, 10 clips"
      },
      {
        "@type": "Offer",
        "name": "Starter",
        "price": "15000",
        "priceCurrency": "IDR",
        "description": "50 projects, 150 clips, paling populer"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "7",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Person",
      "name": "XySpace",
      "url": "https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L"
    },
    "publisher": {
      "@type": "Organization",
      "name": "XySpace",
      "logo": {
        "@type": "ImageObject",
        "url": "https://autoclipp-ai.vercel.app/logo.png"
      }
    },
    "featureList": ["Auto Transcribe 99 languages", "Viral Detection AI", "Smart Crop Face Tracking", "6 Animated Subtitle Styles", "6 Animations", "FFmpeg.wasm Real Export", "YouTube URL Support", "Grok AI Hook Generation"],
    "screenshot": "https://autoclipp-ai.vercel.app/og-image.png",
    "softwareVersion": "2.3",
    "isAccessibleForFree": true
  }

  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="light" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-full flex flex-col bg-[#FCFCF9] text-[#0A0A0A]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
