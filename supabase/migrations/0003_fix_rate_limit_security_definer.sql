-- Fix rate-limit triggers so they can count recent rows even though anon
-- cannot SELECT private columns (client_hash) or feedback rows.
alter function public.limit_report_rate() security definer set search_path = public, pg_temp;
alter function public.limit_feedback_rate() security definer set search_path = public, pg_temp;
