"use client";

import { useState } from "react";
import { getDict, type Locale } from "@/i18n/dictionaries";

/**
 * Interactive document-readiness checklist (purely local in browser state;
 * nothing is saved or sent to any server).
 */
export function ChecklistSection({
  lang,
  items,
}: {
  lang: Locale;
  items: string[];
}) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const done = items.filter((_, i) => checked[i]).length;
  const t = getDict(lang).detail;

  return (
    <section className="rounded-xl border border-sewa-green/40 bg-sewa-green-light/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-navy-900">{t.checklistTitle}</h2>
        <span className="text-xs font-semibold text-navy-900">
          {done === items.length ? t.checklistReady : t.checklistProgress(done, items.length)}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={item}>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg bg-white p-3 text-sm text-navy-950 ring-1 ring-navy-100">
              <input
                type="checkbox"
                checked={Boolean(checked[i])}
                onChange={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[#0f7a4a]"
              />
              <span className={checked[i] ? "line-through text-slate-500" : ""}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
