"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { searchServices, type Sector } from "@/data/services";
import { getDict, href, type Locale } from "@/i18n/dictionaries";
import { StatusBadge } from "./StatusBadge";

const SECTORS: Array<"all" | Sector> = ["all", "transport", "passport", "identity", "tax"];

/** Search box + sector tabs + results. Reads ?q= so the homepage search can link here. */
export function ServiceExplorer({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sector, setSector] = useState<"all" | Sector>("all");

  const results = searchServices(q).filter((s) => sector === "all" || s.sector === sector);

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

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by sector">
        {SECTORS.map((sec) => {
          const active = sector === sec;
          return (
            <button
              key={sec}
              type="button"
              onClick={() => setSector(sec)}
              className={`min-h-10 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-navy-900 text-white"
                  : "border border-navy-100 bg-white text-navy-800 hover:bg-navy-50"
              }`}
            >
              {t.sectors[sec]}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-slate-700" aria-live="polite">{t.services.found(results.length)}</p>

      {results.length === 0 ? (
        <p className="mt-4 rounded-lg bg-navy-50 p-4 text-slate-700">{t.services.none}</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => {
            const hasVerified =
              s.details.requirements.state === "verified" ||
              s.details.fees.state === "verified" ||
              s.details.steps.state === "verified";
            return (
              <li key={s.slug}>
                <Link
                  href={href(lang, `/services/${s.slug}`)}
                  className="block h-full rounded-xl border border-navy-100 bg-navy-50 p-5 hover:border-sewa-green"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-navy-700">
                    {t.sectors[s.sector]}
                  </p>
                  <h2 className="mt-1 font-semibold text-navy-900">{lang === "ne" ? s.nameNe : s.name}</h2>
                  <p className="mt-1 text-sm text-slate-700">{lang === "ne" ? s.summaryNe : s.summary}</p>
                  <div className="mt-3">
                    <StatusBadge lang={lang} level={hasVerified ? "official" : "none"} />
                  </div>
                  <span className="mt-3 inline-block text-sm font-medium text-navy-700">{t.home.viewDetails}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
