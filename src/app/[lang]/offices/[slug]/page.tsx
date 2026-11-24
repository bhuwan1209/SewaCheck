import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailSection } from "@/components/DetailSection";
import { OfficeMap } from "@/components/OfficeMap";
import { StatusBadge } from "@/components/StatusBadge";
import { OFFICES, getOffice } from "@/data/offices";
import { SOURCES, getService } from "@/data/services";
import { LOCALES, getDict, href, isLocale } from "@/i18n/dictionaries";

type Props = { params: Promise<{ lang: string; slug: string }> };

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => OFFICES.map((o) => ({ lang, slug: o.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const o = getOffice(slug);
  if (!o || !isLocale(lang)) return { title: "Office not found" };
  return { title: `${lang === "ne" ? o.nameNe : o.name} — SewaCheck` };
}

export default async function OfficePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const office = getOffice(slug);
  if (!office) notFound();
  const t = getDict(lang);
  const name = lang === "ne" ? office.nameNe : office.name;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href={href(lang, "/offices")} className="underline">{t.offices.breadcrumb}</Link> / {name}
      </nav>
      <h1 className="mt-3 text-3xl font-bold text-navy-900">{name}</h1>
      <p className="mt-1 text-slate-700">{t.offices.district}: {lang === "ne" ? office.districtNe : office.district}</p>

      <div className="mt-8 space-y-4">
        <DetailSection lang={lang} title={t.offices.address} detail={office.address} />
        <DetailSection lang={lang} title={t.offices.phone} detail={office.phone} />
        <DetailSection lang={lang} title={t.offices.hours} detail={office.hours} />
      </div>

      <section className="mt-8 rounded-xl border border-navy-100 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold text-navy-900">{t.offices.confirmedServicesH}</h2>
          <StatusBadge lang={lang} level={office.serviceSlugs.length > 0 || office.scopeNote ? "official" : "none"} />
        </div>
        {office.serviceSlugs.length > 0 ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {office.serviceSlugs.map((sSlug) => {
              const svc = getService(sSlug);
              if (!svc) return null;
              return (
                <li key={sSlug}>
                  <Link
                    href={href(lang, `/services/${svc.slug}`)}
                    className="block rounded-lg bg-navy-50 p-3 text-sm font-medium text-navy-900 hover:bg-navy-100"
                  >
                    {lang === "ne" ? svc.nameNe : svc.name}
                    <span className="mt-0.5 block text-xs font-normal text-navy-700">
                      {t.home.viewDetails}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-slate-700">
            {lang === "ne" && office.scopeNoteNe
              ? office.scopeNoteNe
              : office.scopeNote ?? t.offices.confirmedServicesNote}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`${href(lang, "/report")}?office=${encodeURIComponent(office.slug)}`}
            className="inline-flex min-h-11 items-center rounded-lg bg-sewa-green px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c6a40]"
          >
            {t.offices.reportHere}
          </Link>
          <Link
            href={href(lang, "/updates")}
            className="inline-flex min-h-11 items-center rounded-lg border border-navy-700 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50"
          >
            {t.offices.viewUpdates}
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-navy-900">{t.offices.map}</h2>
        <OfficeMap office={office} lang={lang} />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy-900">{t.detail.officialSources}</h2>
        {lang === "ne" && <p className="mt-1 text-sm text-slate-600">{t.detail.sourceNotesEnglish}</p>}
        <ul className="mt-3 space-y-3">
          {office.sourceIds.map((id) => {
            const s = SOURCES[id];
            return (
              <li key={id} className="rounded-lg bg-navy-50 p-4 text-sm">
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-navy-700 underline">{s.title}</a>
                <p className="mt-1 text-slate-600">{t.detail.linkChecked} {s.lastChecked}. {s.note}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-sm text-slate-600">{t.offices.onlineNote}</p>
      </section>
    </div>
  );
}
