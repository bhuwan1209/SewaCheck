import type { Detail } from "./services";

/**
 * OFFICE DATA (stored in code; mirrored in supabase/migrations/0004_seed_kathmandu_offices.sql).
 * Only offices whose NAME and details are confirmed on official gov.np sources are listed.
 * Missing fields stay "unavailable" until an official source is added. Never guess them.
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

const standardHours = (sourceId: string, lastVerified: string): Detail => ({
  state: "verified",
  items: [
    "Winter (Kartik 16 to Magh 15): Monday to Friday, 9:00 to 16:00",
    "Summer (Magh 16 to Kartik 15): Monday to Friday, 9:00 to 17:00",
  ],
  itemsNe: [
    "जाडो (कार्तिक १६ देखि माघ १५): सोमबार - शुक्रबार बिहान ९:०० देखि अपराह्न ४:०० बजेसम्म",
    "गर्मी (माघ १६ देखि कार्तिक १५): सोमबार - शुक्रबार बिहान ९:०० देखि बेलुकी ५:०० बजेसम्म",
  ],
  sourceId,
  lastVerified,
});

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
    hours: standardHours("citizenCharter", "2026-11-17"),
    location: null,
  },
  {
    slug: "radheradhe-bhaktapur",
    name: "Transport Management Office, Radheradhe (Bhaktapur)",
    nameNe: "यातायात व्यवस्था कार्यालय, राधेराधे (भक्तपुर)",
    kind: "office",
    district: "Bhaktapur",
    districtNe: "भक्तपुर",
    sourceIds: ["bhaktapurPortal", "radheradhePrinted"],
    address: {
      state: "verified",
      items: ["Radheradhe, Bhaktapur"],
      itemsNe: ["राधेराधे, भक्तपुर"],
      sourceId: "bhaktapurPortal",
      lastVerified: "2026-11-18",
    },
    phone: {
      state: "verified",
      items: ["Phone: 01-6637073", "Email: info.bhaktapurlc@dotm.gov.np"],
      itemsNe: ["फोन: ०१-६६३७०७३", "इमेल: info.bhaktapurlc@dotm.gov.np"],
      sourceId: "bhaktapurPortal",
      lastVerified: "2026-11-18",
    },
    hours: standardHours("bhaktapurPortal", "2026-11-18"),
    location: null,
  },
  {
    slug: "ekantakuna-lalitpur",
    name: "Transport Management Office (Driving Licence), Ekantakuna (Lalitpur)",
    nameNe: "यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र), एकान्तकुना (ललितपुर)",
    kind: "office",
    district: "Lalitpur",
    districtNe: "ललितपुर",
    sourceIds: ["ekantakunaContact"],
    address: {
      state: "verified",
      items: ["Ekantakuna, Lalitpur"],
      itemsNe: ["एकान्तकुना, ललितपुर"],
      sourceId: "ekantakunaContact",
      lastVerified: "2026-11-18",
    },
    phone: {
      state: "verified",
      items: [
        "Phone: 01-5193173",
        "Toll-free: 18105000137",
        "Email: tmodlekantakuna@bagamati.gov.np, ekantakuna.license@gmail.com",
      ],
      itemsNe: [
        "फोन: ०१-५१९३१७३",
        "टोल फ्री नं.: १८१०५०००१३७",
        "इमेल: tmodlekantakuna@bagamati.gov.np, ekantakuna.license@gmail.com",
      ],
      sourceId: "ekantakunaContact",
      lastVerified: "2026-11-18",
    },
    hours: standardHours("ekantakunaContact", "2026-11-18"),
    location: null,
  },
  {
    slug: "chabahil-kathmandu",
    name: "Transport Management Office (Driving Licence), Chabahil (Kathmandu)",
    nameNe: "यातायात व्यवस्था कार्यालय (सवारी चालक अनुमतिपत्र), चाबहिल (काठमाडौं)",
    kind: "office",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["chabahilPortal"],
    address: {
      state: "verified",
      items: ["Chabahil, Kathmandu"],
      itemsNe: ["चाबहिल, काठमाडौं"],
      sourceId: "chabahilPortal",
      lastVerified: "2026-11-18",
    },
    phone: {
      state: "verified",
      items: ["Email: tmodlchabahil@bagamati.gov.np (no phone number listed on homepage)"],
      itemsNe: ["इमेल: tmodlchabahil@bagamati.gov.np (मुख्य पृष्ठमा फोन नम्बर उल्लेख छैन)"],
      sourceId: "chabahilPortal",
      lastVerified: "2026-11-18",
    },
    hours: standardHours("chabahilPortal", "2026-11-18"),
    location: null,
  },
  {
    slug: "gurjudhara-kathmandu",
    name: "Transport Management Office (Motorcycle), Gurjudhara (Kathmandu)",
    nameNe: "यातायात व्यवस्था कार्यालय (मोटरसाइकल), गुर्जुधारा (काठमाडौं)",
    kind: "office",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["gurjudharaIntro"],
    address: {
      state: "verified",
      items: ["Chandragiri Municipality Ward No. 5, Gurjudhara, Kathmandu"],
      itemsNe: ["चन्द्रागिरी नगरपालिका वडा नं. ५, गुर्जुधारा, काठमाडौं"],
      sourceId: "gurjudharaIntro",
      lastVerified: "2026-11-18",
    },
    phone: {
      state: "verified",
      items: ["Email: tmomosakathmandu@bagamati.gov.np (handles two-wheeler registration/tax, not licences)"],
      itemsNe: ["इमेल: tmomosakathmandu@bagamati.gov.np (दुई पाङ्ग्रे सवारी दर्ता/कर कार्यालय, लाइसेन्स होइन)"],
      sourceId: "gurjudharaIntro",
      lastVerified: "2026-11-18",
    },
    hours: standardHours("gurjudharaIntro", "2026-11-18"),
    location: null,
  },
];

export function getOffice(slug: string): Office | undefined {
  return OFFICES.find((o) => o.slug === slug);
}
