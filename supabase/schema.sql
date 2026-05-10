-- Kill Team 2026 Supabase schema for session sharing + realtime sync.
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Sessions
-- ---------------------------------------------------------------------------
create table if not exists public.kt_sessions (
  code text primary key,
  host_code text not null,
  status text not null default 'waiting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kt_sessions_code_format check (char_length(code) between 4 and 16)
);

create index if not exists kt_sessions_updated_at_idx
  on public.kt_sessions (updated_at desc);

-- ---------------------------------------------------------------------------
-- Session armies (shared by participants)
-- ---------------------------------------------------------------------------
create table if not exists public.kt_session_armies (
  id uuid primary key default gen_random_uuid(),
  session_code text not null references public.kt_sessions(code) on delete cascade,
  owner_code text not null,
  owner_name text,
  army_name text not null,
  army_type_name text not null,
  army_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint kt_session_armies_unique_owner_per_session unique (session_code, owner_code)
);

create index if not exists kt_session_armies_session_code_idx
  on public.kt_session_armies (session_code);

create index if not exists kt_session_armies_updated_at_idx
  on public.kt_session_armies (updated_at desc);

-- ---------------------------------------------------------------------------
-- Session battle state (host publishes current battle state)
-- ---------------------------------------------------------------------------
create table if not exists public.kt_session_state (
  session_code text primary key references public.kt_sessions(code) on delete cascade,
  battle_state jsonb not null,
  updated_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kt_session_state_updated_at_idx
  on public.kt_session_state (updated_at desc);

-- ---------------------------------------------------------------------------
-- Updated-at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_kt_sessions_updated_at on public.kt_sessions;
create trigger trg_kt_sessions_updated_at
before update on public.kt_sessions
for each row
execute function public.set_updated_at();

drop trigger if exists trg_kt_session_armies_updated_at on public.kt_session_armies;
create trigger trg_kt_session_armies_updated_at
before update on public.kt_session_armies
for each row
execute function public.set_updated_at();

drop trigger if exists trg_kt_session_state_updated_at on public.kt_session_state;
create trigger trg_kt_session_state_updated_at
before update on public.kt_session_state
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.kt_session_armies;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.kt_session_state;
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- NOTE: These policies allow public anon/authenticated usage because current app
-- flow does not use Supabase Auth yet. Session code acts as the collaboration key.
-- If you add Auth later, tighten these policies by user/session ownership.
-- ---------------------------------------------------------------------------
alter table public.kt_sessions enable row level security;
alter table public.kt_session_armies enable row level security;
alter table public.kt_session_state enable row level security;

-- Sessions policies
drop policy if exists "kt_sessions_select_public" on public.kt_sessions;
create policy "kt_sessions_select_public"
on public.kt_sessions
for select
using (true);

drop policy if exists "kt_sessions_insert_public" on public.kt_sessions;
create policy "kt_sessions_insert_public"
on public.kt_sessions
for insert
with check (true);

drop policy if exists "kt_sessions_update_public" on public.kt_sessions;
create policy "kt_sessions_update_public"
on public.kt_sessions
for update
using (true)
with check (true);

-- Session armies policies
drop policy if exists "kt_session_armies_select_public" on public.kt_session_armies;
create policy "kt_session_armies_select_public"
on public.kt_session_armies
for select
using (true);

drop policy if exists "kt_session_armies_insert_public" on public.kt_session_armies;
create policy "kt_session_armies_insert_public"
on public.kt_session_armies
for insert
with check (true);

drop policy if exists "kt_session_armies_update_public" on public.kt_session_armies;
create policy "kt_session_armies_update_public"
on public.kt_session_armies
for update
using (true)
with check (true);

-- Session state policies
drop policy if exists "kt_session_state_select_public" on public.kt_session_state;
create policy "kt_session_state_select_public"
on public.kt_session_state
for select
using (true);

drop policy if exists "kt_session_state_insert_public" on public.kt_session_state;
create policy "kt_session_state_insert_public"
on public.kt_session_state
for insert
with check (true);

drop policy if exists "kt_session_state_update_public" on public.kt_session_state;
create policy "kt_session_state_update_public"
on public.kt_session_state
for update
using (true)
with check (true);
