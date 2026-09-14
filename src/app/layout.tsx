import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoClipp — YouTube to Viral Shorts, Free",
  description: "Upload long videos. AI finds viral moments, adds animated subtitles, exports 9:16 ready clips. Free forever, no watermark.",
  openGraph: {
    title: "AutoClipp — YouTube to Viral Shorts",
    description: "Free AI tool to turn long videos into viral shorts",
    type: "website",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FCFCF9] text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}
