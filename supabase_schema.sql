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
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow public read access to skills" on public.skills for select using (true);
create policy "Allow public read access to education" on public.education for select using (true);
create policy "Allow public read access to tools" on public.tools for select using (true);
create policy "Allow public read access to projects" on public.projects for select using (true);
create policy "Allow public read access to project_tools" on public.project_tools for select using (true);
create policy "Allow public read access to trainings" on public.trainings for select using (true);

-- WRITE Policies (Authenticated Admin Access Only)
-- Profiles: Users can only update their own profile
create policy "Allow authenticated update to profiles" on public.profiles
  for update using (auth.uid() = id);

-- Skills
create policy "Allow authenticated insert to skills" on public.skills
  for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update to skills" on public.skills
  for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete to skills" on public.skills
  for delete using (auth.role() = 'authenticated');

-- Education
create policy "Allow authenticated insert to education" on public.education
  for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update to education" on public.education
  for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete to education" on public.education
  for delete using (auth.role() = 'authenticated');

-- Tools
create policy "Allow authenticated insert to tools" on public.tools
  for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update to tools" on public.tools
  for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete to tools" on public.tools
  for delete using (auth.role() = 'authenticated');

-- Projects
create policy "Allow authenticated insert to projects" on public.projects
  for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update to projects" on public.projects
  for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete to projects" on public.projects
  for delete using (auth.role() = 'authenticated');

-- Project Tools
create policy "Allow authenticated insert to project_tools" on public.project_tools
  for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update to project_tools" on public.project_tools
  for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete to project_tools" on public.project_tools
  for delete using (auth.role() = 'authenticated');

-- Trainings
create policy "Allow authenticated insert to trainings" on public.trainings
  for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update to trainings" on public.trainings
  for update using (auth.role() = 'authenticated');
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
create or replace trigger on_auth_user_created
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

create or replace trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_modified_column();

create or replace trigger update_projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_modified_column();

create or replace trigger update_trainings_updated_at
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
create policy "Public Access to Avatars"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Admin Upload to Avatars"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Admin Update Avatars"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Admin Delete Avatars"
  on storage.objects for delete
  using ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

create policy "Public Access to Screenshots"
  on storage.objects for select
  using ( bucket_id = 'screenshots' );

create policy "Admin Upload to Screenshots"
  on storage.objects for insert
  with check ( bucket_id = 'screenshots' and auth.role() = 'authenticated' );

create policy "Admin Update Screenshots"
  on storage.objects for update
  using ( bucket_id = 'screenshots' and auth.role() = 'authenticated' );

create policy "Admin Delete Screenshots"
  on storage.objects for delete
  using ( bucket_id = 'screenshots' and auth.role() = 'authenticated' );

-- =========================================================================
-- 5. SEED DATA (TEST DATA)
-- =========================================================================

-- 5.1 SEED TOOLS
insert into public.tools (id, name, category, icon_url)
values
  ('11111111-1111-1111-1111-111111111111', 'React', 'Framework', 'https://cdn.simpleicons.org/react/61DAFB'),
  ('22222222-2222-2222-2222-222222222222', 'Node.js', 'Language', 'https://cdn.simpleicons.org/nodedotjs/339933'),
  ('33333333-3333-3333-3333-333333333333', 'PostgreSQL', 'Database', 'https://cdn.simpleicons.org/postgresql/4169E1'),
  ('44444444-4444-4444-4444-444444444444', 'Tailwind CSS', 'Framework', 'https://cdn.simpleicons.org/tailwindcss/06B6D4'),
  ('55555555-5555-5555-5555-555555555555', 'Supabase', 'Database', 'https://cdn.simpleicons.org/supabase/3ECF8E'),
  ('66666666-6666-6666-6666-666666666666', 'TypeScript', 'Language', 'https://cdn.simpleicons.org/typescript/3178C6'),
  ('77777777-7777-7777-7777-777777777777', 'Docker', 'Platform', 'https://cdn.simpleicons.org/docker/2496ED'),
  ('88888888-8888-8888-8888-888888888888', 'Git', 'Platform', 'https://cdn.simpleicons.org/git/F05032')
