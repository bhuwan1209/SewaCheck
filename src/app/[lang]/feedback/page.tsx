import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDict, isLocale } from "@/i18n/dictionaries";
import { FeedbackForm } from "./FeedbackForm";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: `${getDict(lang).feedback.title} — SewaCheck` };
}

export default async function FeedbackPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDict(lang).feedback;
  const enabled = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy-900">{t.title}</h1>
      <p className="mt-2 text-slate-700">{t.lead}</p>
      {!enabled && (
        <div role="alert" className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-300">
          {t.disabled}
        </div>
      )}
      <div className="mt-8">
        <FeedbackForm enabled={enabled} lang={lang} />
      </div>
    </div>
  );
}
