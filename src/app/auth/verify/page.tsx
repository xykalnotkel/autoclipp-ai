"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function VerifyContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token found')
      return
    }

    const verify = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/auth/email/verify?token=${token}`, {
          credentials: 'include'
        })
        
        if (res.redirected) {
          window.location.href = res.url
          return
        }

        const data = await res.json()
        
        if (!res.ok) {
          throw new Error(data.error || 'Verification failed')
        }

        setStatus('success')
        setTimeout(() => {
          window.location.href = '/editor'
        }, 1500)
      } catch (e: any) {
        setStatus('error')
        setMessage(e.message)
      }
    }

    verify()
  }, [token])

  return (
    <Card className="w-full max-w-[400px] p-8 text-center">
      {status === 'loading' && (
        <>
          <div className="mx-auto h-10 w-10 rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" />
          <div className="mt-4 text-[14px] font-[600]">Verifying email...</div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">Please wait, checking your verification link</div>
        </>
      )}
      
      {status === 'success' && (
        <>
          <div className="mx-auto h-12 w-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center">✓</div>
          <div className="mt-4 text-[16px] font-[700]">Email verified</div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">Redirecting to editor...</div>
        </>
      )}
      
      {status === 'error' && (
        <>
          <div className="mx-auto h-12 w-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">✕</div>
          <div className="mt-4 text-[14px] font-[600]">Verification failed</div>
          <div className="text-[12px] text-[#6B6B6B] mt-1">{message}</div>
          <div className="mt-6 flex gap-2 justify-center">
            <Link href="/auth/login"><Button size="sm" variant="outline" className="h-8">Try again</Button></Link>
            <Link href="/"><Button size="sm" className="h-8">Home</Button></Link>
          </div>
        </>
      )}
    </Card>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#FCFCF9] flex items-center justify-center p-6">
      <Suspense fallback={<Card className="w-full max-w-[400px] p-8 text-center"><div className="h-10 w-10 mx-auto rounded-full border-2 border-[#E8E8E3] border-t-[#0A0A0A] animate-spin" /></Card>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
