-- =====================================================================
-- SewaCheck database schema (Phase 4)
-- Run in the Supabase SQL editor (or `supabase db push`).
--
-- SECURITY MODEL IN ONE PARAGRAPH
-- * Official content (sources, offices, services, requirements) is READ-ONLY
--   for the public: there are NO insert/update/delete policies for it, so only
--   the project owner (dashboard / service role, never in the browser) can edit.
-- * The public may INSERT citizen reports, confirmations and feedback, but a
--   report always starts as 'pending' and 'unverified'. It is shown publicly
--   only after a moderator approves it, and only while it is not expired.
-- * Moderators are Supabase Auth users whose app_metadata contains
--   {"role": "moderator"}. app_metadata can only be set by the project owner.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- helper: is the current user a moderator? ----------
create or replace function public.is_moderator()
returns boolean
language sql stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'moderator'
$$;

-- ---------- sources ----------
create table public.sources (
  id           uuid primary key default gen_random_uuid(),
  key          text not null unique check (key ~ '^[A-Za-z0-9_-]+$'),
  title        text not null check (length(title) between 3 and 300),
  url          text not null check (url ~ '^https://'),
  publisher    text not null,
  last_checked date not null,
  note         text not null default ''
);

-- ---------- services ----------
create table public.services (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name         text not null,
  name_ne      text,
  summary      text not null,
  summary_ne   text,
  is_published boolean not null default true
);

-- ---------- offices ----------
-- Each detail (address/phone/hours) needs a source AND a verified date when set.
create table public.offices (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name                 text not null,
  name_ne              text,
  kind                 text not null check (kind in ('department', 'office')),
  district             text not null,
  address              text,
  address_source_id    uuid references public.sources(id),
  address_verified_on  date,
  phone                text,
  phone_source_id      uuid references public.sources(id),
  phone_verified_on    date,
  hours                text,
  hours_source_id      uuid references public.sources(id),
  hours_verified_on    date,
  lat                  double precision check (lat between 26 and 30),   -- Nepal range
  lng                  double precision check (lng between 80 and 89),
  location_source_id   uuid references public.sources(id),
  is_published         boolean not null default true,
  constraint address_needs_source check (address is null or (address_source_id is not null and address_verified_on is not null)),
  constraint phone_needs_source   check (phone   is null or (phone_source_id   is not null and phone_verified_on   is not null)),
  constraint hours_needs_source   check (hours   is null or (hours_source_id   is not null and hours_verified_on   is not null)),
  constraint location_complete    check ((lat is null) = (lng is null)),
  constraint location_needs_source check (lat is null or location_source_id is not null)
);

-- ---------- office_services (which office provides which service) ----------
create table public.office_services (
  office_id     uuid not null references public.offices(id) on delete cascade,
  service_id    uuid not null references public.services(id) on delete cascade,
  source_id     uuid not null references public.sources(id),
  last_verified date not null,
  primary key (office_id, service_id)
);

-- ---------- requirements (documents, fees, steps) ----------
create table public.requirements (
  id            uuid primary key default gen_random_uuid(),
  service_id    uuid not null references public.services(id) on delete cascade,
  kind          text not null check (kind in ('document', 'fee', 'step')),
  body          text not null check (length(body) between 2 and 1000),
  body_ne       text,
  sort_order    int not null default 0,
  source_id     uuid not null references public.sources(id),   -- mandatory: no source, no row
  last_verified date not null
);
create index on public.requirements (service_id, kind, sort_order);

-- ---------- status_reports ----------
create table public.status_reports (
  id                uuid primary key default gen_random_uuid(),
  office_id         uuid not null references public.offices(id) on delete cascade,
  service_id        uuid references public.services(id) on delete set null,
  category          text not null check (category in
                      ('closed', 'delay', 'system_down', 'documents', 'other')),
  body              text not null check (length(body) between 10 and 500),
  observed_at       timestamptz not null check (observed_at <= now() + interval '5 minutes'),
  created_at        timestamptz not null default now(),
  expires_at        timestamptz not null default (now() + interval '72 hours'),
  -- who/what is the source of this report
  source_type       text not null default 'citizen' check (source_type in ('citizen', 'official')),
  source_url        text check (source_url is null or source_url ~ '^https://'),
  -- moderation
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  verification_level text not null default 'unverified'
                      check (verification_level in ('official', 'community', 'unverified')),
  moderation_note   text,
  moderated_by      uuid references auth.users(id),
  moderated_at      timestamptz,
  -- anti-spam (private, never exposed to the public)
  client_hash       text,
  -- an official label MUST point to an official URL
  constraint official_needs_url check (source_type <> 'official' or source_url is not null),
  constraint official_level_needs_official_source check
    (verification_level <> 'official' or (source_type = 'official' and source_url is not null)),
  constraint approved_needs_moderator check (status <> 'approved' or moderated_by is not null)
);
create index on public.status_reports (status, expires_at desc);
create index on public.status_reports (office_id);
create index on public.status_reports (client_hash, created_at);

