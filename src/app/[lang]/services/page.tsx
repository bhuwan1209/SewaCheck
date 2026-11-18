import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ServiceExplorer } from "@/components/ServiceExplorer";
import { getDict, isLocale } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${getDict(lang).services.title} — SewaCheck` };
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).services;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{t.title}</h1>
      <p className="mt-2 max-w-2xl text-slate-700">{t.lead}</p>
      <div className="mt-8">
        {/* Suspense is required because the search box reads the URL */}
        <Suspense fallback={<p className="text-slate-600">{t.loading}</p>}>
          <ServiceExplorer lang={lang} />
        </Suspense>
      </div>
    </div>
  );
}
