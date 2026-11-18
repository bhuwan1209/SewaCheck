"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { searchServices } from "@/data/services";
import { getDict, href, type Locale } from "@/i18n/dictionaries";

/** Search box + results. Reads ?q= so the homepage search can link here. */
export function ServiceExplorer({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const results = searchServices(q);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="service-search" className="sr-only">{t.services.searchLabel}</label>
        <input
          id="service-search"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.home.searchPlaceholder}
          className="w-full max-w-xl rounded-lg border border-navy-100 px-4 py-3 text-navy-950 placeholder:text-slate-500"
        />
      </form>

      <p className="mt-3 text-sm text-slate-700" aria-live="polite">{t.services.found(results.length)}</p>

      {results.length === 0 ? (
        <p className="mt-4 rounded-lg bg-navy-50 p-4 text-slate-700">{t.services.none}</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {results.map((s) => (
            <li key={s.slug}>
              <Link
                href={href(lang, `/services/${s.slug}`)}
                className="block h-full rounded-xl border border-navy-100 bg-navy-50 p-5 hover:border-sewa-green"
              >
                <h2 className="font-semibold text-navy-900">{lang === "ne" ? s.nameNe : s.name}</h2>
                <p className="mt-1 text-sm text-slate-700">{lang === "ne" ? s.summaryNe : s.summary}</p>
                <span className="mt-4 inline-block text-sm font-medium text-navy-700">{t.home.viewDetails}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