-- ---------- report_confirmations ("I saw this too") ----------
create table public.report_confirmations (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references public.status_reports(id) on delete cascade,
  fingerprint text not null,                       -- salted hash, private
  created_at  timestamptz not null default now(),
  unique (report_id, fingerprint)                  -- one confirmation per person
);

-- ---------- feedback ----------
create table public.feedback (
  id         uuid primary key default gen_random_uuid(),
  message    text not null check (length(message) between 5 and 1000),
  page       text check (page is null or length(page) <= 200),
  created_at timestamptz not null default now(),
  client_hash text
);

-- =====================================================================
-- Anti-spam triggers (defence in depth; the app also rate-limits)
-- =====================================================================
create or replace function public.limit_report_rate()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.status_reports
        where client_hash = new.client_hash
          and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Too many reports from this client. Please try later.';
  end if;
  if (select count(*) from public.status_reports
        where status = 'pending' and created_at > now() - interval '1 hour') >= 300 then
    raise exception 'Reporting is temporarily busy. Please try later.';
  end if;
  return new;
end $$;
create trigger trg_limit_report_rate before insert on public.status_reports
  for each row execute function public.limit_report_rate();

create or replace function public.limit_feedback_rate()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.feedback
        where client_hash = new.client_hash
          and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'Too much feedback from this client. Please try later.';
  end if;
  return new;
end $$;
create trigger trg_limit_feedback_rate before insert on public.feedback
  for each row execute function public.limit_feedback_rate();

-- Stamp moderation info automatically so a moderator cannot forge another id
create or replace function public.stamp_moderation()
returns trigger language plpgsql as $$
begin
  if new.status is distinct from old.status then
    new.moderated_by := auth.uid();
    new.moderated_at := now();
  end if;
  return new;
end $$;
create trigger trg_stamp_moderation before update on public.status_reports
  for each row execute function public.stamp_moderation();

-- =====================================================================
-- Public view: confirmation counts (no private fingerprints exposed)
-- =====================================================================
create view public.report_confirmation_counts as
  select report_id, count(*)::int as confirmations
  from public.report_confirmations
  group by report_id;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.sources              enable row level security;
alter table public.services             enable row level security;
alter table public.offices              enable row level security;
alter table public.office_services      enable row level security;
alter table public.requirements         enable row level security;
alter table public.status_reports       enable row level security;
alter table public.report_confirmations enable row level security;
alter table public.feedback             enable row level security;

-- Official content: public READ only. (No write policies => writes are denied.)
create policy "public read sources"          on public.sources         for select using (true);
create policy "public read services"         on public.services        for select using (is_published);
create policy "public read offices"          on public.offices         for select using (is_published);
create policy "public read office_services"  on public.office_services for select using (true);
create policy "public read requirements"     on public.requirements    for select using (true);

-- Reports
create policy "public read approved live reports" on public.status_reports
  for select to anon, authenticated
  using (status = 'approved' and expires_at > now());

create policy "moderators read all reports" on public.status_reports
  for select to authenticated using (public.is_moderator());

create policy "public create pending citizen reports" on public.status_reports
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and verification_level = 'unverified'
    and source_type = 'citizen'
    and source_url is null
    and moderated_by is null
    and moderation_note is null
  );

create policy "moderators moderate reports" on public.status_reports
  for update to authenticated
  using (public.is_moderator())
  with check (public.is_moderator());

-- Confirmations: public may add one for an APPROVED, live report. Nobody reads rows.
create policy "public confirm approved reports" on public.report_confirmations
  for insert to anon, authenticated
  with check (exists (
    select 1 from public.status_reports r
    where r.id = report_id and r.status = 'approved' and r.expires_at > now()
  ));
create policy "moderators read confirmations" on public.report_confirmations
  for select to authenticated using (public.is_moderator());

-- Feedback: public may send, only moderators may read.
create policy "public send feedback" on public.feedback
  for insert to anon, authenticated with check (true);
create policy "moderators read feedback" on public.feedback
  for select to authenticated using (public.is_moderator());

-- =====================================================================
-- Column-level privileges: tighten what the public API can touch
-- =====================================================================
revoke all on public.status_reports, public.report_confirmations, public.feedback
  from anon, authenticated;

-- public may read only non-private report columns
grant select (id, office_id, service_id, category, body, observed_at, created_at,
              expires_at, source_type, source_url, status, verification_level)
  on public.status_reports to anon;
-- authenticated (moderators, via RLS) may read everything and edit moderation fields only
grant select on public.status_reports to authenticated;
grant update (status, verification_level, source_type, source_url, moderation_note)
  on public.status_reports to authenticated;

grant insert (office_id, service_id, category, body, observed_at, client_hash,
              status, verification_level, source_type, source_url)
  on public.status_reports to anon, authenticated;

grant insert (report_id, fingerprint) on public.report_confirmations to anon, authenticated;
grant select on public.report_confirmations to authenticated;

grant insert (message, page, client_hash) on public.feedback to anon, authenticated;
grant select on public.feedback to authenticated;

grant select on public.report_confirmation_counts to anon, authenticated;

-- Official tables: read-only for the API roles
revoke insert, update, delete on public.sources, public.services, public.offices,
  public.office_services, public.requirements from anon, authenticated;
