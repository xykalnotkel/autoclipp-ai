-- AutoClipp Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID
create extension if not exists "uuid-ossp";

-- Projects table
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  video_url text,
  video_public_id text,
  thumbnail_url text,
  duration numeric,
  status text default 'processing' check (status in ('processing', 'completed', 'failed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Clips table
create table if not exists clips (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  start_time numeric not null,
  end_time numeric not null,
  duration numeric,
  hook_title text,
  virality_score integer,
  label text,
  style text default 'hormozi',
  transcript jsonb,
  created_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_created_at on projects(created_at desc);
create index if not exists idx_clips_project_id on clips(project_id);
create index if not exists idx_clips_user_id on clips(user_id);

-- RLS
alter table projects enable row level security;
alter table clips enable row level security;

-- Policies - users can only see their own data
create policy "Users can view own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on projects for delete using (auth.uid() = user_id);

create policy "Users can view own clips" on clips for select using (auth.uid() = user_id);
create policy "Users can insert own clips" on clips for insert with check (auth.uid() = user_id);
create policy "Users can update own clips" on clips for update using (auth.uid() = user_id);
create policy "Users can delete own clips" on clips for delete using (auth.uid() = user_id);

-- Storage bucket for thumbnails (optional)
insert into storage.buckets (id, name, public) values ('autoclipp', 'autoclipp', true)
on conflict (id) do nothing;

create policy "Public read" on storage.objects for select using (bucket_id = 'autoclipp');
create policy "Users can upload" on storage.objects for insert with check (bucket_id = 'autoclipp' and auth.role() = 'authenticated');
