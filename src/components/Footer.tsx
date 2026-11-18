import { Logo } from "./Logo";
import { getDict, type Locale } from "@/i18n/dictionaries";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDict(lang).footer;
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Logo variant="light" />
        <p className="mt-2 text-sm">{t.tagline}</p>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-navy-100/80">{t.disclaimer}</p>
        <p className="mt-6 text-xs text-navy-100/60">{t.small}</p>
      </div>
    </footer>
  );
}
