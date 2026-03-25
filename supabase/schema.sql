create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  address text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin')),
  push_enabled boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.slides (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_url text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Umum',
  content text not null,
  status text not null default 'baru' check (status in ('baru','diproses','selesai')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.slides enable row level security;
alter table public.reports enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create policy "profiles read own" on public.profiles for select using (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);
create policy "announcements public read" on public.announcements for select using (true);
create policy "slides public read" on public.slides for select using (true);
create policy "reports user insert" on public.reports for insert with check (auth.uid() = created_by);
create policy "reports user read own or admin" on public.reports for select using (
  auth.uid() = created_by or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "reports admin update" on public.reports for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "announcements admin insert" on public.announcements for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "slides admin insert" on public.slides for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
