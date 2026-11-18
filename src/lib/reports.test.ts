import { describe, expect, it } from "vitest";
import {
  COMMUNITY_THRESHOLD,
  containsSensitiveData,
  displayLevel,
  isAging,
  validateReport,
  type ReportRow,
} from "./reports";

const now = new Date("2026-11-18T12:00:00Z");
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString();

const good = {
  officeSlug: "radheradhe-bhaktapur",
  category: "delay",
  body: "Queue was very long this morning.",
  observedAt: hoursAgo(2),
  honeypot: "",
  formAgeMs: 10_000,
};

describe("validateReport", () => {
  it("accepts a normal report", () => {
    expect(validateReport(good, now).ok).toBe(true);
  });
  it("rejects bots (honeypot filled)", () => {
    expect(validateReport({ ...good, honeypot: "x" }, now).ok).toBe(false);
  });
  it("rejects instant submissions", () => {
    expect(validateReport({ ...good, formAgeMs: 500 }, now).ok).toBe(false);
  });
  it("rejects too short / too long text", () => {
    expect(validateReport({ ...good, body: "short" }, now).ok).toBe(false);
    expect(validateReport({ ...good, body: "a".repeat(501) }, now).ok).toBe(false);
  });
  it("rejects unknown category", () => {
    expect(validateReport({ ...good, category: "hack" }, now).ok).toBe(false);
  });
  it("rejects future and too-old times", () => {
    expect(validateReport({ ...good, observedAt: hoursAgo(-3) }, now).ok).toBe(false);
    expect(validateReport({ ...good, observedAt: hoursAgo(100) }, now).ok).toBe(false);
  });
  it("rejects personal data", () => {
    const bad = (body: string) => validateReport({ ...good, body }, now).ok;
    expect(bad("My citizenship number is 27-01-72-01234 please help")).toBe(false);
    expect(bad("Call me on 9841234567 about the queue")).toBe(false);
    expect(bad("email me at a@b.com about the closure")).toBe(false);
    expect(bad("see https://example.com for details here")).toBe(false);
  });
});

describe("containsSensitiveData", () => {
  it("allows short numbers like times and queue sizes", () => {
    expect(containsSensitiveData("About 50 people, opened at 10:30")).toBe(false);
  });
});

describe("displayLevel", () => {
  const base: ReportRow = {
    created_at: hoursAgo(1),
    expires_at: new Date(now.getTime() + 3_600_000).toISOString(),
    source_type: "citizen",
    source_url: null,
    verification_level: "unverified",
  };
  it("is unverified by default", () => {
    expect(displayLevel(base, 0, now)).toBe("unverified");
  });
  it("needs enough confirmations for community", () => {
    expect(displayLevel(base, COMMUNITY_THRESHOLD - 1, now)).toBe("unverified");
    expect(displayLevel(base, COMMUNITY_THRESHOLD, now)).toBe("community");
  });
  it("expired reports become 'no recent information'", () => {
    const old = { ...base, expires_at: hoursAgo(1) };
    expect(displayLevel(old, 99, now)).toBe("none");
  });
  it("never shows a citizen report as official", () => {
    const sneaky = { ...base, verification_level: "official" as const };
    expect(displayLevel(sneaky, 0, now)).toBe("unverified");
  });
  it("official needs official source + https url", () => {
    const off = { ...base, source_type: "official" as const, verification_level: "official" as const };
    expect(displayLevel(off, 0, now)).toBe("unverified"); // no url
    expect(displayLevel({ ...off, source_url: "https://www.dotm.gov.np/x" }, 0, now)).toBe("official");
  });
});

describe("isAging", () => {
  it("flags reports older than 24h", () => {
    expect(isAging({ created_at: hoursAgo(25) }, now)).toBe(true);
    expect(isAging({ created_at: hoursAgo(2) }, now)).toBe(false);
  });
});
