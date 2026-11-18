"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitReport, type FormState } from "./actions";
import { getDict, type Locale } from "@/i18n/dictionaries";

type Option = { slug: string; name: string };

const initial: FormState = { ok: false, message: "" };

export function ReportForm({
  offices,
  services,
  enabled,
  lang,
}: {
  offices: Option[];
  services: Option[];
  enabled: boolean;
  lang: Locale;
}) {
  const t = getDict(lang).report;
  const [state, action, pending] = useActionState(submitReport, initial);
  // Both values depend on the current time, so they are filled in the browser
  // after the page loads (not during the server prerender).
  const renderedAtRef = useRef<HTMLInputElement>(null);
  const observedRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Used by the server to spot bots that submit instantly
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
    // datetime-local needs local time; default to "now"
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const local = d.toISOString().slice(0, 16);
    if (observedRef.current) {
      observedRef.current.value = local;
      observedRef.current.max = local;
    }
  }, [state]);

  const field = "mt-1 min-h-11 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-navy-950";
  return (
    <form action={action} className="space-y-5">
      <input ref={renderedAtRef} type="hidden" name="renderedAt" defaultValue="" />
      {/* Honeypot: hidden from people, bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="office" className="font-medium text-navy-900">{t.office}</label>
        <select id="office" name="office" required className={field} defaultValue="">
          <option value="" disabled>{t.chooseOffice}</option>
          {offices.map((o) => (
            <option key={o.slug} value={o.slug}>{o.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="service" className="font-medium text-navy-900">{t.service}</label>
        <select id="service" name="service" className={field} defaultValue="">
          <option value="">{t.noService}</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="category" className="font-medium text-navy-900">{t.what}</label>
        <select id="category" name="category" required className={field} defaultValue="">
          <option value="" disabled>{t.chooseOne}</option>
          {Object.entries(t.categories).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="observedAt" className="font-medium text-navy-900">{t.when}</label>
        <input ref={observedRef} id="observedAt" name="observedAt" type="datetime-local" required className={field} />
        <p className="mt-1 text-xs text-slate-600">{t.whenHelp}</p>
      </div>

      <div>
        <label htmlFor="body" className="font-medium text-navy-900">{t.body}</label>
        <textarea id="body" name="body" required minLength={10} maxLength={500} rows={4} className={field} aria-describedby="body-help" />
        <p id="body-help" className="mt-1 text-xs text-slate-600">{t.bodyHelp}</p>
      </div>

      <button
        type="submit"
        disabled={pending || !enabled}
        className="min-h-12 rounded-lg bg-sewa-green px-6 py-3 font-semibold text-white hover:bg-[#0c6a40] disabled:opacity-60"
      >
        {pending ? t.sending : t.submit}
      </button>

      <p role="status" aria-live="polite" className={state.ok ? "text-sewa-green" : "text-red-700"}>
        {state.message}
      </p>
    </form>
  );
}
