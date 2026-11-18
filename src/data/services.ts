/**
 * SERVICE DATA (Phase 2: stored in code; moves to Supabase in Phase 4).
 *
 * ACCURACY RULES
 * - Never add a fee, document, step, hour or address unless it comes from an
 *   official government source. Add that source below first.
 * - A detail is either "unavailable" or "verified" (with a source + date).
 */

export type Source = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  /** Date (YYYY-MM-DD) we last opened this page and confirmed it exists. */
  lastChecked: string;
  /** What we actually confirmed. Be honest and specific. */
  note: string;
};

export const SOURCES: Record<string, Source> = {
  dotmHome: {
    id: "dotmHome",
    title: "Department of Transport Management (official website)",
    url: "https://www.dotm.gov.np/",
    publisher: "Department of Transport Management, Government of Nepal",
    lastChecked: "2026-11-17",
    note: "Website reachable. Used as the starting point for official information.",
  },
  citizenCharter: {
    id: "citizenCharter",
    title: "Citizen Charter (नागरिक बडापत्र)",
    url: "https://www.dotm.gov.np/pages/citizen-charter",
    publisher: "Department of Transport Management, Government of Nepal",
    lastChecked: "2026-11-17",
    note: "Page reachable. The text we could read did not list service documents or fees, so no requirements are copied from it yet.",
  },
  edlvrsNotice: {
    id: "edlvrsNotice",
    title: "Notice about the online EDLVRS licence and vehicle registration system",
    url: "https://www.dotm.gov.np/content/106/driver-s-license/",
    publisher: "Department of Transport Management, Government of Nepal",
    lastChecked: "2026-11-17",
    note: "Page exists (title seen on the official site). Its contents have not yet been reviewed by us.",
  },
  dotmOfficeContacts: {
    id: "dotmOfficeContacts",
    title: "Transport offices' contact details (category page)",
    url: "https://www.dotm.gov.np/category/transport-offices-contacts/",
    publisher: "Department of Transport Management, Government of Nepal",
    lastChecked: "2026-11-17",
    note: "Page reachable but showed no office list in readable text, so no office addresses or phone numbers are copied from it.",
  },
  radheradhePrinted: {
    id: "radheradhePrinted",
    title: "Printed licences notice: Transport Management Office, Radheradhe (Bhaktapur)",
    url: "https://www.dotm.gov.np/content/85/regular-print-license-radheradhe2/",
    publisher: "Department of Transport Management, Government of Nepal",
    lastChecked: "2026-11-17",
    note: "Confirms that an office named 'Radheradhe (Bhaktapur)' exists.",
  },
  bhaktapurPortal: {
    id: "bhaktapurPortal",
    title: "Transport Management Office, Radheradhe (Bhaktapur) — Official Portal",
    url: "https://bhaktapurlicense.bagmati.gov.np/",
    publisher: "Ministry of Industry, Tourism, Labour and Transport, Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms office address (Radheradhe, Bhaktapur), phone (01-6637073), email, and Mon–Fri office hours.",
  },
  bhaktapurRenewal: {
    id: "bhaktapurRenewal",
    title: "Licence Renewal Information — TMO Radheradhe (Bhaktapur)",
    url: "https://bhaktapurlicense.bagmati.gov.np/pages/licenserenewal-10/",
    publisher: "Transport Management Office, Radheradhe (Bhaktapur), Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms in-person requirement (original licence and original citizenship), 90-day renewal window, 100%–500% late fines, and 5-year cancellation rule. Base rupee fee is not listed on this page.",
  },
  ekantakunaContact: {
    id: "ekantakunaContact",
    title: "Contact Us — TMO (Driving Licence), Ekantakuna (Lalitpur)",
    url: "https://ekantakunalicense.bagamati.gov.np/contact-us/",
    publisher: "Transport Management Office (Driving Licence), Ekantakuna, Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms address (Ekantakuna, Lalitpur), phone (01-5193173), toll-free (18105000137), email, and Mon–Fri office hours.",
  },
  chabahilPortal: {
    id: "chabahilPortal",
    title: "TMO (Driving Licence), Chabahil (Kathmandu) — Official Portal",
    url: "https://chabahillicense.bagamati.gov.np/",
    publisher: "Transport Management Office (Driving Licence), Chabahil, Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms address (Chabahil, Kathmandu), email (tmodlchabahil@bagamati.gov.np), and Mon–Fri office hours. Phone number not listed on homepage.",
  },
  gurjudharaIntro: {
    id: "gurjudharaIntro",
    title: "Introduction — TMO (Motorcycle), Gurjudhara (Kathmandu)",
    url: "https://mosa.bagamati.gov.np/pages/introduction/",
    publisher: "Transport Management Office (Motorcycle), Gurjudhara, Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms address (Chandragiri-5, Gurjudhara, Kathmandu), email, Mon–Fri office hours, and two-wheeler vehicle registration/tax scope.",
  },
  writtenExamQuestions: {
    id: "writtenExamQuestions",
    title: "Written examination questions for class (B), 2082-83",
    url: "https://www.dotm.gov.np/content/111/-b--written-examination-questions-for-class-2082-83/",
    publisher: "Department of Transport Management, Government of Nepal",
    lastChecked: "2026-11-17",
    note: "The official site publishes written-exam question material. Page exists; contents not yet reviewed by us.",
  },
};

