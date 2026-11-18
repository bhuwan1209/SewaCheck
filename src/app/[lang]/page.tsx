import Link from "next/link";
import { notFound } from "next/navigation";
import { STATUS_ORDER, StatusBadge } from "@/components/StatusBadge";
import { SERVICES } from "@/data/services";
import { getDict, href, isLocale } from "@/i18n/dictionaries";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);

  return (
    <>
      {/* HERO */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2fbf80]">{t.home.kicker}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{t.home.h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-100">{t.home.lead}</p>

          {/* Plain GET form: goes to /{lang}/services?q=... (works without JavaScript) */}
          <form
            role="search"
            action={href(lang, "/services")}
            method="get"
            aria-label={t.home.searchAria}
            className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="q" className="sr-only">{t.home.searchLabel}</label>
            <input
              id="q"
              name="q"
              type="search"
              placeholder={t.home.searchPlaceholder}
              className="min-h-12 w-full rounded-lg border border-navy-100 bg-white px-4 py-3 text-navy-950 placeholder:text-slate-500"
            />
            <button type="submit" className="min-h-12 rounded-lg bg-sewa-green px-6 py-3 font-semibold text-white hover:bg-[#0c6a40]">
              {t.home.searchBtn}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-navy-100/80">{t.home.searchSuggestionsLabel}</span>
            {t.home.searchSuggestions.map((term) => (
              <Link
                key={term}
                href={`${href(lang, "/services")}?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-navy-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-700"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14">
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t.home.servicesH}</h2>
        <p className="mt-2 max-w-2xl text-slate-700">{t.home.servicesLead}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={href(lang, `/services/${s.slug}`)} className="block h-full rounded-xl border border-navy-100 bg-navy-50 p-5 hover:border-sewa-green">
                <h3 className="font-semibold text-navy-900">{lang === "ne" ? s.nameNe : s.name}</h3>
                <p className="mt-1 text-sm text-slate-700">{lang === "ne" ? s.summaryNe : s.summary}</p>
                <p className="mt-3 text-xs font-medium text-slate-600">{t.home.detailsPending}</p>
                <span className="mt-2 inline-block text-sm font-medium text-navy-700">{t.home.viewDetails}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* RECENT UPDATES & OFFICES */}
      <section className="border-t border-navy-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="rounded-xl border border-navy-100 bg-navy-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy-900 sm:text-2xl">{t.home.updatesH}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-700 sm:text-base">{t.home.updatesLead}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={href(lang, "/updates")} className="inline-flex min-h-11 items-center rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
                {t.home.updatesCta}
              </Link>
              <Link href={href(lang, "/offices")} className="inline-flex min-h-11 items-center rounded-lg border border-navy-700 bg-white px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-100">
                {t.home.officesCta}
              </Link>
              <Link href={href(lang, "/report")} className="inline-flex min-h-11 items-center rounded-lg border border-sewa-green bg-white px-4 py-2 text-sm font-semibold text-sewa-green hover:bg-sewa-green-light">
                {t.home.reportCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VERIFICATION LEVELS */}
      <section id="verification" className="scroll-mt-16 bg-navy-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t.home.verifyH}</h2>
          <p className="mt-2 max-w-2xl text-slate-700">{t.home.verifyLead}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            {STATUS_ORDER.map((k) => (
              <div key={k} className="rounded-xl border border-navy-100 bg-white p-5">
                <dt><StatusBadge lang={lang} level={k} /></dt>
                <dd className="mt-3 text-sm leading-relaxed text-slate-700">{t.status[k].desc}</dd>
              </div>
            ))}
          </dl>

          {/* Clearly labelled sample card */}
          <div className="mt-8 rounded-xl border-2 border-dashed border-navy-700/40 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-navy-700">{t.home.sampleTag}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge lang={lang} level="none" />
              <span className="text-sm text-slate-700">{t.home.sampleText}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{t.home.sampleNote}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-14">
        <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t.home.howH}</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.home.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4 lg:block">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-white">{i + 1}</span>
              <div className="lg:mt-3">
                <h3 className="font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* PRIVACY NOTE */}
      <section className="bg-sewa-green-light">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-navy-900">{t.home.privacy}</div>
      </section>
    </>
  );
}
