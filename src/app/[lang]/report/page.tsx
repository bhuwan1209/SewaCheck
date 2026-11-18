import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ReportForm } from "./ReportForm";
import { OFFICES } from "@/data/offices";
import { SERVICES } from "@/data/services";
import { getDict, isLocale } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${getDict(lang).report.title} — SewaCheck` };
}

export default async function ReportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).report;
  const enabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const ne = lang === "ne";
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{t.title}</h1>
      <p className="mt-2 text-slate-700">{t.lead}</p>

      <ul className="mt-6 list-disc space-y-1 rounded-lg bg-navy-50 p-4 pl-8 text-sm text-slate-800">
        {t.rules.map((r) => <li key={r}>{r}</li>)}
      </ul>

      {!enabled && (
        <div role="alert" className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-300">{t.disabled}</div>
      )}
      {ne && <p className="mt-4 text-xs text-slate-600">{t.errorsEnglish}</p>}

      <div className="mt-8">
        <Suspense fallback={<p className="text-slate-600">{getDict(lang).services.loading}</p>}>
          <ReportForm
            lang={lang}
            enabled={enabled}
            offices={OFFICES.map((o) => ({ slug: o.slug, name: ne ? o.nameNe : o.name }))}
            services={SERVICES.map((s) => ({ slug: s.slug, name: ne ? s.nameNe : s.name }))}
          />
        </Suspense>
      </div>
    </div>
  );
}
