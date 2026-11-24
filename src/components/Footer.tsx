import Link from "next/link";
import { Logo } from "./Logo";
import { getDict, href, type Locale } from "@/i18n/dictionaries";

export function Footer({ lang }: { lang: Locale }) {
  const t = getDict(lang).footer;
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Logo variant="light" />
        <p className="mt-2 text-sm">{t.tagline}</p>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-navy-100/80">{t.disclaimer}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-navy-100/70">
          <p>{t.small}</p>
          <div className="flex gap-4">
            <Link href={href(lang, "/privacy")} className="underline hover:text-white">
              {t.privacyLink}
            </Link>
            <Link href={href(lang, "/feedback")} className="underline hover:text-white">
              {t.feedbackLink}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
