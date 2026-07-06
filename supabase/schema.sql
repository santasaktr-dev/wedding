create extension if not exists "pgcrypto";

create table if not exists public.content_versions (
  id uuid primary key default gen_random_uuid(),
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  published_by uuid references auth.users(id)
);

create unique index if not exists one_draft_content_version
on public.content_versions (status)
where status = 'draft';

create table if not exists public.content_sections (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.content_versions(id) on delete cascade,
  section_key text not null,
  language text not null check (language in ('en', 'th')),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (version_id, section_key, language)
);

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  status text not null check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  cover_image_id uuid,
  title_en text not null default '',
  title_th text not null default '',
  description_en text not null default '',
  description_th text not null default '',
  label_en text not null default '',
  label_th text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, status)
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  sort_order integer not null default 0,
  caption_en text not null default '',
  caption_th text not null default '',
  alt_en text not null default '',
  alt_th text not null default '',
  is_cover boolean not null default false,
  status text not null check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.content_versions enable row level security;
alter table public.content_sections enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;

create policy "Public read published content versions"
on public.content_versions for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated write content versions"
on public.content_versions for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public read published content sections"
on public.content_sections for select
using (
  exists (
    select 1 from public.content_versions
    where content_versions.id = content_sections.version_id
    and (content_versions.status = 'published' or auth.role() = 'authenticated')
  )
);

create policy "Authenticated write content sections"
on public.content_sections for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public read published gallery albums"
on public.gallery_albums for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated write gallery albums"
on public.gallery_albums for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Public read published gallery images"
on public.gallery_images for select
using (status = 'published' or auth.role() = 'authenticated');

create policy "Authenticated write gallery images"
on public.gallery_images for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Create a Supabase Storage bucket named `wedding-gallery`.
-- Recommended bucket mode: public read, authenticated write.
-- In Supabase Dashboard, add storage policies that allow:
-- 1. Public SELECT for objects in `wedding-gallery`.
-- 2. Authenticated INSERT/UPDATE/DELETE for objects in `wedding-gallery`.
