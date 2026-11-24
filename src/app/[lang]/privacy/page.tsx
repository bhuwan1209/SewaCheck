import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${getDict(lang).privacy.title} — SewaCheck` };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const p = getDict(lang).privacy;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{p.title}</h1>
      <p className="mt-2 text-slate-700">{p.lead}</p>
      <div className="mt-8 space-y-6">
        {p.sections.map((s) => (
          <section key={s.heading} className="rounded-xl border border-navy-100 p-5">
            <h2 className="text-lg font-semibold text-navy-900">{s.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
