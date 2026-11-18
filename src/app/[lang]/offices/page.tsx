import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OFFICES } from "@/data/offices";
import { getDict, href, isLocale } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${getDict(lang).offices.title} — SewaCheck` };
}

export default async function OfficesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang);
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{t.offices.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-700">{t.offices.lead}</p>
      <div role="note" className="mt-6 max-w-3xl rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-300">
        {t.offices.incomplete}
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {OFFICES.map((o) => (
          <li key={o.slug}>
            <Link href={href(lang, `/offices/${o.slug}`)} className="block h-full rounded-xl border border-navy-100 bg-navy-50 p-5 hover:border-sewa-green">
              <h2 className="font-semibold text-navy-900">{lang === "ne" ? o.nameNe : o.name}</h2>
              <p className="mt-1 text-sm text-slate-700">{t.offices.district}: {lang === "ne" ? o.districtNe : o.district}</p>
              <span className="mt-4 inline-block text-sm font-medium text-navy-700">{t.home.viewDetails}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
