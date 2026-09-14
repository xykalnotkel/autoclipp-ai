import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slncetmqstgiiobeqhqk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbmNldG1xc3RnaWlvYmVxaHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MjU5OTcsImV4cCI6MjEwMjUwMTk5N30.3SoGI4zz2dov4gA4Dgc0Ca83ypNsgMoPxPSZqGxu5qg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Project = {
  id: string
  created_at: string
  title: string
  video_url: string
  status: 'processing' | 'completed' | 'failed'
  clips: Clip[]
  user_id?: string
}

export type Clip = {
  id: string
  project_id: string
  start_time: number
  end_time: number
  hook_title: string
  virality_score: number
  transcript: any
  style: string
}
