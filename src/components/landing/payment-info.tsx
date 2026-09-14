"use client"

export function PaymentInfo({ locale = 'id' }: { locale?: string }) {
  const isId = locale === 'id'

  return (
    <section className="border-t border-[#E8E8E3] bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0A0A0A] text-white px-3 py-1 text-[11px] font-[600]">
            {isId ? 'PEMBAYARAN REAL QRIS & DANA • VERIFIKASI OTOMATIS' : 'REAL QRIS & DANA PAYMENT • AUTO VERIFICATION'}
          </div>
          <h2 className="mt-4 text-[28px] lg:text-[36px] font-[750] tracking-[-0.03em] leading-[1.05]">
            {isId ? 'Bayar sesuai nominal,' : 'Pay exact amount,'} <br />
            {isId ? 'langsung aktif.' : 'instantly active.'}
          </h2>
          <p className="mt-3 text-[14px] leading-[1.6] text-[#6B6B6B]">
            {isId ? 'Gak ada tipu-tipu. Scan QRIS pakai DANA/GoPay/OVO/ShopeePay, bayar sesuai nominal, sistem otomatis verifikasi dan aktifkan langganan 30 hari. Semua real.' : 'No tricks. Scan QRIS with DANA/GoPay/OVO/ShopeePay, pay exact amount, system auto verifies and activates 30-day subscription. All real.'}
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-6 max-w-[960px] mx-auto">
          <div className="rounded-[20px] border border-[#E8E8E3] bg-[#FCFCF9] p-6">
            <div className="h-10 w-10 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center text-[16px] font-[700]">1</div>
            <h3 className="mt-4 text-[14px] font-[700]">{isId ? 'Pilih Paket' : 'Choose Plan'}</h3>
            <p className="mt-2 text-[12px] leading-[1.6] text-[#6B6B6B]">
              {isId ? 'Mulai Rp 5.000/bulan (Basic) sampai Rp 100.000/bulan (Business). Semua tanpa watermark. Starter Rp 15.000 paling populer.' : 'From $0.32/month (Basic) to $6.30/month (Business). All no watermark. Starter $0.95 most popular.'}
            </p>
            <div className="mt-3 flex gap-1.5 flex-wrap">
              <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#E8E8E3]">Rp 5k</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#0A0A0A] text-white">Rp 15k ★</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#E8E8E3]">Rp 35k</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-[#E8E8E3]">Rp 100k</span>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#E8E8E3] bg-[#0A0A0A] text-white p-6">
            <div className="h-10 w-10 rounded-[12px] bg-[#FFD60A] text-black flex items-center justify-center text-[16px] font-[700]">2</div>
            <h3 className="mt-4 text-[14px] font-[700]">{isId ? 'Scan QRIS / DANA' : 'Scan QRIS / DANA'}</h3>
            <p className="mt-2 text-[12px] leading-[1.6] text-white/60">
              {isId ? 'Sistem generate QRIS unik + Order ID AUTOCLIPP-XXXX. Scan pakai aplikasi e-wallet kamu, bayar sesuai nominal yang tertera.' : 'System generates unique QRIS + Order ID AUTOCLIPP-XXXX. Scan with your e-wallet app, pay exact amount shown.'}
            </p>
            <div className="mt-4 rounded-[12px] bg-white p-3 flex items-center justify-center">
              <div className="h-20 w-20 rounded-[8px] bg-[#F5F5F0] border border-dashed border-[#E8E8E3] flex items-center justify-center text-[10px] text-[#9B9B9B]">QRIS<br/>QR</div>
              <div className="ml-3 text-left">
                <div className="text-[11px] font-[700] text-black">QRIS</div>
                <div className="text-[10px] text-[#6B6B6B]">DANA • GoPay • OVO<br/>ShopeePay • BCA Mobile</div>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#E8E8E3] bg-[#FCFCF9] p-6">
            <div className="h-10 w-10 rounded-[12px] bg-green-500 text-white flex items-center justify-center text-[16px]">✓</div>
            <h3 className="mt-4 text-[14px] font-[700]">{isId ? 'Otomatis Aktif' : 'Auto Active'}</h3>
            <p className="mt-2 text-[12px] leading-[1.6] text-[#6B6B6B]">
              {isId ? 'Setelah bayar, sistem polling status tiap 3 detik. Kalo settlement terdeteksi, langganan aktif 30 hari + email notifikasi. Kalo auto belum, admin bisa manual approve.' : 'After payment, system polls status every 3s. If settlement detected, 30-day active + email. If auto not yet, admin can manual approve.'}
            </p>
            <div className="mt-3 rounded-[10px] bg-green-50 border border-green-200 p-2.5">
              <div className="text-[10px] font-[700] text-green-800">✓ {isId ? 'Real verification, bukan fake' : 'Real verification, not fake'}</div>
              <div className="text-[10px] text-green-700 mt-0.5">{isId ? 'Semua pembayaran real dari pengguna asli' : 'All payments real from genuine users'}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 max-w-[960px] mx-auto rounded-[16px] border border-[#E8E8E3] bg-white p-5">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h4 className="text-[12px] font-[700]">{isId ? 'Metode Pembayaran Lengkap' : 'Complete Payment Methods'}</h4>
              <p className="mt-1 text-[11px] text-[#6B6B6B] max-w-[420px]">{isId ? 'Support QRIS, DANA, GoPay, OVO, ShopeePay, Virtual Account BCA/Mandiri/BNI/BRI, Alfamart, Indomaret. Semua via gateway terverifikasi.' : 'Support QRIS, DANA, GoPay, OVO, ShopeePay, VA BCA/Mandiri/BNI/BRI, Alfamart, Indomaret. All via verified gateway.'}</p>
            </div>
            <div className="flex flex-wrap gap-1.5 content-start">
              {['QRIS', 'DANA', 'GoPay', 'OVO', 'ShopeePay', 'BCA VA', 'Mandiri VA', 'BNI VA', 'BRI VA', 'Alfamart', 'Indomaret'].map(m => (
                <span key={m} className="text-[10px] px-2.5 py-1 rounded-full bg-[#F5F5F0] border border-[#E8E8E3] font-[500]">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
