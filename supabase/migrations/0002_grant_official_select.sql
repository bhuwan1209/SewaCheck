-- Grant read-only SELECT on official tables to API roles (anon, authenticated).
-- Run this in Supabase SQL Editor if you already ran 0001_init.sql.
grant select on public.sources, public.services, public.offices,
  public.office_services, public.requirements to anon, authenticated;