/** A piece of information is either unavailable or verified with a source. */
export type Detail =
  | { state: "unavailable" }
  | {
      state: "verified";
      items: string[];
      /** Optional Nepali version of items (copied from the official Nepali page). */
      itemsNe?: string[];
      sourceId: string;
      lastVerified: string; // YYYY-MM-DD
    };

export type Service = {
  slug: string;
  name: string;
  nameNe: string;
  summaryNe: string;
  /** Neutral description of what the page covers (not a procedure). */
  summary: string;
  keywords: string[];
  /** Official pages that relate to this service. */
  sourceIds: string[];
  details: {
    requirements: Detail;
    fees: Detail;
    steps: Detail;
  };
};

const UNKNOWN: Detail = { state: "unavailable" };

export const SERVICES: Service[] = [
  {
    slug: "driving-licence",
    name: "Driving licence",
    nameNe: "सवारी चालक अनुमतिपत्र (लाइसेन्स)",
    summaryNe: "नयाँ सवारी चालक अनुमतिपत्रका लागि आवेदन दिने बारेको जानकारी।",
    summary: "Information about applying for a new driving licence.",
    keywords: ["सवारी चालक", "अनुमतिपत्र", "लाइसेन्स", "नयाँ", "driving", "licence", "license", "new", "apply", "dl"],
    sourceIds: ["dotmHome", "citizenCharter", "edlvrsNotice"],
    details: { requirements: UNKNOWN, fees: UNKNOWN, steps: UNKNOWN },
  },
  {
    slug: "licence-renewal",
    name: "Licence renewal",
    nameNe: "लाइसेन्स नवीकरण",
    summaryNe: "हालको सवारी चालक अनुमतिपत्र नवीकरण गर्ने बारेको जानकारी।",
    summary: "Information about renewing an existing driving licence.",
    keywords: ["नवीकरण", "रिन्यु", "renew", "renewal", "licence", "license", "expired", "expiry"],
    sourceIds: ["bhaktapurRenewal", "dotmHome", "citizenCharter", "edlvrsNotice"],
    details: {
      requirements: {
        state: "verified",
        items: [
          "Original driving licence",
          "Original Nepali citizenship certificate",
          "The licence holder must appear in person at the relevant transport office",
        ],
        itemsNe: [
          "सक्कल सवारी चालक अनुमतिपत्र (लाइसेन्स)",
          "सक्कल नेपाली नागरिकता प्रमाणपत्र",
          "सम्बन्धित व्यक्ति स्वयं कार्यालयमा उपस्थित हुनुपर्ने",
        ],
        sourceId: "bhaktapurRenewal",
        lastVerified: "2026-11-18",
      },
      fees: {
        state: "verified",
        items: [
          "Base renewal fee in NPR is not published on this source page — confirm with the office.",
          "Regular renewal window: within 90 days of expiry.",
          "Late penalty after 90 days: +100% (up to 1 year), +200% (up to 2 years), +300% (up to 3 years), +400% (up to 4 years), +500% (up to 5 years).",
          "Licences not renewed within 5 years of expiry are automatically cancelled.",
        ],
        itemsNe: [
          "आधारभूत नवीकरण शुल्क (रुपैयाँ) यस स्रोत पृष्ठमा उल्लेख छैन — कार्यालयमा पुष्टि गर्नुहोस्।",
          "नियमित नवीकरण अवधि: म्याद समाप्त भएको ९० दिनभित्र।",
          "९० दिन नाघेपछिको थप जरिवाना: १ वर्षसम्म १००%, २ वर्षसम्म २००%, ३ वर्षसम्म ३००%, ४ वर्षसम्म ४००% र ५ वर्षसम्म ५००%।",
          "५ वर्षसम्म पनि नवीकरण नगराइएको चालक अनुमतिपत्र स्वतः रद्द हुनेछ।",
        ],
        sourceId: "bhaktapurRenewal",
        lastVerified: "2026-11-18",
      },
      steps: UNKNOWN,
    },
  },
  {
    slug: "written-examination",
    name: "Written examination",
    nameNe: "लिखित परीक्षा",
    summaryNe: "सवारी चालक अनुमतिपत्रको लिखित (सैद्धान्तिक) परीक्षा बारेको जानकारी।",
    summary: "Information about the written (theory) driving examination.",
    keywords: ["लिखित", "परीक्षा", "written", "exam", "likhit", "theory", "test", "questions"],
    sourceIds: ["dotmHome", "writtenExamQuestions", "citizenCharter"],
    details: { requirements: UNKNOWN, fees: UNKNOWN, steps: UNKNOWN },
  },
  {
    slug: "trial-examination",
    name: "Trial examination",
    nameNe: "ट्रायल (प्रयोगात्मक) परीक्षा",
    summaryNe: "सवारी चालक अनुमतिपत्रको प्रयोगात्मक (ट्रायल) परीक्षा बारेको जानकारी।",
    summary: "Information about the practical driving (trial) examination.",
    keywords: ["ट्रायल", "प्रयोगात्मक", "परीक्षा", "trial", "practical", "driving test", "exam", "road test"],
    sourceIds: ["dotmHome", "citizenCharter"],
    details: { requirements: UNKNOWN, fees: UNKNOWN, steps: UNKNOWN },
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export function searchServices(query: string): Service[] {
  const q = query.trim().toLowerCase();
  if (!q) return SERVICES;
  return SERVICES.filter((s) =>
    [s.name, s.summary, ...s.keywords].some((t) => t.toLowerCase().includes(q)),
  );
}

