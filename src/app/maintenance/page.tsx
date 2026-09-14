import Link from 'next/link'

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center p-6">
      <div className="max-w-[480px] w-full text-center">
        <div className="mx-auto h-16 w-16 rounded-[16px] bg-[#0A0A0A] text-white flex items-center justify-center text-[24px] font-[800]">A</div>
        <h1 className="mt-6 text-[28px] font-[700] tracking-[-0.02em]">Sedang Maintenance 🛠</h1>
        <p className="mt-3 text-[14px] leading-[1.5] text-[#6B6B6B]">
          Kami sedang melakukan perbaikan untuk pengalaman yang lebih baik. Kembali lagi nanti ya! Semua data aman.
        </p>
        <div className="mt-6 inline-flex rounded-full bg-[#FFD60A] text-black px-4 py-2 text-[12px] font-[600]">
          Estimasi: segera kembali • Made by XySpace
        </div>
        <div className="mt-8 p-4 rounded-[12px] bg-[#F5F5F0] border border-[#E8E8E3] text-left">
          <div className="text-[11px] font-[700] tracking-[0.06em] uppercase">Yang sedang dikerjakan</div>
          <div className="mt-2 space-y-1.5 text-[11px] text-[#6B6B6B]">
            <div>✓ FFmpeg upgrade • Export lebih cepat</div>
            <div>✓ Subtitle engine • 6 style + 6 animasi</div>
            <div>✓ Grok AI • Viral detection lebih akurat</div>
            <div>✓ Payment QRIS/DANA • Verifikasi otomatis</div>
            <div>✓ Promo popup • Maintenance super lengkap</div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          <a href="https://whatsapp.com/channel/0029VbB7nwuJZg3ym6UQ4Z1L" target="_blank" className="rounded-full bg-[#25D366] text-white px-5 py-2.5 text-[12px] font-[600]">📢 WA Channel XySpace</a>
          <Link href="/id" className="rounded-full border border-[#E8E8E3] bg-white px-5 py-2.5 text-[12px] font-[600]">Coba Lagi</Link>
        </div>
      </div>
    </div>
  )
}
