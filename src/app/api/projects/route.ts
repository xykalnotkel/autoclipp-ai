import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Try Cloudflare auth fallback
    const authToken = req.cookies.get('auth_token')?.value
    let userId = user?.id

    if (!userId && authToken) {
      // Verify with Cloudflare worker
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'
      try {
        const res = await fetch(`${authUrl}/auth/me`, {
          headers: { 
            'Cookie': `auth_token=${authToken}`,
            'Authorization': `Bearer ${authToken}`
          },
          cache: 'no-store'
        })
        if (res.ok) {
          const data = await res.json()
          userId = data.user?.id
        }
      } catch {}
    }

    if (!userId) {
      return NextResponse.json({ projects: [] }, { 
        headers: { 'Cache-Control': 'no-store' }
      })
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*, clips(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ projects: [], error: error.message })
    }

    return NextResponse.json({ projects: data || [] }, {
      headers: {
        'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (e: any) {
    return NextResponse.json({ projects: [], error: e.message })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    
    const { data: { user } } = await supabase.auth.getUser()
    let userId = user?.id

    const authToken = req.cookies.get('auth_token')?.value
    if (!userId && authToken) {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'https://autoclipp-auth.akuntiktok76y.workers.dev'
      try {
        const res = await fetch(`${authUrl}/auth/me`, {
          headers: { 
            'Cookie': `auth_token=${authToken}`,
            'Authorization': `Bearer ${authToken}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          userId = data.user?.id
        }
      } catch {}
    }

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title: body.title || 'Untitled Project',
        duration: body.duration,
        status: 'completed',
        video_url: body.video_url
      })
      .select()
      .single()

    if (error) throw error

    if (body.clips && data) {
      const clipsToInsert = body.clips.map((c: any) => ({
        project_id: data.id,
        user_id: userId,
        start_time: c.start,
        end_time: c.end,
        duration: c.duration,
        hook_title: c.hook,
        virality_score: c.score,
        label: c.label,
        style: body.style || 'hormozi',
        transcript: c.words
      }))

      await supabase.from('clips').insert(clipsToInsert)
    }

    return NextResponse.json({ project: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
