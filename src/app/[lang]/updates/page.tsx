import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { displayLevel, isAging, type ReportCategory, type ReportRow } from "@/lib/reports";
import { confirmReport } from "@/app/[lang]/report/actions";
import { getDict, href, isLocale, type Locale } from "@/i18n/dictionaries";
import { ConfirmButton } from "./ConfirmButton";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${getDict(lang).updates.title} — SewaCheck` };
}

type Row = ReportRow & {
  id: string;
  category: ReportCategory;
  body: string;
  observed_at: string;
  offices: { name: string; name_ne: string | null; slug: string } | null;
  services: { name: string; name_ne: string | null; slug: string } | null;
};

async function UpdatesList({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const u = t.updates;
  const locale = lang === "ne" ? "ne-NP" : "en-GB";
  if (!isSupabaseConfigured()) {
    return <p className="rounded-lg bg-navy-50 p-4 text-slate-700">{u.notConnected}</p>;
  }
  const supabase = await createClient();
  // RLS already hides pending, rejected and expired reports. We also filter here as a second check.
  const { data, error } = await supabase
    .from("status_reports")
    .select("id, category, body, observed_at, created_at, expires_at, source_type, source_url, verification_level, offices(name, name_ne, slug), services(name, name_ne, slug)")
    .eq("status", "approved")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(50)
    .overrideTypes<Row[], { merge: false }>();

  if (error) return <p role="alert" className="text-red-700">{u.loadError}</p>;
  const reports = data ?? [];
  const { data: counts } = reports.length
    ? await supabase.from("report_confirmation_counts").select("report_id, confirmations").in("report_id", reports.map((r) => r.id))
    : { data: [] as { report_id: string; confirmations: number }[] };
  const countOf = new Map((counts ?? []).map((c) => [c.report_id, c.confirmations]));

  if (reports.length === 0) {
    return (
      <div className="rounded-lg bg-navy-50 p-4">
        <StatusBadge lang={lang} level="none" />
        <p className="mt-2 text-slate-700">{u.empty}</p>
      </div>
    );
  }
  const now = new Date();
  const fmt = (iso: string) => new Date(iso).toLocaleString(locale, { timeZone: "Asia/Kathmandu" });
  return (
    <ul className="space-y-4">
      {reports.map((r) => {
        const c = countOf.get(r.id) ?? 0;
        const officeName = lang === "ne" && r.offices?.name_ne ? r.offices.name_ne : r.offices?.name;
        const serviceName = lang === "ne" && r.services?.name_ne ? r.services.name_ne : r.services?.name;
        return (
          <li key={r.id} className="rounded-xl border border-navy-100 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge lang={lang} level={displayLevel(r, c, now)} />
              <span className="text-sm font-medium text-navy-900">{t.report.categories[r.category]}</span>
            </div>
            <p className="mt-3 text-slate-800">{r.body}</p>
            <dl className="mt-3 space-y-1 text-sm text-slate-600">
              <div>
                <dt className="inline font-medium">{u.office}: </dt>
                <dd className="inline">
                  {r.offices?.slug ? (
                    <Link href={href(lang, `/offices/${r.offices.slug}`)} className="underline">
                      {officeName ?? "—"}
                    </Link>
                  ) : (
                    officeName ?? "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="inline font-medium">{u.service}: </dt>
                <dd className="inline">{serviceName ?? u.notSpecified}</dd>
              </div>
              <div><dt className="inline font-medium">{u.seen}: </dt><dd className="inline"><time dateTime={r.observed_at}>{fmt(r.observed_at)} ({u.nepalTime})</time></dd></div>
              <div><dt className="inline font-medium">{u.sourceLabel}: </dt><dd className="inline">{r.source_type === "official" ? u.official : u.citizen}{r.source_url && (<> <a className="underline" href={r.source_url} target="_blank" rel="noopener noreferrer">{u.link}</a></>)}</dd></div>
              <div><dt className="inline font-medium">{u.expires}: </dt><dd className="inline"><time dateTime={r.expires_at}>{fmt(r.expires_at)}</time>{isAging(r, now) && ` · ${u.aging}`}</dd></div>
              <div><dt className="inline font-medium">{u.confirmations}: </dt><dd className="inline">{c}</dd></div>
            </dl>
            <form action={confirmReport} className="mt-3">
              <input type="hidden" name="reportId" value={r.id} />
              <ConfirmButton label={u.sawToo} sendingLabel={u.sending} />
            </form>
          </li>
        );
      })}
    </ul>
  );
}

export default async function UpdatesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const u = getDict(lang).updates;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{u.title}</h1>
      <p className="mt-2 text-slate-700">{u.lead}</p>
      <p className="mt-2">
        <Link href={href(lang, "/report")} className="font-medium text-navy-700 underline">{u.reportLink}</Link>
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-slate-600">{u.loading}</p>}>
          <UpdatesList lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}
