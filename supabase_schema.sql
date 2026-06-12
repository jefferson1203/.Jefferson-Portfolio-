-- SUPABASE DATABASE SCHEMA FOR DEVELOPER PORTFOLIO
-- Execute this script in your Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. TABLES CREATION
-- =========================================================================

-- Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  title text default 'Développeur Full Stack',
  bio text,
  avatar_url text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  email text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Skills Table
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- e.g., 'Frontend', 'Backend', 'DevOps', 'Mobile'
  level integer check (level >= 1 and level <= 100) not null,
  icon_url text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Education Table
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  school text not null,
  year_start integer not null,
  year_end integer, -- Null means current
  description text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tools Table
create table if not exists public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text,
  category text not null -- e.g., 'Language', 'Framework', 'Database', 'Platform'
);

-- Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text, -- Deployment/Live demo URL
  github_url text,
  status text check (status in ('en_ligne', 'en_cours', 'archive')) default 'en_cours' not null,
  iframe_blocked boolean default false not null,
  screenshot_url text, -- Fallback screenshot URL
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Project Tools (Many-to-Many Relationship Table)
create table if not exists public.project_tools (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  tool_id uuid references public.tools(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(project_id, tool_id)
);

-- Trainings Table
create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  platform text not null, -- e.g., 'Udemy', 'YouTube', 'OpenClassrooms'
  category text not null, -- e.g., 'React', 'DevOps', 'Design'
  status text check (status in ('a_faire', 'en_cours', 'termine')) default 'a_faire' not null,
  progress integer check (progress >= 0 and progress <= 100) default 0 not null,
  notes text,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.tools enable row level security;
alter table public.projects enable row level security;
alter table public.project_tools enable row level security;
alter table public.trainings enable row level security;

-- SELECT Policies (Public Access for Everyone)
drop policy if exists "Allow public read access to profiles" on public.profiles;
create policy "Allow public read access to profiles" on public.profiles for select using (true);

drop policy if exists "Allow public read access to skills" on public.skills;
create policy "Allow public read access to skills" on public.skills for select using (true);

drop policy if exists "Allow public read access to education" on public.education;
create policy "Allow public read access to education" on public.education for select using (true);

drop policy if exists "Allow public read access to tools" on public.tools;
create policy "Allow public read access to tools" on public.tools for select using (true);

drop policy if exists "Allow public read access to projects" on public.projects;
create policy "Allow public read access to projects" on public.projects for select using (true);

drop policy if exists "Allow public read access to project_tools" on public.project_tools;
create policy "Allow public read access to project_tools" on public.project_tools for select using (true);

drop policy if exists "Allow public read access to trainings" on public.trainings;
create policy "Allow public read access to trainings" on public.trainings for select using (true);

-- WRITE Policies (Authenticated Admin Access Only)
-- Profiles: Users can only update/insert their own profile
drop policy if exists "Allow authenticated update to profiles" on public.profiles;
create policy "Allow authenticated update to profiles" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Allow authenticated insert to profiles" on public.profiles;
create policy "Allow authenticated insert to profiles" on public.profiles
  for insert with check (auth.uid() = id);

-- Skills
drop policy if exists "Allow authenticated insert to skills" on public.skills;
create policy "Allow authenticated insert to skills" on public.skills
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update to skills" on public.skills;
create policy "Allow authenticated update to skills" on public.skills
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete to skills" on public.skills;
create policy "Allow authenticated delete to skills" on public.skills
  for delete using (auth.role() = 'authenticated');

-- Education
drop policy if exists "Allow authenticated insert to education" on public.education;
create policy "Allow authenticated insert to education" on public.education
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update to education" on public.education;
create policy "Allow authenticated update to education" on public.education
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete to education" on public.education;
create policy "Allow authenticated delete to education" on public.education
  for delete using (auth.role() = 'authenticated');

-- Tools
drop policy if exists "Allow authenticated insert to tools" on public.tools;
create policy "Allow authenticated insert to tools" on public.tools
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update to tools" on public.tools;
create policy "Allow authenticated update to tools" on public.tools
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete to tools" on public.tools;
create policy "Allow authenticated delete to tools" on public.tools
  for delete using (auth.role() = 'authenticated');

-- Projects
drop policy if exists "Allow authenticated insert to projects" on public.projects;
create policy "Allow authenticated insert to projects" on public.projects
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update to projects" on public.projects;
create policy "Allow authenticated update to projects" on public.projects
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete to projects" on public.projects;
create policy "Allow authenticated delete to projects" on public.projects
  for delete using (auth.role() = 'authenticated');

-- Project Tools
drop policy if exists "Allow authenticated insert to project_tools" on public.project_tools;
create policy "Allow authenticated insert to project_tools" on public.project_tools
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update to project_tools" on public.project_tools;
create policy "Allow authenticated update to project_tools" on public.project_tools
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete to project_tools" on public.project_tools;
create policy "Allow authenticated delete to project_tools" on public.project_tools
  for delete using (auth.role() = 'authenticated');

-- Trainings
drop policy if exists "Allow authenticated insert to trainings" on public.trainings;
create policy "Allow authenticated insert to trainings" on public.trainings
  for insert with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated update to trainings" on public.trainings;
create policy "Allow authenticated update to trainings" on public.trainings
  for update using (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated delete to trainings" on public.trainings;
create policy "Allow authenticated delete to trainings" on public.trainings
  for delete using (auth.role() = 'authenticated');

-- =========================================================================
-- 3. TRIGGERS AND PROCEDURES
-- =========================================================================

-- Trigger function for automatic profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, title, bio)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'Développeur Full Stack',
    'Bienvenue sur mon portfolio ! Modifiez cette biographie dans l''espace d''administration.'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger attached to auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Trigger function for auto-updating timestamps
create or replace function public.update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_modified_column();

drop trigger if exists update_projects_updated_at on public.projects;
create trigger update_projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_modified_column();

drop trigger if exists update_trainings_updated_at on public.trainings;
create trigger update_trainings_updated_at
  before update on public.trainings
  for each row execute procedure public.update_modified_column();

-- =========================================================================
-- 4. STORAGE BUCKETS CONFIGURATION (via SQL inserts)
-- =========================================================================

-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('screenshots', 'screenshots', true)
on conflict (id) do nothing;

-- RLS policies for storage buckets (selecting objects)
drop policy if exists "Public Access to Avatars" on storage.objects;
create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

drop policy if exists "Admin Upload to Avatars" on storage.objects;
create policy "Admin Upload to Avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

drop policy if exists "Admin Update Avatars" on storage.objects;
create policy "Admin Update Avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

drop policy if exists "Admin Delete Avatars" on storage.objects;
create policy "Admin Delete Avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

drop policy if exists "Public Access to Screenshots" on storage.objects;
create policy "Public Access to Screenshots"
  on storage.objects for select
  using ( bucket_id = 'screenshots' );

drop policy if exists "Admin Upload to Screenshots" on storage.objects;
create policy "Admin Upload to Screenshots"
  on storage.objects for insert
  with check ( bucket_id = 'screenshots' and auth.role() = 'authenticated' );

drop policy if exists "Admin Update Screenshots" on storage.objects;
create policy "Admin Update Screenshots"
  on storage.objects for update
  using ( bucket_id = 'screenshots' and auth.role() = 'authenticated' );

drop policy if exists "Admin Delete Screenshots" on storage.objects;
create policy "Admin Delete Screenshots"
  on storage.objects for delete
  using ( bucket_id = 'screenshots' and auth.role() = 'authenticated' );
