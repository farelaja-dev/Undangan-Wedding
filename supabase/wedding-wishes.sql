-- Run once in your Supabase project's SQL Editor.
-- Only public names/messages are stored here; RSVP details stay in WhatsApp.
begin;
create table if not exists public.wedding_wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 150),
  message text not null check (char_length(btrim(message)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists wedding_wishes_newest on public.wedding_wishes (created_at desc, id desc);
alter table public.wedding_wishes enable row level security;
revoke all on public.wedding_wishes from public, anon, authenticated;
grant usage on schema public to anon;
grant select on public.wedding_wishes to anon;
grant insert (name, message) on public.wedding_wishes to anon;
drop policy if exists "Guests read wishes" on public.wedding_wishes;
create policy "Guests read wishes" on public.wedding_wishes for select to anon using (true);
drop policy if exists "Guests add wishes" on public.wedding_wishes;
create policy "Guests add wishes" on public.wedding_wishes for insert to anon with check (true);
-- Guests cannot update/delete wishes or choose timestamps/IDs.
-- The project owner can moderate/delete messages through Supabase Table Editor.
commit;
