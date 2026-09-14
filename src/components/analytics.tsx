"use client"

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

function getSessionId() {
  if (typeof window === 'undefined') return ''
  let sid = localStorage.getItem('autoclipp_session_id')
  if (!sid) {
    sid = crypto.randomUUID()
    localStorage.setItem('autoclipp_session_id', sid)
  }
  return sid
}

export function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    const track = async () => {
      try {
        const sessionId = getSessionId()
        await fetch(`${AUTH_URL}/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'page_view',
            page: pathname,
            referrer: document.referrer,
            session_id: sessionId,
            user_id: null,
          }),
          keepalive: true,
        }).catch(() => {})
      } catch {}
    }

    track()

    const start = Date.now()
    return () => {
      const duration = Math.floor((Date.now() - start) / 1000)
      if (duration > 5) {
        fetch(`${AUTH_URL}/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'time_on_page',
            page: pathname,
            session_id: getSessionId(),
            duration,
          }),
          keepalive: true,
        }).catch(() => {})
      }
    }
  }, [pathname])

  return null
}

export function useRealtimeAnalytics() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    const fetchRealtime = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/analytics/realtime`, { credentials: 'include' })
        if (res.ok) {
          const json = await res.json()
          setData(json.realtime)
        }
      } catch {}
    }
    
    fetchRealtime()
    const interval = setInterval(fetchRealtime, 5000)
    return () => clearInterval(interval)
  }, [])
  
  return data
}
