-- ============================================================
-- FoodBridge schema + Row Level Security (Supabase / Postgres 15)
-- Columns are quoted camelCase to mirror the TS types 1:1.
-- Run in Supabase SQL editor, or `supabase db push` after copying
-- this file into a migration.
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null check (role in ('donor', 'ngo', 'volunteer', 'admin')),
  "orgName" text,
  approved boolean not null default true,
  address text,
  lat double precision,
  lng double precision,
  "createdAt" timestamptz not null default now()
);

-- ---------- donations ----------
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  "isVeg" boolean not null,
  servings integer not null check (servings between 1 and 2000),
  kg numeric(8, 2) not null check (kg > 0 and kg <= 500),
  "packedAt" timestamptz not null,
  "bestBefore" timestamptz not null,
  address text not null,
  lat double precision not null,
  lng double precision not null,
  "photoUrl" text,
  "donorId" uuid not null references public.profiles (id) on delete cascade,
  "donorName" text not null,
  "ngoId" uuid references public.profiles (id),
  "ngoName" text,
  "volunteerId" uuid references public.profiles (id),
  "volunteerName" text,
  status text not null default 'available'
    check (status in ('available', 'claimed', 'picked_up', 'delivered', 'expired', 'cancelled')),
  "createdAt" timestamptz not null default now()
);

create index if not exists donations_status_idx on public.donations (status, "bestBefore");
create index if not exists donations_donor_idx on public.donations ("donorId");
create index if not exists donations_ngo_idx on public.donations ("ngoId");
create index if not exists donations_volunteer_idx on public.donations ("volunteerId");

-- ---------- notifications ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  "userId" uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null default '',
  "donationId" uuid references public.donations (id) on delete set null,
  read boolean not null default false,
  "createdAt" timestamptz not null default now()
);

create index if not exists notifications_user_idx on public.notifications ("userId", "createdAt" desc);

-- ---------- reports ----------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  "donationId" uuid references public.donations (id) on delete set null,
  "donationTitle" text not null default '',
  "reporterId" uuid not null references public.profiles (id) on delete cascade,
  "reporterName" text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'resolved')),
  "createdAt" timestamptz not null default now()
);

-- ============================================================
-- RLS: enabled + explicit policies on EVERY table
-- ============================================================
alter table public.profiles enable row level security;
alter table public.donations enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

-- helper: current user's admin-ness
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- ---------- profiles policies ----------
create policy "profiles: read own, admin, or see approved NGOs"
  on public.profiles for select
  using (
    id = auth.uid()
    or public.is_admin()
    or (role = 'ngo' and approved)          -- approved NGO list is public info for matching
  );

create policy "profiles: insert own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles: update own or admin (approve/block NGOs)"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "profiles: admin delete"
  on public.profiles for delete
  using (public.is_admin());

-- ---------- donations policies ----------
create policy "donations: read live ones + anything you're involved in or admin"
  on public.donations for select
  using (
    (status in ('available', 'claimed', 'picked_up') and "bestBefore" > now())  -- expired items auto-hide
    or "donorId" = auth.uid()
    or "ngoId" = auth.uid()
    or "volunteerId" = auth.uid()
    or public.is_admin()
  );

create policy "donations: donors post their own"
  on public.donations for insert
  with check ("donorId" = auth.uid());

/*
  update is role-scoped:
    donor   → own listing while still available (edit / cancel)
    NGO     → claim an available listing (SET status/ngoId)
              advance ones it claimed (pickup/delivered)
    volunteer → set volunteerId on a claimed listing + advance own tasks
    admin   → everything
  NOTE (MVP): column-level diffs are enforced in app logic; RLS limits rows,
  not individual columns.
*/
create policy "donations: role-scoped updates"
  on public.donations for update
  using (
    ("donorId" = auth.uid() and status = 'available')
    or ("ngoId" = auth.uid())
    or (
      "volunteerId" = auth.uid()
    )
    or (
      "donorId" is distinct from auth.uid()
      and exists (select 1 from public.profiles me where me.id = auth.uid()
                  and me.role = 'ngo' and me.approved)
      and status = 'available'
    )
    or (
      "ngoId" is not null and "volunteerId" is null
      and exists (select 1 from public.profiles me where me.id = auth.uid() and me.role = 'volunteer')
      and status = 'claimed'
    )
    or public.is_admin()
  )
  with check (
    ("donorId" = auth.uid() and status = 'available')
    or ("ngoId" = auth.uid())
    or ("volunteerId" = auth.uid())
    or public.is_admin()
    or (
      exists (select 1 from public.profiles me where me.id = auth.uid()
              and ((me.role = 'ngo' and me.approved) or me.role = 'volunteer'))
    )
  );

create policy "donations: donor deletes own available listing, admin any"
  on public.donations for delete
  using (
    ("donorId" = auth.uid() and status = 'available')
    or public.is_admin()
  );

-- ---------- notifications policies ----------
create policy "notifications: read own"
  on public.notifications for select
  using ("userId" = auth.uid() or public.is_admin());

-- system fan-out: any authenticated user can address notifications to others
-- (donor → nearby NGOs, NGO → donor, volunteer → donor+NGO)
create policy "notifications: authenticated fan-out insert"
  on public.notifications for insert
  with check (auth.uid() is not null);

create policy "notifications: mark own read"
  on public.notifications for update
  using ("userId" = auth.uid() or public.is_admin());

create policy "notifications: admin delete"
  on public.notifications for delete
  using (public.is_admin());

-- ---------- reports policies ----------
create policy "reports: read own reports or admin"
  on public.reports for select
  using ("reporterId" = auth.uid() or public.is_admin());

create policy "reports: authenticated users file reports"
  on public.reports for insert
  with check ("reporterId" = auth.uid());

create policy "reports: admin resolves"
  on public.reports for update
  using (public.is_admin());

create policy "reports: admin deletes"
  on public.reports for delete
  using (public.is_admin());

-- ============================================================
-- Storage: donation photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('donation-photos', 'donation-photos', true)
on conflict (id) do nothing;

create policy "photos: public read"
  on storage.objects for select
  using (bucket_id = 'donation-photos');

create policy "photos: authenticated upload into own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'donation-photos'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "photos: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'donation-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ------------------------------------------------------------
-- TODO (production): pg_cron job to flip expired available/claimed
-- listings to status='expired' hourly, e.g.:
--   select cron.schedule('hide-expired', '5 * * * *', $$
--     update public.donations set status='expired'
--     where status in ('available','claimed') and "bestBefore" <= now());
--   $$);
-- The client already auto-hides expired items via RLS + UI rules.