on conflict (id) do nothing;

-- 5.2 SEED SKILLS
insert into public.skills (name, category, level, order_index)
values
  ('React / Next.js', 'Frontend', 5, 1),
  ('Tailwind CSS & CSS Grid', 'Frontend', 5, 2),
  ('TypeScript', 'Frontend', 4, 3),
  ('Node.js / Express', 'Backend', 4, 4),
  ('SQL & PostgreSQL design', 'Backend', 4, 5),
  ('Supabase Backend Services', 'Backend', 5, 6),
  ('Docker & Docker Compose', 'DevOps', 3, 7),
  ('CI/CD Pipelines (GitHub Actions)', 'DevOps', 4, 8);

-- 5.3 SEED EDUCATION
insert into public.education (degree, school, year_start, year_end, description, order_index)
values
  ('Diplôme d''Ingénieur en Informatique', 'Institut National des Sciences Appliquées', 2018, 2021, 'Spécialisation Génie Logiciel et Web de pointe. Projets d''étude axés sur l''architecture logicielle et les bases de données.', 1),
  ('Licence en Informatique', 'Université de Technologie', 2015, 2018, 'Bases théoriques solides : Algorithmique, Structures de Données, Systèmes et Réseaux, Programmation Orientée Objet.', 2);

-- 5.4 SEED PROJECTS
insert into public.projects (id, title, description, url, github_url, status, iframe_blocked, order_index)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    'SaaS de Gestion de Tâches', 
    'Une plateforme collaborative premium avec tableaux Kanban en temps réel, messagerie intégrée et facturation via Stripe.', 
    'https://taskflow-demo.vercel.app', 
    'https://github.com/example/taskflow', 
    'en_ligne', 
    false, 
    1
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
    'E-commerce High-Tech', 
    'Boutique en ligne moderne avec panier persistant, filtrage multicritères par facettes et espace de paiement sécurisé.', 
    'https://hitech-shop-demo.vercel.app', 
    'https://github.com/example/hitech-shop', 
    'en_ligne', 
    true, 
    2
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc', 
    'Plateforme IA Rédacteur', 
    'Générateur de contenu optimisé SEO utilisant les modèles Gemini de Google. Actuellement en cours de développement.', 
    null, 
    'https://github.com/example/seo-ai-writer', 
    'en_cours', 
    false, 
    3
  )
on conflict (id) do nothing;

-- 5.5 SEED PROJECT TOOLS (Linking projects to tools)
insert into public.project_tools (project_id, tool_id)
values
  -- Taskflow tools (React, Node, Postgres, Tailwind, Supabase)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),
  -- E-commerce tools (React, Tailwind, Supabase)
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'),
  -- SEO Writer tools (React, TypeScript, Tailwind)
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '66666666-6666-6666-6666-666666666666'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444')
on conflict (project_id, tool_id) do nothing;

-- 5.6 SEED TRAININGS
insert into public.trainings (title, url, platform, category, status, progress, notes)
values
  ('Supabase Mastery Course', 'https://www.udemy.com/course/supabase', 'Udemy', 'DevOps', 'termine', 100, 'Excellent cours couvrant RLS, Functions et Postgres Triggers en profondeur.'),
  ('Advanced React Design Patterns', 'https://frontendmasters.com/courses/advanced-react', 'Frontend Masters', 'React', 'en_cours', 65, 'Étude des HOC, custom hooks complexes, et state management optimal.'),
  ('Docker & Kubernetes: The Practical Guide', 'https://www.udemy.com/course/docker-kubernetes', 'Udemy', 'DevOps', 'a_faire', 0, 'À commencer après avoir fini la formation React.');
