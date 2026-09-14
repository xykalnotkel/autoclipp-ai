import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
            <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
          </Link>
          <Link href="/editor"><Button size="sm" className="h-8">Open Editor</Button></Link>
        </div>
      </div>

      <div className="mx-auto max-w-[960px] px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-[560px] mx-auto">
          <h1 className="text-[36px] lg:text-[48px] font-[750] tracking-[-0.04em] leading-[0.95]">Free forever.<br/>Pay when you scale.</h1>
          <p className="mt-4 text-[14px] leading-[1.6] text-[#6B6B6B]">All core features free. No watermark, no credit card. Start creating viral clips in seconds.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[720px] mx-auto">
          <Card className="p-7">
            <div className="text-[12px] font-[700] tracking-[0.06em] uppercase">Free</div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] font-[750] tracking-[-0.03em]">$0</span>
              <span className="text-[13px] text-[#6B6B6B]">/month</span>
            </div>
            <div className="mt-6 space-y-3 text-[13px]">
              {['Unlimited projects','Unlimited clips','6 subtitle styles','6 animations','1080x1920 60fps export','No watermark','Auto hook detection','Smart face tracking','Bulk export'].map(f=>(
                <div key={f} className="flex gap-2.5"><span className="h-5 w-5 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[10px]">✓</span><span>{f}</span></div>
              ))}
            </div>
            <Link href="/editor" className="block mt-8"><Button className="w-full">Start Free</Button></Link>
          </Card>

          <Card className="p-7 bg-[#0A0A0A] text-white border-[#0A0A0A]">
            <div className="flex items-center justify-between">
              <div className="text-[12px] font-[700] tracking-[0.06em] uppercase text-white/60">Pro</div>
              <span className="rounded-full bg-[#FFD60A] text-black px-2.5 py-1 text-[10px] font-[700]">POPULAR</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[32px] font-[750] tracking-[-0.03em]">$19</span>
              <span className="text-[13px] text-white/60">/month</span>
            </div>
            <div className="mt-6 space-y-3 text-[13px] text-white/80">
              {['Everything in Free','4K export','Custom fonts upload','Team workspace 5 seats','API access','Priority support','Advanced analytics','Remove background','Auto B-roll'].map(f=>(
                <div key={f} className="flex gap-2.5"><span className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-[10px]">✓</span><span>{f}</span></div>
              ))}
            </div>
            <Button variant="secondary" className="w-full mt-8 bg-white text-black hover:bg-[#F5F5F0]">Upgrade to Pro</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
