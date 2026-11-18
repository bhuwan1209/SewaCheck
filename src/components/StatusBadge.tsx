import { getDict, type Locale } from "@/i18n/dictionaries";

// Colours and icons for the four verification levels.
// Each uses an icon + text, never colour alone (accessibility).
export const STATUS_STYLES = {
  official: { icon: "✓", classes: "bg-sewa-green text-white" },
  community: { icon: "👥", classes: "bg-navy-700 text-white" },
  unverified: { icon: "?", classes: "bg-amber-100 text-amber-900 ring-1 ring-amber-400" },
  none: { icon: "–", classes: "bg-slate-200 text-slate-800" },
} as const;

export type StatusLevel = keyof typeof STATUS_STYLES;
export const STATUS_ORDER: StatusLevel[] = ["official", "community", "unverified", "none"];

export function StatusBadge({ level, lang }: { level: StatusLevel; lang: Locale }) {
  const s = STATUS_STYLES[level];
  const label = getDict(lang).status[level].label;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${s.classes}`}>
      <span aria-hidden="true">{s.icon}</span>
      {label}
    </span>
  );
}
