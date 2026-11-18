import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

/**
 * Anonymous, salted hash of IP + browser. Lets us rate-limit and stop
 * duplicate confirmations WITHOUT storing the IP address itself.
 */
export async function clientHash(purpose: string): Promise<string | null> {
  const salt = process.env.SPAM_HASH_SALT;
  if (!salt) return null;
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const ua = h.get("user-agent") ?? "";
  return createHash("sha256").update(`${salt}|${purpose}|${ip}|${ua}`).digest("hex");
}

// Simple in-memory limiter (per server instance). The database has its own limit too.
const hits = new Map<string, number[]>();
export function allow(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
