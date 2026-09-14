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
    default: "AutoClipp AI — YouTube to Viral Shorts in Seconds",
    template: "%s — AutoClipp AI"
  },
  description: "Upload long videos. AI finds viral moments, adds animated subtitles, exports 9:16 ready clips. Free forever, no watermark. Mulai Rp 5.000/bulan.",
  keywords: ["autoclipp", "youtube to shorts", "viral clips", "ai video editor", "auto subtitle", "tiktok clips", "indonesia", "qris", "dana"],
  authors: [{ name: "AutoClipp AI", url: "https://autoclipp-ai.vercel.app" }],
  creator: "AutoClipp AI",
  publisher: "AutoClipp AI",
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
    title: "AutoClipp AI — YouTube to Viral Shorts",
    description: "Upload long videos. AI finds viral moments, adds animated subtitles, exports 9:16 ready clips. Free forever, no watermark.",
    url: "https://autoclipp-ai.vercel.app",
    siteName: "AutoClipp AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AutoClipp AI - YouTube to Viral Shorts",
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoClipp AI — YouTube to Viral Shorts",
    description: "Free AI tool to turn long videos into viral shorts. Mulai Rp 5.000/bulan.",
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
  verification: {
    google: "google-site-verification-placeholder",
  },
  category: "video editing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="min-h-full flex flex-col bg-[#FCFCF9] text-[#0A0A0A]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
