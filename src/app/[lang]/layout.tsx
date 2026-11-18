import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LOCALES, isLocale } from "@/i18n/dictionaries";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    // lang on this wrapper tells screen readers which language to read aloud
    <div lang={lang} className="flex min-h-full flex-1 flex-col">
      <Header lang={lang} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
