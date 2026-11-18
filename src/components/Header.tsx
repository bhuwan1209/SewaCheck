import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getDict, href, type Locale } from "@/i18n/dictionaries";

export function Header({ lang }: { lang: Locale }) {
  const t = getDict(lang);
  const links = [
    { href: href(lang, "/services"), label: t.nav.services },
    { href: href(lang, "/offices"), label: t.nav.offices },
    { href: href(lang, "/updates"), label: t.nav.updates },
    { href: href(lang, "/report"), label: t.nav.report },
    { href: `${href(lang, "/")}#verification`, label: t.nav.verification },
  ];
  const other: Locale = lang === "en" ? "ne" : "en";
  const switcher = (
    // useSearchParams/usePathname need Suspense; fall back to a plain link to the other homepage
    <Suspense
      fallback={
        <Link href={href(other, "/")} lang={other} className="inline-flex min-h-11 items-center rounded-lg border border-navy-100 px-3 text-sm font-semibold">
          {t.langName[other]}
        </Link>
      }
    >
      <LanguageSwitcher lang={lang} />
    </Suspense>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-white"
      >
        {t.skip}
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href={href(lang, "/")} aria-label={t.homeLabel}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 text-sm font-medium text-navy-800 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-sewa-green">
              {l.label}
            </Link>
          ))}
          {switcher}
        </nav>

        {/* Mobile: <details> works without JavaScript and with keyboards */}
        <div className="flex items-center gap-2 lg:hidden">
          {switcher}
          <details className="group relative">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-navy-100 px-4 text-sm font-semibold text-navy-900">
              {t.menu}
              <span aria-hidden="true" className="transition group-open:rotate-180">▾</span>
            </summary>
            <nav aria-label="Main (mobile)" className="absolute right-0 mt-2 w-64 rounded-xl border border-navy-100 bg-white p-2 shadow-lg">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="block min-h-11 rounded-lg px-3 py-3 text-navy-900 hover:bg-navy-50">
                  {l.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
