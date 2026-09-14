"use client"
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function CallbackPage() {
  const params = useSearchParams()
  useEffect(() => {
    const token = params.get('token')
    if (token) {
      document.cookie = `auth_token=${token}; path=/; max-age=${60*60*24*7}; SameSite=Lax; Secure`
      window.location.href = '/id/editor'
    }
  }, [params])
  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>
}
