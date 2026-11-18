import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { REPORT_CATEGORIES, type ReportCategory } from "@/lib/reports";
import { approveReport, rejectReport, signIn, signOut } from "./actions";

export const metadata: Metadata = {
  title: "Moderation — SewaCheck",
  robots: { index: false, follow: false },
};

const input = "mt-1 w-full rounded-lg border border-slate-400 px-3 py-2";

type Pending = {
  id: string;
  category: ReportCategory;
  body: string;
  observed_at: string;
  created_at: string;
  offices: { name: string } | null;
};

async function Panel({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (!isSupabaseConfigured()) {
    return <p className="rounded-lg bg-navy-50 p-4">The database is not connected yet.</p>;
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  const errors: Record<string, string> = {
    login: "Sign-in failed.",
    slow: "Too many attempts. Wait a few minutes.",
    url: "Official reports need an https link on a gov.np website.",
    update: "Could not update that report. Please try again.",
  };
  const errorBox = error && errors[error] ? <p role="alert" className="mb-4 text-red-700">{errors[error]}</p> : null;

  if (!user) {
    return (
      <form action={signIn} className="max-w-sm space-y-4">
        {errorBox}
        <div>
          <label htmlFor="email" className="font-medium">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="password" className="font-medium">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className={input} />
        </div>
        <button className="rounded-lg bg-navy-900 px-5 py-2 font-semibold text-white">Sign in</button>
      </form>
    );
  }

  if (user.app_metadata?.role !== "moderator") {
    return (
      <div>
        <p role="alert">This account is not a moderator.</p>
        <form action={signOut}><button className="mt-3 underline">Sign out</button></form>
      </div>
    );
  }

  const { data } = await supabase
    .from("status_reports")
    .select("id, category, body, observed_at, created_at, offices(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(50)
    .overrideTypes<Pending[], { merge: false }>();
  const pending = data ?? [];

  return (
    <div>
      {errorBox}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">Signed in as {user.email}</p>
        <form action={signOut}><button className="text-sm underline">Sign out</button></form>
      </div>
      <h2 className="mt-6 text-xl font-semibold">Pending reports ({pending.length})</h2>
      {pending.length === 0 && <p className="mt-3 text-slate-700">Nothing to review.</p>}
      <ul className="mt-4 space-y-4">
        {pending.map((r) => (
          <li key={r.id} className="rounded-xl border border-navy-100 p-5">
            <p className="text-sm text-slate-600">
              {r.offices?.name} · {REPORT_CATEGORIES[r.category]} · seen{" "}
              {new Date(r.observed_at).toLocaleString("en-GB", { timeZone: "Asia/Kathmandu" })}
            </p>
            {/* React escapes text, so report content cannot inject HTML */}
            <p className="mt-2">{r.body}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <form action={approveReport} className="space-y-2">
                <input type="hidden" name="id" value={r.id} />
                <label className="block text-sm">
                  Official source link (optional, only if an official gov.np page confirms this)
                  <input name="officialUrl" type="url" placeholder="https://…gov.np/…" className={input} />
                </label>
                <button className="rounded-lg bg-sewa-green px-4 py-2 font-semibold text-white">Approve</button>
              </form>
              <form action={rejectReport} className="space-y-2">
                <input type="hidden" name="id" value={r.id} />
                <label className="block text-sm">
                  Reason (private note)
                  <input name="note" maxLength={300} className={input} />
                </label>
                <button className="rounded-lg border border-red-700 px-4 py-2 font-semibold text-red-700">Reject</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ModerationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">Moderation</h1>
      <p className="mt-1 text-sm text-slate-600">Moderators only.</p>
      <div className="mt-8">
        <Suspense fallback={<p>Loading…</p>}>
          <Panel searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
