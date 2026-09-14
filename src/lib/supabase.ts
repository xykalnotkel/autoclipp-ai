import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://slncetmqstgiiobeqhqk.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_QNOPMiH8Vn-RrHW0ak1fxA_GzjPTcHg'

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
