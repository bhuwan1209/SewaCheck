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

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) redirect("/en/moderation");
  const hash = await clientHash("login");
  if (!hash || !allow(`login:${hash}`, 5, 10 * 60_000)) redirect("/en/moderation?error=slow");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  redirect(error ? "/en/moderation?error=login" : "/en/moderation");
}

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/en/moderation");
}

export async function approveReport(formData: FormData) {
  const supabase = await requireModerator();
  const id = String(formData.get("id") ?? "");
  const officialUrl = String(formData.get("officialUrl") ?? "").trim();
  const update: Record<string, string> = { status: "approved" };
  if (officialUrl) {
    // Only an https link to an official source can make a report "official".
    if (!/^https:\/\/([a-z0-9-]+\.)*gov\.np(\/|$)/i.test(officialUrl)) {
      redirect("/en/moderation?error=url");
    }
    update.source_type = "official";
    update.source_url = officialUrl;
    update.verification_level = "official";
  }
  await supabase.from("status_reports").update(update).eq("id", id);
  revalidatePath("/[lang]/moderation", "page");
  revalidatePath("/[lang]/updates", "page");
}

export async function rejectReport(formData: FormData) {
  const supabase = await requireModerator();
  const id = String(formData.get("id") ?? "");
  const note = String(formData.get("note") ?? "").slice(0, 300);
  await supabase.from("status_reports").update({ status: "rejected", moderation_note: note || null }).eq("id", id);
  revalidatePath("/moderation");
}
