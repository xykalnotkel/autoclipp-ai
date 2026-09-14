"use client"

import { useEffect, useState } from 'react'

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'

type Feedback = {
  id: string
  name: string
  avatar: string
  rating: number
  message: string
  locale: string
  created_at: string
}

export function Testimonials({ locale }: { locale: string }) {
  const isId = locale === 'id'
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [stats, setStats] = useState({ total: 0, avg: 5 })
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/feedbacks?locale=${locale}&limit=12`)
        const data = await res.json()
        if (data.feedbacks) {
          setFeedbacks(data.feedbacks)
          setStats(data.stats || { total: data.feedbacks.length, avg: 4.9 })
        }
      } catch {}
      setLoading(false)
    }

    const checkUser = async () => {
      try {
        const res = await fetch(`${AUTH_URL}/auth/me`, { credentials: 'include' })
        const data = await res.json()
        if (data.user) setUser(data.user)
      } catch {}
    }

    fetchFeedbacks()
    checkUser()
  }, [locale])

  const handleSubmit = async () => {
    if (!message || message.length < 5) return
    setSubmitting(true)
    try {
      const res = await fetch(`${AUTH_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating, message, locale })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setMessage('')
        // Refresh
        const fresh = await fetch(`${AUTH_URL}/feedbacks?locale=${locale}&limit=12`)
        const freshData = await fresh.json()
        if (freshData.feedbacks) {
          setFeedbacks(freshData.feedbacks)
          setStats(freshData.stats)
        }
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch {}
    setSubmitting(false)
  }

  return (
    <section className="border-t border-[#E8E8E3] bg-[#FCFCF9] py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8E8E3] bg-white px-3 py-1 text-[11px] font-[600] tracking-[0.04em]">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              {isId ? 'TESTIMONI REAL' : 'REAL TESTIMONIALS'}
            </div>
            <h2 className="mt-4 text-[28px] lg:text-[36px] font-[750] tracking-[-0.03em] leading-[1.1]">
              {isId ? 'Dipercaya kreator Indonesia' : 'Trusted by Indonesian creators'}
            </h2>
            <p className="mt-3 text-[14px] text-[#6B6B6B] max-w-[420px] leading-[1.6]">
              {isId ? 'Rating dan feedback asli dari pengguna kami. Semua real, bukan fake. Diverifikasi dari pengguna terdaftar.' : 'Real ratings and feedback from our users. All genuine, not fake. Verified from registered users.'}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-[24px] font-[700]">{stats.avg.toFixed(1)}</span>
                <span className="text-[14px]">★</span>
              </div>
              <div className="h-6 w-px bg-[#E8E8E3]" />
              <div className="text-[12px] text-[#6B6B6B]">
                <div className="font-[600] text-black">{stats.total} {isId ? 'ulasan' : 'reviews'}</div>
                <div>{isId ? 'Rating rata-rata' : 'Average rating'}</div>
              </div>
            </div>
          </div>

          <div className="lg:w-[360px] rounded-[20px] border border-[#E8E8E3] bg-white p-5">
            <h3 className="text-[13px] font-[700]">{isId ? 'Tulis Ulasan' : 'Write a Review'}</h3>
            {!user ? (
              <div className="mt-4 rounded-[12px] bg-[#F5F5F0] p-4 text-center">
                <p className="text-[12px] text-[#6B6B6B]">{isId ? 'Login untuk memberi ulasan' : 'Login to leave a review'}</p>
                <a href={`/${locale}/auth/login`} className="mt-3 inline-flex rounded-full bg-[#0A0A0A] text-white px-4 py-2 text-[12px] font-[600]">Login</a>
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">{isId ? 'Rating Kamu' : 'Your Rating'}</div>
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className={`h-8 w-8 rounded-full border text-[14px] ${rating >= star ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]' : 'bg-white border-[#E8E8E3] text-[#9B9B9B]'}`}>★</button>
                    ))}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-[11px] font-[600] tracking-[0.06em] uppercase text-[#6B6B6B]">{isId ? 'Feedback' : 'Feedback'}</div>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={isId ? 'Ceritakan pengalamanmu (5-500 karakter)' : 'Share your experience (5-500 chars)'} className="mt-2 w-full rounded-[12px] border border-[#E8E8E3] bg-[#FCFCF9] p-3 text-[12px] outline-none focus:border-[#0A0A0A] min-h-[80px]" maxLength={500} />
                  <div className="mt-1 text-[10px] text-[#9B9B9B] text-right">{message.length}/500</div>
                </div>
                <button onClick={handleSubmit} disabled={submitting || message.length < 5} className="mt-4 w-full rounded-full bg-[#0A0A0A] text-white h-10 text-[12px] font-[600] disabled:opacity-50">
                  {submitting ? (isId ? 'Mengirim...' : 'Submitting...') : submitted ? (isId ? '✓ Terima kasih!' : '✓ Thanks!') : (isId ? 'Kirim Ulasan' : 'Submit Review')}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[16px] border border-[#E8E8E3] bg-white p-5 animate-pulse">
                <div className="h-4 w-24 bg-[#F5F5F0] rounded" />
                <div className="mt-3 h-12 w-full bg-[#F5F5F0] rounded" />
              </div>
            ))
          ) : feedbacks.length ? feedbacks.map(fb => (
            <div key={fb.id} className="rounded-[16px] border border-[#E8E8E3] bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center text-[11px] font-[700]">
                    {fb.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div>
                    <div className="text-[12px] font-[600]">{fb.name}</div>
                    <div className="text-[10px] text-[#9B9B9B]">{new Date(fb.created_at).toLocaleDateString(isId ? 'id-ID' : 'en-US')}</div>
                  </div>
                </div>
                <div className="flex text-[12px] text-[#FFD60A]">{"★".repeat(fb.rating)}<span className="text-[#E8E8E3]">{"★".repeat(5 - fb.rating)}</span></div>
              </div>
              <p className="mt-3 text-[12px] leading-[1.6] text-[#3A3A3A]">"{fb.message}"</p>
              <div className="mt-3 inline-flex rounded-full bg-[#F5F5F0] border border-[#E8E8E3] px-2 py-1 text-[10px] font-[500] text-[#6B6B6B]">{isId ? 'Pengguna Terverifikasi' : 'Verified User'} • {fb.locale?.toUpperCase()}</div>
            </div>
          )) : (
            <div className="col-span-3 rounded-[16px] border border-dashed border-[#E8E8E3] bg-white p-8 text-center">
              <div className="text-[12px] text-[#6B6B6B]">{isId ? 'Belum ada ulasan. Jadilah yang pertama!' : 'No reviews yet. Be the first!'}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
