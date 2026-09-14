import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8E8E3]/80 bg-[#FCFCF9]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center">
                <span className="text-[13px] font-[800] text-white tracking-[-0.05em]">A</span>
              </div>
              <span className="text-[14px] font-[700] tracking-[-0.03em]">autoclipp</span>
              <span className="ml-1 rounded-full bg-[#FFD60A] px-2 py-0.5 text-[10px] font-[700] tracking-[0.02em]">BETA</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">Features</Link>
              <Link href="/editor" className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">Editor</Link>
              <Link href="/projects" className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">Projects</Link>
              <Link href="/pricing" className="text-[13px] font-[500] text-[#6B6B6B] hover:text-[#0A0A0A] transition">Pricing</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="h-2 w-2 rounded-full bg-[#0A0A0A] animate-pulse" />
              <span className="text-[11px] font-[600] tracking-[0.02em] text-[#6B6B6B]">ALL SYSTEMS OPERATIONAL</span>
            </div>
            <Link href="/editor">
              <Button size="sm" className="h-8 px-4 text-[12px]">Open Editor</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
