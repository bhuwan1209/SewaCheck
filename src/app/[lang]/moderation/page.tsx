import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { type ReportCategory } from "@/lib/reports";
import { getDict, isLocale, type Locale } from "@/i18n/dictionaries";
import { approveReport, rejectReport, signIn, signOut } from "./actions";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return { robots: { index: false, follow: false } };
  return {
    title: `${getDict(lang).moderation.title} — SewaCheck`,
    robots: { index: false, follow: false },
  };
}

const input = "mt-1 min-h-11 w-full rounded-lg border border-slate-400 px-3 py-2";

type Pending = {
  id: string;
  category: ReportCategory;
  body: string;
  observed_at: string;
  created_at: string;
  offices: { name: string; name_ne: string | null } | null;
};

async function Panel({
  lang,
  searchParams,
}: {
  lang: Locale;
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const dict = getDict(lang);
  const m = dict.moderation;
  const locale = lang === "ne" ? "ne-NP" : "en-GB";

  if (!isSupabaseConfigured()) {
    return <p className="rounded-lg bg-navy-50 p-4">{m.notConnected}</p>;
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  const errorMessage = error && error in m.errors ? m.errors[error as keyof typeof m.errors] : null;
  const errorBox = errorMessage ? <p role="alert" className="mb-4 text-red-700">{errorMessage}</p> : null;

  if (!user) {
    return (
      <form action={signIn} className="max-w-sm space-y-4">
        <input type="hidden" name="lang" value={lang} />
        {errorBox}
        <div>
          <label htmlFor="email" className="font-medium">{m.email}</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="password" className="font-medium">{m.password}</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className={input} />
        </div>
        <button className="min-h-11 rounded-lg bg-navy-900 px-5 py-2 font-semibold text-white">{m.signIn}</button>
      </form>
    );
  }

  if (user.app_metadata?.role !== "moderator") {
    return (
      <div>
        <p role="alert">{m.notMod}</p>
        <form action={signOut}>
          <input type="hidden" name="lang" value={lang} />
          <button className="mt-3 min-h-11 underline">{m.signOut}</button>
        </form>
      </div>
    );
  }

  const { data } = await supabase
    .from("status_reports")
    .select("id, category, body, observed_at, created_at, offices(name, name_ne)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(50)
    .overrideTypes<Pending[], { merge: false }>();
  const pending = data ?? [];

  return (
    <div>
      {errorBox}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">{m.signedInAs} {user.email}</p>
        <form action={signOut}>
          <input type="hidden" name="lang" value={lang} />
          <button className="min-h-11 text-sm underline">{m.signOut}</button>
        </form>
      </div>
      <h2 className="mt-6 text-xl font-semibold">{m.pending} ({pending.length})</h2>
      {pending.length === 0 && <p className="mt-3 text-slate-700">{m.empty}</p>}
      <ul className="mt-4 space-y-4">
        {pending.map((r) => {
          const officeName = lang === "ne" && r.offices?.name_ne ? r.offices.name_ne : r.offices?.name;
          return (
            <li key={r.id} className="rounded-xl border border-navy-100 p-5">
              <p className="text-sm text-slate-600">
                {officeName} · {dict.report.categories[r.category]} · {m.seen}{" "}
                {new Date(r.observed_at).toLocaleString(locale, { timeZone: "Asia/Kathmandu" })}
              </p>
              {/* React escapes text, so report content cannot inject HTML */}
              <p className="mt-2">{r.body}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <form action={approveReport} className="space-y-2">
                  <input type="hidden" name="lang" value={lang} />
                  <input type="hidden" name="id" value={r.id} />
                  <label className="block text-sm">
                    {m.officialUrl}
                    <input name="officialUrl" type="url" placeholder="https://…gov.np/…" className={input} />
                  </label>
                  <button className="min-h-11 rounded-lg bg-sewa-green px-4 py-2 font-semibold text-white">{m.approve}</button>
                </form>
                <form action={rejectReport} className="space-y-2">
                  <input type="hidden" name="lang" value={lang} />
                  <input type="hidden" name="id" value={r.id} />
                  <label className="block text-sm">
                    {m.reason}
                    <input name="note" maxLength={300} className={input} />
                  </label>
                  <button className="min-h-11 rounded-lg border border-red-700 px-4 py-2 font-semibold text-red-700">{m.reject}</button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function ModerationPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const m = getDict(lang).moderation;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{m.title}</h1>
      <p className="mt-1 text-sm text-slate-600">{m.subtitle}</p>
      <div className="mt-8">
        <Suspense fallback={<p>{m.loading}</p>}>
          <Panel lang={lang} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
