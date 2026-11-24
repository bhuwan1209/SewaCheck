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
  /** Official driving-licence services confirmed for this office. */
  serviceSlugs: string[];
  scopeNote?: string;
  scopeNoteNe?: string;
  /** Only set when an official source gives the position. */
  location: { lat: number; lng: number; sourceId: string } | null;
};

const ALL_LICENCE_SERVICES = [
  "driving-licence",
  "licence-renewal",
  "written-examination",
  "trial-examination",
];

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
    serviceSlugs: [],
    scopeNote:
      "Central department overseeing policy, smart-card printing, and national online systems. Licence applications, renewals, and exams are processed at provincial Transport Management Offices.",
    scopeNoteNe:
      "नीति, स्मार्ट कार्ड छपाइ र राष्ट्रिय अनलाइन प्रणाली हेर्ने केन्द्रीय विभाग। लाइसेन्स आवेदन, नवीकरण र परीक्षा प्रादेशिक यातायात व्यवस्था कार्यालयहरूबाट हुन्छन्।",
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
    serviceSlugs: ALL_LICENCE_SERVICES,
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
    serviceSlugs: ALL_LICENCE_SERVICES,
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
    serviceSlugs: ALL_LICENCE_SERVICES,
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
    serviceSlugs: ["bluebook-renewal"],
    scopeNote:
      "Handles two-wheeler (motorcycle/scooter) vehicle registration, ownership transfer, bluebook renewal, and vehicle tax — not driving licences.",
    scopeNoteNe:
      "दुई पाङ्ग्रे (मोटरसाइकल/स्कुटर) सवारी दर्ता, नामसारी, ब्लूबुक नवीकरण र सवारी कर सम्बन्धी कार्यालय — सवारी चालक अनुमतिपत्र (लाइसेन्स) होइन।",
    location: null,
  },
  {
    slug: "kalanki-thulobharyang",
    name: "Transport Management Office, Kalanki (Thulo Bharyang)",
    nameNe: "यातायात व्यवस्था कार्यालय कलंकी, ठूलोभर्‍याङ",
    kind: "office",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["kalankiPortal"],
    address: {
      state: "verified",
      items: ["Thulo Bharyang, Nagarjun-03, Kathmandu"],
      itemsNe: ["ठूलोभर्‍याङ, नागार्जुन - ०३, काठमाडौं"],
      sourceId: "kalankiPortal",
      lastVerified: "2026-11-18",
    },
    phone: {
      state: "verified",
      items: ["Phone: +977 1-5249118", "Email: tmoKalanki@bagamati.gov.np"],
      itemsNe: ["फोन: +९७७ १-५२४९११८", "इमेल: tmoKalanki@bagamati.gov.np"],
      sourceId: "kalankiPortal",
      lastVerified: "2026-11-18",
    },
    hours: standardHours("kalankiPortal", "2026-11-18"),
    serviceSlugs: ALL_LICENCE_SERVICES,
    location: null,
  },
  {
    slug: "department-of-passports-tripureshwor",
    name: "Department of Passports (Tripureshwor)",
    nameNe: "राहदानी विभाग (त्रिपुरेश्वर)",
    kind: "department",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["passportPortal", "passportDocs", "passportFees"],
    address: {
      state: "verified",
      items: ["Tripureshwor, Kathmandu"],
      itemsNe: ["त्रिपुरेश्वर, काठमाडौं"],
      sourceId: "passportPortal",
      lastVerified: "2026-11-24",
    },
    phone: {
      state: "verified",
      items: [
        "Enquiry Hotline: +977 1-5970330",
        "Email: info@nepalpassport.gov.np, communication@nepalpassport.gov.np",
      ],
      itemsNe: [
        "सोधपुछ हटलाइन: +९७७ १-५९७०३३०",
        "इमेल: info@nepalpassport.gov.np, communication@nepalpassport.gov.np",
      ],
      sourceId: "passportPortal",
      lastVerified: "2026-11-24",
    },
    hours: UNKNOWN,
    serviceSlugs: ["epassport-application"],
    scopeNote:
      "Handles emergency / fast-track e-Passport applications (~2 working days). Regular passport service is handled at District Administration Offices (DAOs).",
    scopeNoteNe:
      "द्रुत (Emergency) ई-पासपोर्ट सेवा (~२ कार्यदिन) प्रदान गर्छ। नियमित सेवा जिल्ला प्रशासन कार्यालय (DAO) बाट हुन्छ।",
    location: null,
  },
  {
    slug: "dao-kathmandu-babarmahal",
    name: "District Administration Office, Kathmandu (Babarmahal)",
    nameNe: "जिल्ला प्रशासन कार्यालय, काठमाडौं (बबरमहल)",
    kind: "office",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["daoKathmandu", "passportDocs", "donidcrPortal"],
    address: {
      state: "verified",
      items: ["Babarmahal, Kathmandu"],
      itemsNe: ["बबरमहल, काठमाडौं"],
      sourceId: "daoKathmandu",
      lastVerified: "2026-11-24",
    },
    phone: {
      state: "verified",
      items: [
        "Citizenship records: 01-5971880",
        "Email: daobabarmahal@gmail.com, avilekh.daoktm@gmail.com",
      ],
      itemsNe: [
        "नागरिकता अभिलेख: ०१-५९७१८८०",
        "इमेल: daobabarmahal@gmail.com, avilekh.daoktm@gmail.com",
      ],
      sourceId: "daoKathmandu",
      lastVerified: "2026-11-24",
    },
    hours: {
      state: "verified",
      items: ["Monday to Friday, 09:00 AM - 5:00 PM (as published on DAO Kathmandu portal)"],
      itemsNe: ["सोमबार देखि शुक्रबार, बिहान ९:०० देखि बेलुका ५:०० बजेसम्म"],
      sourceId: "daoKathmandu",
      lastVerified: "2026-11-24",
    },
    serviceSlugs: ["citizenship-certificate", "epassport-application", "national-id"],
    location: null,
  },
  {
    slug: "donidcr-singhadurbar",
    name: "Department of National ID and Civil Registration (Singhadurbar)",
    nameNe: "राष्ट्रिय परिचयपत्र तथा पञ्जीकरण विभाग (सिंहदरबार)",
    kind: "department",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["donidcrPortal", "nidCitizenPortal"],
    address: {
      state: "verified",
      items: ["Singhadurbar, Kathmandu (Narayanhiti enrollment contact also listed)"],
      itemsNe: ["सिंहदरबार, काठमाडौं (नारायणहिटी सम्पर्क समेत उल्लेख)"],
      sourceId: "donidcrPortal",
      lastVerified: "2026-11-24",
    },
    phone: {
      state: "verified",
      items: [
        "Phone: 01-5970112, 01-4200014, 01-4500079 (Narayanhiti)",
        "Toll-free: 1147 | Email: nid@donidcr.gov.np, info@donidcr.gov.np",
      ],
      itemsNe: [
        "फोन: ०१-५९७०११२, ०१-४२०००१४, ०१-४५०००७९ (नारायणहिटी)",
        "टोल फ्री: ११४७ | इमेल: nid@donidcr.gov.np, info@donidcr.gov.np",
      ],
      sourceId: "donidcrPortal",
      lastVerified: "2026-11-24",
    },
    hours: standardHours("donidcrPortal", "2026-11-24"),
    serviceSlugs: ["national-id"],
    location: null,
  },
  {
    slug: "ird-lazimpat",
    name: "Inland Revenue Department (Lazimpat)",
    nameNe: "आन्तरिक राजस्व विभाग (लाजिम्पाट)",
    kind: "department",
    district: "Kathmandu",
    districtNe: "काठमाडौं",
    sourceIds: ["irdPortal"],
    address: {
      state: "verified",
      items: ["Lazimpat, Kathmandu"],
      itemsNe: ["लाजिम्पाट, काठमाडौं"],
      sourceId: "irdPortal",
      lastVerified: "2026-11-24",
    },
    phone: {
      state: "verified",
      items: ["Phone: 01-5970081", "Email: serviceird@ird.gov.np"],
      itemsNe: ["फोन: ०१-५९७००८१", "इमेल: serviceird@ird.gov.np"],
      sourceId: "irdPortal",
      lastVerified: "2026-11-24",
    },
    hours: standardHours("irdPortal", "2026-11-24"),
    serviceSlugs: ["personal-pan"],
    location: null,
  },
];

export function getOffice(slug: string): Office | undefined {
  return OFFICES.find((o) => o.slug === slug);
}
