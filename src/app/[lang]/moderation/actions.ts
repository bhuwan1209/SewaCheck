"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { allow, clientHash } from "@/lib/spam";

async function requireModerator() {
  if (!isSupabaseConfigured()) throw new Error("Not configured");
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser(); // verifies the token with Supabase
  const role = data.user?.app_metadata?.role;
  if (!data.user || role !== "moderator") throw new Error("Not allowed");
  return supabase;
}

function modPath(formData?: FormData) {
  const lang = String(formData?.get("lang") ?? "en") === "ne" ? "ne" : "en";
  return `/${lang}/moderation`;
}

export async function signIn(formData: FormData) {
  const base = modPath(formData);
  if (!isSupabaseConfigured()) redirect(base);
  if (process.env.SPAM_HASH_SALT) {
    const hash = await clientHash("login");
    if (!hash || !allow(`login:${hash}`, 5, 10 * 60_000)) redirect(`${base}?error=slow`);
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  redirect(error ? `${base}?error=login` : base);
}

export async function signOut(formData: FormData) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect(modPath(formData));
}

export async function approveReport(formData: FormData) {
  const base = modPath(formData);
  const supabase = await requireModerator();
  const id = String(formData.get("id") ?? "");
  const officialUrl = String(formData.get("officialUrl") ?? "").trim();
  const update: Record<string, string> = { status: "approved" };
  if (officialUrl) {
    // Only an https link to an official source can make a report "official".
    if (!/^https:\/\/([a-z0-9-]+\.)*gov\.np(\/|$)/i.test(officialUrl)) {
      redirect(`${base}?error=url`);
    }
    update.source_type = "official";
    update.source_url = officialUrl;
    update.verification_level = "official";
  }
  const { error } = await supabase.from("status_reports").update(update).eq("id", id);
  if (error) redirect(`${base}?error=update`);
  revalidatePath("/[lang]/moderation", "page");
  revalidatePath("/[lang]/updates", "page");
}

export async function rejectReport(formData: FormData) {
  const base = modPath(formData);
  const supabase = await requireModerator();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 300);
  const { error } = await supabase
    .from("status_reports")
    .update({ status: "rejected", moderation_note: note || null })
    .eq("id", id);
  if (error) redirect(`${base}?error=update`);
  revalidatePath("/[lang]/moderation", "page");
}
