"use server";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { allow, clientHash } from "@/lib/spam";
import { validateReport } from "@/lib/reports";
import { revalidatePath } from "next/cache";

export type FormState = { ok: boolean; message: string };

export async function submitReport(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured() || !process.env.SPAM_HASH_SALT) {
    return { ok: false, message: "Reporting is not switched on yet. Nothing was saved." };
  }
  const hash = await clientHash("report");
  if (!hash || !allow(`report:${hash}`, 3, 10 * 60_000)) {
    return { ok: false, message: "Too many reports. Please wait a few minutes." };
  }

  const str = (k: string) => String(formData.get(k) ?? "");
  const result = validateReport({
    officeSlug: str("office"),
    category: str("category"),
    body: str("body"),
    observedAt: str("observedAt"),
    honeypot: str("website"),
    formAgeMs: Date.now() - Number(str("renderedAt") || Date.now()),
  });
  if (!result.ok) return { ok: false, message: result.error };

  const supabase = await createClient();
  const { data: office } = await supabase
    .from("offices")
    .select("id")
    .eq("slug", str("office"))
    .maybeSingle();
  if (!office) return { ok: false, message: "Please choose a listed office." };

  const serviceSlug = str("service");
  let serviceId: string | null = null;
  if (serviceSlug) {
    const { data: s } = await supabase.from("services").select("id").eq("slug", serviceSlug).maybeSingle();
    serviceId = s?.id ?? null;
  }

  // Always 'pending' + 'unverified' + 'citizen': the database policy enforces this too.
  const { error } = await supabase.from("status_reports").insert({
    office_id: office.id,
    service_id: serviceId,
    category: result.value.category,
    body: result.value.body,
    observed_at: result.value.observedAt.toISOString(),
    client_hash: hash,
    status: "pending",
    verification_level: "unverified",
    source_type: "citizen",
  });
  if (error) return { ok: false, message: "Could not save your report. Please try again later." };

  return {
    ok: true,
    message:
      "Thank you. Your report will be reviewed by a moderator. It is only published after approval and is never an official announcement.",
  };
}

export async function confirmReport(formData: FormData): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const id = String(formData.get("reportId") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const hash = await clientHash(`confirm:${id}`);
  if (!hash || !allow(`confirm:${hash}`, 10, 10 * 60_000)) return;
  const supabase = await createClient();
  // unique(report_id, fingerprint) means a duplicate is silently rejected
  await supabase.from("report_confirmations").insert({ report_id: id, fingerprint: hash });
  revalidatePath("/[lang]/updates", "page");
}

export async function sendFeedback(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!isSupabaseConfigured() || !process.env.SPAM_HASH_SALT) {
    return { ok: false, message: "Feedback is not switched on yet. Nothing was saved." };
  }
  if (String(formData.get("website") ?? "") !== "") return { ok: false, message: "Could not submit." };
  const message = String(formData.get("message") ?? "").replace(/\s+/g, " ").trim();
  if (message.length < 5 || message.length > 1000) {
    return { ok: false, message: "Please write between 5 and 1000 characters." };
  }
  const hash = await clientHash("feedback");
  if (!hash || !allow(`feedback:${hash}`, 3, 10 * 60_000)) {
    return { ok: false, message: "Too many messages. Please wait a few minutes." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("feedback").insert({ message, page: "site", client_hash: hash });
  if (error) return { ok: false, message: "Could not send feedback. Please try later." };
  return { ok: true, message: "Thank you for your feedback." };
}
