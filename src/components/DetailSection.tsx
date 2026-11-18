import { SOURCES, type Detail } from "@/data/services";
import { getDict, type Locale } from "@/i18n/dictionaries";
import { StatusBadge } from "./StatusBadge";

/** Shows one detail (requirements/fees/steps/address...) with its verification level. */
export function DetailSection({ title, detail, lang }: { title: string; detail: Detail; lang: Locale }) {
  const t = getDict(lang).detail;
  return (
    <section className="rounded-xl border border-navy-100 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-navy-900">{title}</h2>
        <StatusBadge lang={lang} level={detail.state === "verified" ? "official" : "none"} />
      </div>

      {detail.state === "verified" ? (
        <>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-800">
            {(lang === "ne" && detail.itemsNe ? detail.itemsNe : detail.items).map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-slate-600">
            {t.source}:{" "}
            <a className="underline" href={SOURCES[detail.sourceId].url} rel="noopener noreferrer" target="_blank">
              {SOURCES[detail.sourceId].title}
            </a>{" "}
            · {t.lastVerified} {detail.lastVerified}
          </p>
        </>
      ) : (
        <p className="mt-3 text-slate-700">{t.notConfirmed}</p>
      )}
    </section>
  );
}
