-- Bienes Raíces Altair — admin CMS schema
-- Run in the Supabase SQL editor (or via supabase db push).

create extension if not exists "pgcrypto";

create type public.staff_role as enum ('owner', 'assistant');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.staff_role not null default 'assistant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.properties (
  id text primary key,
  slug text not null unique,
  name text not null,
  status text not null default 'available',
  property_type text not null,
  featured boolean not null default false,
  published boolean not null default true,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index properties_status_idx on public.properties (status);
create index properties_featured_idx on public.properties (featured);
create index properties_published_idx on public.properties (published);
create index properties_updated_at_idx on public.properties (updated_at desc);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table public.audit_log (
  id bigserial primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  detail jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid()
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  );
$$;

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_log enable row level security;

-- Profiles: staff can read; owners can update roles
create policy "Staff can read profiles"
  on public.profiles for select
  to authenticated
  using (public.is_staff());

create policy "Users can update own profile name"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Owners can update any profile"
  on public.profiles for update
  to authenticated
  using (public.is_owner())
  with check (public.is_owner());

-- Properties: public read of published; staff full write (delete = owner only)
create policy "Anyone can read published properties"
  on public.properties for select
  to anon, authenticated
  using (published = true);

create policy "Staff can read all properties"
  on public.properties for select
  to authenticated
  using (public.is_staff());

create policy "Staff can insert properties"
  on public.properties for insert
  to authenticated
  with check (public.is_staff());

create policy "Staff can update properties"
  on public.properties for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

create policy "Owners can delete properties"
  on public.properties for delete
  to authenticated
  using (public.is_owner());

-- Site settings
create policy "Anyone can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "Staff can upsert site settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_staff());

create policy "Staff can update site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- Audit log: staff read; inserts via service role / staff
create policy "Staff can read audit log"
  on public.audit_log for select
  to authenticated
  using (public.is_staff());

create policy "Staff can insert audit log"
  on public.audit_log for insert
  to authenticated
  with check (public.is_staff());

-- Storage bucket for property images (create via dashboard if this fails)
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

create policy "Public read property images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

create policy "Staff upload property images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images' and public.is_staff());

create policy "Staff update property images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'property-images' and public.is_staff());

create policy "Owners delete property images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images' and public.is_owner());
