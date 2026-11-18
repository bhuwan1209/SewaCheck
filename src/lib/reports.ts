/**
 * Pure rules for citizen reports (no database, easy to test).
 */

export const REPORT_CATEGORIES = {
  closed: "Office closed",
  delay: "Long delay or queue",
  system_down: "System or service not working",
  documents: "Document requirement differs from what is published",
  other: "Other",
} as const;
export type ReportCategory = keyof typeof REPORT_CATEGORIES;

/** Reports expire this many hours after submission (matches DB default). */
export const REPORT_LIFETIME_HOURS = 72;
/** After this many hours a report is shown as "getting old". */
export const REPORT_AGING_HOURS = 24;
/** Distinct confirmations needed before the label becomes "Community confirmed". */
export const COMMUNITY_THRESHOLD = 3;

export type ReportInput = {
  officeSlug: string;
  category: string;
  body: string;
  observedAt: string; // ISO string from the form
  honeypot: string; // must be empty (bots fill it in)
  formAgeMs: number; // time between page render and submit
};

export type ValidationResult =
  | { ok: true; value: { category: ReportCategory; body: string; observedAt: Date } }
  | { ok: false; error: string };

/**
 * Privacy guard: we never want identity numbers, contact details or links in
 * reports. Strip common separators, then look for long digit runs.
 */
export function containsSensitiveData(text: string): boolean {
  const compact = text.replace(/[\s\-./()]/g, "");
  if (/\d{8,}/.test(compact)) return true; // citizenship / licence / phone numbers
  if (/[^\s@]+@[^\s@]+\.[^\s@]+/.test(text)) return true; // email
  if (/https?:\/\/|www\./i.test(text)) return true; // links (spam)
  if (/password|passcode|पासवर्ड/i.test(text)) return true;
  return false;
}

export function validateReport(
  input: ReportInput,
  now: Date = new Date(),
): ValidationResult {
  if (input.honeypot.trim() !== "") return { ok: false, error: "Could not submit." };
  if (input.formAgeMs < 3000) {
    return { ok: false, error: "That was very fast. Please check your report and try again." };
  }
  if (!input.officeSlug) return { ok: false, error: "Please choose an office." };
  if (!(input.category in REPORT_CATEGORIES)) {
    return { ok: false, error: "Please choose what you are reporting." };
  }
  const body = input.body.replace(/\s+/g, " ").trim();
  if (body.length < 10) return { ok: false, error: "Please describe what you saw (at least 10 characters)." };
  if (body.length > 500) return { ok: false, error: "Please keep the report under 500 characters." };
  if (containsSensitiveData(body)) {
    return {
      ok: false,
      error:
        "Please remove numbers (such as citizenship, licence or phone numbers), emails, links and passwords. Never share personal details.",
    };
  }
  const observedAt = new Date(input.observedAt);
  if (Number.isNaN(observedAt.getTime())) return { ok: false, error: "Please enter when you saw this." };
  if (observedAt.getTime() > now.getTime() + 5 * 60_000) {
    return { ok: false, error: "The time you saw this cannot be in the future." };
  }
  if (now.getTime() - observedAt.getTime() > REPORT_LIFETIME_HOURS * 3_600_000) {
    return { ok: false, error: `Reports must be about the last ${REPORT_LIFETIME_HOURS} hours.` };
  }
  return { ok: true, value: { category: input.category as ReportCategory, body, observedAt } };
}

// ---------- labels ----------
export type ReportRow = {
  created_at: string;
  expires_at: string;
  source_type: "citizen" | "official";
  source_url: string | null;
  verification_level: "official" | "community" | "unverified";
};

export type DisplayLevel = "official" | "community" | "unverified" | "none";

export function isExpired(report: Pick<ReportRow, "expires_at">, now: Date = new Date()): boolean {
  return new Date(report.expires_at).getTime() <= now.getTime();
}

export function isAging(report: Pick<ReportRow, "created_at">, now: Date = new Date()): boolean {
  return now.getTime() - new Date(report.created_at).getTime() > REPORT_AGING_HOURS * 3_600_000;
}

/**
 * Which verification label to show.
 * - Expired reports become "No recent information" (stale).
 * - "Officially verified" needs an official source type AND an https URL.
 * - "Community confirmed" needs enough distinct confirmations.
 * - Everything else is an "Unverified report".
 */
export function displayLevel(
  report: ReportRow,
  confirmations: number,
  now: Date = new Date(),
): DisplayLevel {
  if (isExpired(report, now)) return "none";
  if (
    report.verification_level === "official" &&
    report.source_type === "official" &&
    report.source_url?.startsWith("https://")
  ) {
    return "official";
  }
  if (confirmations >= COMMUNITY_THRESHOLD) return "community";
  return "unverified";
}

export function sourceLabel(report: Pick<ReportRow, "source_type">): string {
  return report.source_type === "official"
    ? "Official source (see link)"
    : "Citizen report. Not an official announcement.";
}
