import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailSection } from "@/components/DetailSection";
import { SERVICES, SOURCES, getService } from "@/data/services";
import { LOCALES, getDict, href, isLocale } from "@/i18n/dictionaries";

type Props = { params: Promise<{ lang: string; slug: string }> };

// Build one page per service and language ahead of time.
export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SERVICES.map((s) => ({ lang, slug: s.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const s = getService(slug);
  if (!s || !isLocale(lang)) return { title: "Service not found" };
  return { title: `${lang === "ne" ? s.nameNe : s.name} — SewaCheck` };
}

export default async function ServicePage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const service = getService(slug);
  if (!service) notFound();
  const t = getDict(lang);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
        <Link href={href(lang, "/services")} className="underline">{t.services.breadcrumb}</Link>{" "}
        / {lang === "ne" ? service.nameNe : service.name}
      </nav>
      <h1 className="mt-3 text-3xl font-bold text-navy-900">{lang === "ne" ? service.nameNe : service.name}</h1>
      <p className="mt-2 text-slate-700">{lang === "ne" ? service.summaryNe : service.summary}</p>

      <div role="note" className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-300">
        {t.detail.notice}
      </div>

      <div className="mt-8 space-y-4">
        <DetailSection lang={lang} title={t.detail.docs} detail={service.details.requirements} />
        <DetailSection lang={lang} title={t.detail.fees} detail={service.details.fees} />
        <DetailSection lang={lang} title={t.detail.steps} detail={service.details.steps} />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-navy-900">{t.detail.officialSources}</h2>
        {lang === "ne" && <p className="mt-1 text-sm text-slate-600">{t.detail.sourceNotesEnglish}</p>}
        <ul className="mt-3 space-y-3">
          {service.sourceIds.map((id) => {
            const src = SOURCES[id];
            return (
              <li key={id} className="rounded-lg bg-navy-50 p-4 text-sm">
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="font-medium text-navy-700 underline">{src.title}</a>
                <p className="text-slate-700">{src.publisher}</p>
                <p className="mt-1 text-slate-600">{t.detail.linkChecked} {src.lastChecked}. {src.note}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
