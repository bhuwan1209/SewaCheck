"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getDict, type Locale } from "@/i18n/dictionaries";

/** Switches language while staying on the same page and preserving query params. */
export function LanguageSwitcher({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}`;
  const searchParams = useSearchParams();
  const other: Locale = lang === "en" ? "ne" : "en";
  const base = pathname.replace(/^\/(en|ne)(?=\/|$)/, `/${other}`);
  const query = searchParams.toString();
  const target = query ? `${base}?${query}` : base;
  const t = getDict(lang);
  return (
    <Link
      href={target}
      hrefLang={other}
      lang={other}
      aria-label={`${t.language}: ${t.langName[other]}`}
      className="inline-flex min-h-11 items-center rounded-lg border border-navy-100 px-3 text-sm font-semibold text-navy-900 hover:bg-navy-50"
    >
      {t.langName[other]}
    </Link>
  );
}
