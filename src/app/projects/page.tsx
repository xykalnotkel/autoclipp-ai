"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

type Project = {
  id: string
  title: string
  created_at: string
  video_url: string
  status: string
  duration: number
  clips?: { count: number }[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*, clips(count)')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProjects(data)
      }
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-[#FCFCF9]">
      <div className="sticky top-0 z-40 border-b border-[#E8E8E3] bg-[#FCFCF9]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8 h-[56px] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-[#0A0A0A] flex items-center justify-center text-white text-[12px] font-[800]">A</div>
              <span className="text-[13px] font-[700] tracking-[-0.02em]">autoclipp</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 rounded-full bg-[#F5F5F0] p-1 border border-[#E8E8E3]">
              <Link href="/" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B]">Home</Link>
              <Link href="/editor" className="px-3 py-1 rounded-full text-[12px] font-[500] text-[#6B6B6B]">Editor</Link>
              <span className="px-3 py-1 rounded-full bg-[#0A0A0A] text-white text-[12px] font-[600]">Projects</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {user && <span className="hidden md:block text-[12px] text-[#6B6B6B] mr-2">{user.email}</span>}
            <Link href="/editor"><Button size="sm" className="h-8">New Project</Button></Link>
            <Button size="sm" variant="outline" className="h-8" onClick={handleSignOut}>Sign out</Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[28px] font-[700] tracking-[-0.03em]">Projects</h1>
            <p className="mt-2 text-[13px] text-[#6B6B6B]">All your video projects in one place</p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="rounded-full border border-[#E8E8E3] bg-white px-3 py-1.5 text-[11px] font-[600]">{projects.length} projects</div>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <Card key={i} className="p-0 overflow-hidden animate-pulse">
                <div className="aspect-[16/9] bg-[#F5F5F0]" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-[#F5F5F0] rounded" />
                  <div className="h-3 bg-[#F5F5F0] rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(p => (
              <Card key={p.id} className="overflow-hidden p-0 group hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition">
                <div className="aspect-[16/9] bg-[#F5F5F0] relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-[12px] bg-[#0A0A0A] flex items-center justify-center text-white font-[700]">A</div>
                  </div>
                  <div className="absolute top-3 left-3 rounded-full bg-[#0A0A0A] text-white px-2.5 py-1 text-[10px] font-[700] tracking-[0.04em] uppercase">{p.status}</div>
                  {p.duration && <div className="absolute bottom-3 right-3 rounded-full bg-white border border-[#E8E8E3] px-2 py-1 text-[10px] font-[600]">{Math.floor(p.duration/60)}:{String(Math.floor(p.duration%60)).padStart(2,'0')}</div>}
                </div>
                <div className="p-4">
                  <div className="text-[13px] font-[600] tracking-[-0.01em] line-clamp-1">{p.title}</div>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-[#6B6B6B]">
                    <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    <span className="h-1 w-1 rounded-full bg-[#E8E8E3]" />
                    <span>{(p as any).clips?.[0]?.count || 0} clips</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link href={`/editor?project=${p.id}`} className="flex-1"><Button size="sm" variant="secondary" className="w-full h-8 text-[12px]">Open</Button></Link>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">...</Button>
                  </div>
                </div>
              </Card>
            ))}

            <Link href="/editor" className="rounded-[20px] border border-dashed border-[#E8E8E3] bg-white p-6 flex flex-col items-center justify-center min-h-[240px] hover:border-[#0A0A0A] hover:bg-[#FCFCF9] transition group">
              <div className="h-10 w-10 rounded-[12px] bg-[#0A0A0A] text-white flex items-center justify-center group-hover:scale-105 transition">+</div>
              <div className="mt-3 text-[13px] font-[600]">Create new project</div>
              <div className="text-[11px] text-[#6B6B6B] mt-1">Upload video or YouTube URL</div>
            </Link>
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="mt-16 text-center py-16 rounded-[20px] border border-dashed border-[#E8E8E3] bg-white">
            <div className="mx-auto h-12 w-12 rounded-[12px] bg-[#F5F5F0] flex items-center justify-center">—</div>
            <div className="mt-4 text-[14px] font-[600]">No projects yet</div>
            <div className="mt-1 text-[12px] text-[#6B6B6B]">Create your first project to get started</div>
            <Link href="/editor" className="inline-block mt-4"><Button size="sm">Create Project</Button></Link>
          </div>
        )}
      </div>
    </div>
  )
}
