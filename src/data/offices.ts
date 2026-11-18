import type { Detail } from "./services";

/**
 * OFFICE DATA (stored in code; mirrored in supabase/seed.sql).
 * Only offices whose NAME is confirmed on an official source are listed.
 * Address, phone, hours and map position stay "unavailable" until an
 * official source is added. Never guess them.
 * Nepali names/text are copied word-for-word from dotm.gov.np.
 */

export type Office = {
  slug: string;
  name: string;
  /** Official Nepali name, copied from the official site. */
  nameNe: string;
  kind: "department" | "office";
  district: string;
  districtNe: string;
  sourceIds: string[];
  address: Detail;
  phone: Detail;
  hours: Detail;
  /** Only set when an official source gives the position. */
  location: { lat: number; lng: number; sourceId: string } | null;
};

const UNKNOWN: Detail = { state: "unavailable" };

export const OFFICES: Office[] = [
  {
    slug: "dotm-head-office",
    name: "Department of Transport Management (head office)",
    nameNe: "यातायात व्यवस्था विभाग (मुख्य कार्यालय)",
    kind: "department",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["citizenCharter", "dotmHome"],
    address: {
      state: "verified",
      items: ["Minbhawan, Kathmandu"],
      itemsNe: ["मीनभवन, काठमाडौं"],
      sourceId: "citizenCharter",
      lastVerified: "2026-11-17",
    },
    phone: UNKNOWN,
    hours: {
      state: "verified",
      items: [
        "Winter (Kartik 16 to Magh 15): Monday to Friday, 9:00 to 16:00",
        "Summer (Magh 16 to Kartik 15): Monday to Friday, 9:00 to 17:00",
        "These are the Department's office hours. A transport office may differ.",
      ],
      itemsNe: [
        "जाडो (कार्तिक १६ देखि माघ १५): सोमबार - शुक्रबार ९:०० बजेदेखि ४:०० बजेसम्म",
        "गर्मी (माघ १६ देखि कार्तिक १५): सोमबार - शुक्रबार ९:०० बजेदेखि ५:०० बजेसम्म",
        "यी विभागको कार्यालय समय हुन्। यातायात कार्यालयको समय फरक हुन सक्छ।",
      ],
      sourceId: "citizenCharter",
      lastVerified: "2026-11-17",
    },
    location: null,
  },
  {
    slug: "radheradhe-bhaktapur",
    name: "Transport Management Office, Radheradhe (Bhaktapur)",
    nameNe: "यातायात व्यवस्था कार्यालय, राधेराधे (भक्तपुर)",
    kind: "office",
    district: "Bhaktapur",
    districtNe: "भक्तपुर",
    sourceIds: ["radheradhePrinted", "dotmOfficeContacts"],
    address: UNKNOWN,
    phone: UNKNOWN,
    hours: UNKNOWN,
    location: null,
  },
];

export function getOffice(slug: string): Office | undefined {
  return OFFICES.find((o) => o.slug === slug);
}
