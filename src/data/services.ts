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
  bhaktapurNewLicense: {
    id: "bhaktapurNewLicense",
    title: "New Driving Licence — TMO Radheradhe (Bhaktapur)",
    url: "https://bhaktapurlicense.bagmati.gov.np/pages/newlicense-8",
    publisher: "Transport Management Office, Radheradhe (Bhaktapur), Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms online booking at applydlnew.dotm.gov.np/login, printed application + original citizenship requirement for biometrics, and revenue counter hours (Sun–Thu 10:00–16:00, Fri 10:00–14:00).",
  },
  bhaktapurWrittenResult: {
    id: "bhaktapurWrittenResult",
    title: "Written Exam Result & Trial Date Notice — TMO Radheradhe (Bhaktapur)",
    url: "https://bhaktapurlicense.bagmati.gov.np/content/337/as-the-results-of-the-candidates-participating/",
    publisher: "Transport Management Office, Radheradhe (Bhaktapur), Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms written exam results appear in the applicant's user portal and passing candidates book their Trial Test date from that portal.",
  },
  kalankiPortal: {
    id: "kalankiPortal",
    title: "TMO Kalanki (Thulo Bharyang) — Official Portal",
    url: "https://tmokalanki.bagamati.gov.np/carousel-detail/1/",
    publisher: "Transport Management Office, Kalanki (Thulo Bharyang), Bagmati Province",
    lastChecked: "2026-11-18",
    note: "Confirms address (Thulo Bharyang, Nagarjun-03), phone (+977 1-5249118), email (tmoKalanki@bagamati.gov.np), and Mon–Fri office hours.",
  },
  kalankiNewApp: {
    id: "kalankiNewApp",
    title: "New Driving Licence Process & Fees — TMO Kalanki (Thulo Bharyang)",
    url: "https://tmokalanki.bagamati.gov.np/pages/services-new-application-registration/",
    publisher: "Transport Management Office, Kalanki (Thulo Bharyang), Bagmati Province",
    lastChecked: "2026-11-24",
    note: "Confirms NPR 500 application fee (covers 1 written + up to 3 trial attempts), NPR 500 per retrial, citizenship original + photocopy, and medical report requirement.",
  },
  kalankiRenewal: {
    id: "kalankiRenewal",
    title: "Licence Renewal Guide — TMO Kalanki (Thulo Bharyang)",
    url: "https://tmokalanki.bagamati.gov.np/pages/renew-license/",
    publisher: "Transport Management Office, Kalanki (Thulo Bharyang), Bagmati Province",
    lastChecked: "2026-11-24",
    note: "Confirms online renewal steps via applydlnew.dotm.gov.np (OTP, fetch licence, appointment, digital uploads, ConnectIPS/eSewa/Khalti/bank payment, and biometric visit).",
  },
  gurjudharaBluebook: {
    id: "gurjudharaBluebook",
    title: "Bluebook Renewal — TMO (Motorcycle), Gurjudhara",
    url: "https://mosa.bagamati.gov.np/pages/bluebook-renewal/",
    publisher: "Transport Management Office (Motorcycle), Gurjudhara, Bagmati Province",
    lastChecked: "2026-11-24",
    note: "Official page reachable (200 OK) for two-wheeler bluebook renewal.",
  },
  passportPortal: {
    id: "passportPortal",
    title: "Department of Passports — Official Website",
    url: "https://nepalpassport.gov.np/",
    publisher: "Department of Passports, Government of Nepal",
    lastChecked: "2026-11-24",
    note: "Confirms Tripureshwor Kathmandu address and enquiry hotline (+977 1-5970330).",
  },
  passportDocs: {
    id: "passportDocs",
    title: "Where to Apply & Required Documents for e-Passport",
    url: "https://nepalpassport.gov.np/en/process/process-20",
    publisher: "Department of Passports, Government of Nepal",
    lastChecked: "2026-11-24",
    note: "Confirms regular DAO/AAO (10–30 days) vs Department of Passports Tripureshwor emergency (~2 working days), and required barcode/QR application form + original citizenship.",
  },
  passportFees: {
    id: "passportFees",
    title: "Revenue for Passport — Department of Passports",
    url: "https://nepalpassport.gov.np/en/process/process-25",
    publisher: "Department of Passports, Government of Nepal",
    lastChecked: "2026-11-24",
    note: "Confirms official Department of Passports revenue schedule (NPR 12,000/20,000 fast-track, minor rates, lost/damaged rates, free error correction).",
  },
  donidcrPortal: {
    id: "donidcrPortal",
    title: "Department of National ID and Civil Registration (DoNIDCR)",
    url: "https://donidcr.gov.np/",
    publisher: "Department of National ID and Civil Registration, Government of Nepal",
    lastChecked: "2026-11-24",
    note: "Confirms Singhadurbar Kathmandu address, Narayanhiti contact (01-4500079), toll-free 1147, and Mon–Fri office hours.",
  },
  nidCitizenPortal: {
    id: "nidCitizenPortal",
    title: "National ID Citizen Portal (Pre-enrollment & Status)",
    url: "https://citizenportal.donidcr.gov.np/en",
    publisher: "Department of National ID and Civil Registration, Government of Nepal",
    lastChecked: "2026-11-24",
    note: "Official citizen portal for National ID online pre-enrollment and status checking.",
  },
  daoKathmandu: {
    id: "daoKathmandu",
    title: "District Administration Office, Kathmandu — Citizenship Documents",
    url: "https://daokathmandu.moha.gov.np/en/post/na-pa-l-na-gara-kata-ka-pa-rama-naepata-ra-bna-una-ca-ha-na-ka-gaja-tahara",
    publisher: "District Administration Office, Kathmandu (Ministry of Home Affairs)",
    lastChecked: "2026-11-24",
    note: "Confirms Babarmahal address, citizenship records phone (01-5971880), Mon–Fri 9:00–17:00 hours, and links to official नागरिकता_कागजात.PDF.",
  },
  irdPortal: {
    id: "irdPortal",
    title: "Inland Revenue Department (IRD) — Official Portal",
    url: "https://ird.gov.np/",
    publisher: "Inland Revenue Department, Government of Nepal",
    lastChecked: "2026-11-24",
    note: "Confirms Lazimpat Kathmandu address, phone (01-5970081), Mon–Fri hours, and online Personal PAN generation via National ID number.",
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

export type Sector = "transport" | "passport" | "identity" | "tax";

export type Service = {
  slug: string;
  sector: Sector;
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
    sector: "transport",
    name: "Driving licence",
    nameNe: "सवारी चालक अनुमतिपत्र (लाइसेन्स)",
    summaryNe: "नयाँ सवारी चालक अनुमतिपत्रका लागि आवेदन दिने बारेको जानकारी।",
    summary: "Information about applying for a new driving licence.",
    keywords: ["सवारी चालक", "अनुमतिपत्र", "लाइसेन्स", "नयाँ", "driving", "licence", "license", "new", "apply", "dl"],
    sourceIds: ["kalankiNewApp", "bhaktapurNewLicense", "dotmHome", "citizenCharter", "edlvrsNotice"],
    details: {
      requirements: {
        state: "verified",
        items: [
          "Printed copy of the online application form (from applydlnew.dotm.gov.np)",
          "Original Nepali citizenship certificate AND a photocopy",
          "Medical / health examination report from a ministry-listed health provider (completed after biometrics)",
          "Applicant must appear in person on the booked appointment date for biometrics (photo, thumbprint, signature)",
          "For Category F (Medium) & G (Heavy) only: at least 2 years of Category B licence experience and original licence",
        ],
        itemsNe: [
          "अनलाइन आवेदन फारमको प्रिन्ट प्रति (applydlnew.dotm.gov.np बाट)",
          "नेपाली नागरिकताको सक्कल र प्रतिलिपि",
          "बायोमेट्रिक पछि मन्त्रालयले सूचीकृत गरेको स्वास्थ्य सेवा प्रदायकबाट स्वास्थ्य परीक्षण प्रतिवेदन",
          "तोकिएको मितिमा बायोमेट्रिक (फोटो, औँठा छाप, दस्तखत) का लागि स्वयं उपस्थित हुनुपर्ने",
          "मझौला (F) र ठूला (G) सवारीका लागि मात्र: वर्ग B लाइसेन्स लिएको कम्तीमा २ वर्ष पुगेको र सक्कल लाइसेन्स",
        ],
        sourceId: "kalankiNewApp",
        lastVerified: "2026-11-24",
      },
      fees: {
        state: "verified",
        items: [
          "Application & exam fee: NPR 500 (covers 1 written examination and up to 3 practical trial attempts)",
          "Retrial fee: NPR 500 per retrial attempt if you fail the first trial",
          "Note: Smart card printing/issuance revenue is separate (confirm current rate at the office counter or portal).",
        ],
        itemsNe: [
          "आवेदन तथा परीक्षा दस्तुर: रु. ५०० (१ पटक लिखित र ३ पटकसम्म ट्रायल परीक्षा दिन पाइने)",
          "रिट्रायल दस्तुर: पहिलो ट्रायल अनुत्तीर्ण भएमा प्रत्येक पटक रु. ५००",
          "नोट: स्मार्ट कार्ड छपाइ/वितरण राजस्व छुट्टै हुन सक्छ (कार्यालय वा पोर्टलमा यकिन गर्नुहोस्)।",
        ],
        sourceId: "kalankiNewApp",
        lastVerified: "2026-11-24",
      },
      steps: {
        state: "verified",
        items: [
          "Apply online at https://applydlnew.dotm.gov.np/login and select an appointment date.",
          "Visit the transport office on your appointment date with your printed form and original + photocopy of citizenship for biometrics (photo, thumbprint, signature).",
          "Complete the medical / health check at a ministry-listed provider and submit the report.",
          "Pay the NPR 500 application fee and appear for the written exam, followed by the practical trial exam.",
        ],
        itemsNe: [
          "https://applydlnew.dotm.gov.np/login मार्फत अनलाइन आवेदन दिई कार्यालय जाने मिति (Appointment Date) छान्नुहोस्।",
          "तोकिएको मितिमा अनलाइन फारमको प्रिन्ट र नागरिकताको सक्कल तथा प्रतिलिपि सहित बायोमेट्रिक (फोटो, औँठा छाप, दस्तखत) का लागि कार्यालयमा उपस्थित हुनुहोस्।",
          "मन्त्रालयले सूचीकृत गरेको स्वास्थ्य सेवा प्रदायकबाट स्वास्थ्य परीक्षण गराई प्रतिवेदन पेश गर्नुहोस्।",
          "रु. ५०० आवेदन दस्तुर बुझाई लिखित र प्रयोगात्मक (ट्रायल) परीक्षामा सहभागी हुनुहोस्।",
        ],
        sourceId: "kalankiNewApp",
        lastVerified: "2026-11-24",
      },
    },
  },
  {
    slug: "licence-renewal",
    sector: "transport",
    name: "Licence renewal",
    nameNe: "लाइसेन्स नवीकरण",
    summaryNe: "हालको सवारी चालक अनुमतिपत्र नवीकरण गर्ने बारेको जानकारी।",
    summary: "Information about renewing an existing driving licence.",
    keywords: ["नवीकरण", "रिन्यु", "renew", "renewal", "licence", "license", "expired", "expiry"],
    sourceIds: ["kalankiRenewal", "bhaktapurRenewal", "dotmHome", "citizenCharter", "edlvrsNotice"],
    details: {
      requirements: {
        state: "verified",
        items: [
          "Original driving licence (plus digital photo for online upload)",
          "Original Nepali citizenship certificate (plus digital photo for online upload)",
          "Recent passport-size photo (digital upload for online application)",
          "Printed payment voucher / reference card (when applying online)",
          "The licence holder must appear in person at the office for biometrics",
        ],
        itemsNe: [
          "सक्कल सवारी चालक अनुमतिपत्र (र अनलाइन अपलोडका लागि फोटो)",
          "सक्कल नेपाली नागरिकता प्रमाणपत्र (र अनलाइन अपलोडका लागि फोटो)",
          "पासपोर्ट साइजको फोटो (अनलाइन आवेदनमा अपलोड गर्न)",
          "भुक्तानी पछि प्राप्त हुने भौचर वा Reference Card को प्रिन्ट प्रति",
          "बायोमेट्रिकका लागि सम्बन्धित व्यक्ति स्वयं कार्यालयमा उपस्थित हुनुपर्ने",
        ],
        sourceId: "kalankiRenewal",
        lastVerified: "2026-11-24",
      },
      fees: {
        state: "verified",
        items: [
          "Base renewal fee in NPR varies by vehicle category and is calculated on the online portal — confirm before paying.",
          "Regular renewal window: within 90 days of expiry.",
          "Late penalty after 90 days: +100% (up to 1 year), +200% (up to 2 years), +300% (up to 3 years), +400% (up to 4 years), +500% (up to 5 years).",
          "Licences not renewed within 5 years of expiry are automatically cancelled.",
        ],
        itemsNe: [
          "आधारभूत नवीकरण शुल्क सवारीको वर्ग अनुसार फरक हुन्छ र अनलाइन पोर्टलमा देखाइन्छ — भुक्तानीअघि यकिन गर्नुहोस्।",
          "नियमित नवीकरण अवधि: म्याद समाप्त भएको ९० दिनभित्र।",
          "९० दिन नाघेपछिको थप जरिवाना: १ वर्षसम्म १००%, २ वर्षसम्म २००%, ३ वर्षसम्म ३००%, ४ वर्षसम्म ४००% र ५ वर्षसम्म ५००%।",
          "५ वर्षसम्म पनि नवीकरण नगराइएको चालक अनुमतिपत्र स्वतः रद्द हुनेछ।",
        ],
        sourceId: "bhaktapurRenewal",
        lastVerified: "2026-11-18",
      },
      steps: {
        state: "verified",
        items: [
          "Log in or sign up at https://applydlnew.dotm.gov.np/ (verify account via mobile OTP).",
          "Click 'License Renewal', enter your licence number and issuing office, and verify your fetched details.",
          "Choose your preferred Transport Management Office and appointment date.",
          "Upload digital photos of your citizenship, old licence, and passport-size photo.",
          "Pay the renewal fee (and any late fine) online via ConnectIPS, eSewa, Khalti, or at the designated bank, and print the voucher.",
          "Visit the office on your appointment date with your original licence, original citizenship, and printed voucher for biometrics.",
        ],
        itemsNe: [
          "https://applydlnew.dotm.gov.np/ मा लग-इन वा नयाँ खाता खोली मोबाइल OTP बाट प्रमाणित गर्नुहोस्।",
          "'License Renewal' मा क्लिक गरी आफ्नो लाइसेन्स नम्बर र जारी कार्यालय छानी विवरण रुजु गर्नुहोस्।",
          "पायक पर्ने यातायात व्यवस्था कार्यालय र उपयुक्त Appointment Date छनोट गर्नुहोस्।",
          "नागरिकता, पुरानो लाइसेन्स र पासपोर्ट साइजको फोटो डिजिटल फर्म्याटमा अपलोड गर्नुहोस्।",
          "ConnectIPS, eSewa, Khalti वा तोकिएको बैंकबाट राजस्व (जरिवाना भए सो समेत) भुक्तानी गरी भौचर प्रिन्ट गर्नुहोस्।",
          "तोकिएको मितिमा प्रिन्ट गरिएको भौचर, सक्कल लाइसेन्स र सक्कल नागरिकता सहित बायोमेट्रिकका लागि कार्यालयमा उपस्थित हुनुहोस्।",
        ],
        sourceId: "kalankiRenewal",
        lastVerified: "2026-11-24",
      },
    },
  },
  {
    slug: "written-examination",
    sector: "transport",
    name: "Written examination",
    nameNe: "लिखित परीक्षा",
    summaryNe: "सवारी चालक अनुमतिपत्रको लिखित (सैद्धान्तिक) परीक्षा बारेको जानकारी।",
    summary: "Information about the written (theory) driving examination.",
    keywords: ["लिखित", "परीक्षा", "written", "exam", "likhit", "theory", "test", "questions"],
    sourceIds: ["bhaktapurWrittenResult", "writtenExamQuestions", "bhaktapurNewLicense", "dotmHome"],
    details: {
      requirements: UNKNOWN,
      fees: UNKNOWN,
      steps: {
        state: "verified",
        items: [
          "Complete biometrics at the transport office first to receive your written exam date.",
          "Prepare using the official question collections published on DoTM (dotm.gov.np) and transport office portals.",
          "Check your written exam result on your user portal (applydlnew.dotm.gov.np/login) or the office website.",
          "If you pass, book your practical trial exam (Trial Test) date from your user portal.",
        ],
        itemsNe: [
          "कार्यालयमा बायोमेट्रिक पूरा गरेपछि लिखित परीक्षाको मिति प्राप्त हुन्छ।",
          "यातायात व्यवस्था विभाग (dotm.gov.np) र कार्यालय पोर्टलमा प्रकाशित आधिकारिक प्रश्नपत्र संग्रहबाट तयारी गर्नुहोस्।",
          "आफ्नो युजर पोर्टल (applydlnew.dotm.gov.np/login) वा कार्यालयको वेबसाइटमा लिखित परीक्षाको नतिजा हेर्नुहोस्।",
          "उत्तीर्ण भएमा सोही युजर पोर्टलबाट प्रयोगात्मक परीक्षा (Trial Test) को मिति लिनुहोस्।",
        ],
        sourceId: "bhaktapurWrittenResult",
        lastVerified: "2026-11-18",
      },
    },
  },
  {
    slug: "trial-examination",
    sector: "transport",
    name: "Trial examination",
    nameNe: "ट्रायल (प्रयोगात्मक) परीक्षा",
    summaryNe: "सवारी चालक अनुमतिपत्रको प्रयोगात्मक (ट्रायल) परीक्षा बारेको जानकारी।",
    summary: "Information about the practical driving (trial) examination.",
    keywords: ["ट्रायल", "प्रयोगात्मक", "परीक्षा", "trial", "practical", "driving test", "exam", "road test"],
    sourceIds: ["bhaktapurWrittenResult", "bhaktapurNewLicense", "dotmHome", "citizenCharter"],
    details: {
      requirements: UNKNOWN,
      fees: UNKNOWN,
      steps: {
        state: "verified",
        items: [
          "Pass the written examination first.",
          "Confirm your pass status in your user portal (applydlnew.dotm.gov.np/login) and select your Trial Test date there.",
          "Check your transport office's latest notices before travelling, as trial exams can be postponed or rescheduled.",
        ],
        itemsNe: [
          "पहिले लिखित परीक्षा उत्तीर्ण हुनुपर्छ।",
          "आफ्नो युजर पोर्टल (applydlnew.dotm.gov.np/login) मा नतिजा यकिन गरी प्रयोगात्मक परीक्षा (Trial Test) को मिति लिनुहोस्।",
          "ट्रायल परीक्षा स्थगित वा समय परिवर्तन हुन सक्ने भएकाले जानुअघि सम्बन्धित कार्यालयको पछिल्लो सूचना हेर्नुहोस्।",
        ],
        sourceId: "bhaktapurWrittenResult",
        lastVerified: "2026-11-18",
      },
    },
  },
  {
    slug: "bluebook-renewal",
    sector: "transport",
    name: "Two-wheeler bluebook renewal & tax",
    nameNe: "मोटरसाइकल ब्लूबुक नवीकरण तथा कर",
    summary: "Information about two-wheeler vehicle registration, bluebook renewal, and tax in Kathmandu Valley.",
    summaryNe: "काठमाडौं उपत्यकामा दुई पाङ्ग्रे सवारी दर्ता, ब्लूबुक नवीकरण र सवारी कर बारेको जानकारी।",
    keywords: ["bluebook", "vehicle", "motorcycle", "scooter", "tax", "registration", "ब्लूबुक", "कर", "मोटरसाइकल"],
    sourceIds: ["gurjudharaBluebook", "gurjudharaIntro"],
    details: { requirements: UNKNOWN, fees: UNKNOWN, steps: UNKNOWN },
  },
  {
    slug: "epassport-application",
    sector: "passport",
    name: "e-Passport (New & Renewal)",
    nameNe: "ई-पासपोर्ट (नयाँ तथा नवीकरण)",
    summary: "Apply for or renew a Nepali e-Passport (regular at DAO or fast-track at Department of Passports, Tripureshwor).",
    summaryNe: "नेपाली ई-पासपोर्ट (नियमित जिल्ला प्रशासन कार्यालय वा द्रुत सेवा राहदानी विभाग, त्रिपुरेश्वर) सम्बन्धी जानकारी।",
    keywords: ["passport", "epassport", "rahani", "tripureshwor", "राहदानी", "पासपोर्ट", "त्रिपुरेश्वर"],
    sourceIds: ["passportDocs", "passportFees", "passportPortal"],
    details: {
      requirements: {
        state: "verified",
        items: [
          "Copy of the online pre-enrollment application form with barcode and QR code (printed preferred, or digital)",
          "Original Nepali Citizenship Certificate (plus Minor Identity Card & parents' citizenship for minors under 16)",
          "National Identity Card (NID) or National Identity Number (NIN) for applicants aged 16+ in Nepal",
          "Original current or expired passport (if renewing)",
        ],
        itemsNe: [
          "बारकोड र QR कोड सहितको अनलाइन आवेदन फारमको प्रति (प्रिन्ट गरिएको वा डिजिटल)",
          "सक्कल नेपाली नागरिकता प्रमाणपत्र (१६ वर्षमुनिका लागि नाबालक परिचयपत्र र अभिभावकको नागरिकता)",
          "नेपालभित्र १६ वर्ष माथिका आवेदकका लागि राष्ट्रिय परिचयपत्र (NID) वा नम्बर",
          "नवीकरणका लागि हालको वा म्याद सकिएको सक्कल राहदानी",
        ],
        sourceId: "passportDocs",
        lastVerified: "2026-11-24",
      },
      fees: {
        state: "verified",
        items: [
          "Department of Passports (Tripureshwor — Emergency / ~2 working days): 34-page NPR 12,000 | 66-page NPR 20,000",
          "Regular service at DAO / AAO (10–30 days): additional emergency fee (+NPR 7,000 for 34-page / +NPR 12,000 for 66-page) does not apply",
          "Minors under 10 (Department of Passports): 34-page NPR 9,500 | 66-page NPR 14,500",
          "Lost, stolen, or damaged passport: 34-page NPR 17,000 | 66-page NPR 25,000 (minors under 10: NPR 14,500 / NPR 19,500)",
          "Official error correction: Free of cost",
        ],
        itemsNe: [
          "राहदानी विभाग, त्रिपुरेश्वर (द्रुत सेवा / करिब २ कार्यदिन): ३४ पृष्ठ रु. १२,००० | ६६ पृष्ठ रु. २०,०००",
          "जिल्ला/इलाका प्रशासन कार्यालय (नियमित सेवा, १०–३० दिन): द्रुत सेवाको अतिरिक्त शुल्क (+रु. ७,००० / +रु. १२,०००) लाग्दैन",
          "१० वर्षमुनिका नाबालक (राहदानी विभाग): ३४ पृष्ठ रु. ९,५०० | ६६ पृष्ठ रु. १४,५००",
          "हराएको, च्यातिएको वा बिग्रिएको राहदानी: ३४ पृष्ठ रु. १७,००० | ६६ पृष्ठ रु. २५,०००",
          "सरकारी त्रुटि सच्याउन: निःशुल्क",
        ],
        sourceId: "passportFees",
        lastVerified: "2026-11-24",
      },
      steps: {
        state: "verified",
        items: [
          "Fill out the online pre-enrollment form via nepalpassport.gov.np to get your barcode/QR form and appointment.",
          "Choose regular service (your issuing DAO/AAO, ~10–30 days) or emergency service (Department of Passports, Tripureshwor, ~2 working days).",
          "Pay the revenue fee and visit the office in person with original documents for biometric capture.",
        ],
        itemsNe: [
          "nepalpassport.gov.np मार्फत अनलाइन आवेदन फारम भरी बारकोड/QR कोड र अपोइन्टमेन्ट मिति लिनुहोस्।",
          "नियमित सेवा (नागरिकता जारी भएको जिल्ला/इलाका प्रशासन कार्यालय, १०–३० दिन) वा द्रुत सेवा (राहदानी विभाग, त्रिपुरेश्वर, करिब २ कार्यदिन) छान्नुहोस्।",
          "राजस्व बुझाई सक्कल कागजात सहित तोकिएको मितिमा बायोमेट्रिकका लागि कार्यालयमा उपस्थित हुनुहोस्।",
        ],
        sourceId: "passportDocs",
        lastVerified: "2026-11-24",
      },
    },
  },
  {
    slug: "national-id",
    sector: "identity",
    name: "National Identity Card (NID)",
    nameNe: "राष्ट्रिय परिचयपत्र (NID)",
    summary: "Online pre-enrollment, biometric registration, and status check for Nepal's National Identity Card.",
    summaryNe: "राष्ट्रिय परिचयपत्रको अनलाइन प्रि-एनरोलमेन्ट, बायोमेट्रिक दर्ता र स्थिति जाँच बारेको जानकारी।",
    keywords: ["nid", "national id", "parichayapatra", "donidcr", "राष्ट्रिय परिचयपत्र", "परिचयपत्र"],
    sourceIds: ["nidCitizenPortal", "donidcrPortal"],
    details: {
      requirements: UNKNOWN,
      fees: UNKNOWN,
      steps: {
        state: "verified",
        items: [
          "Submit online pre-enrollment or check status at https://citizenportal.donidcr.gov.np/en.",
          "Visit your District Administration Office (DAO) or designated enrollment station (such as Narayanhiti) in person for biometrics.",
        ],
        itemsNe: [
          "https://citizenportal.donidcr.gov.np/en मा अनलाइन प्रि-एनरोलमेन्ट फारम भर्नुहोस् वा स्थिति जाँच गर्नुहोस्।",
          "बायोमेट्रिक दर्ताका लागि सम्बन्धित जिल्ला प्रशासन कार्यालय वा तोकिएको दर्ता केन्द्र (जस्तै नारायणहिटी) मा स्वयं उपस्थित हुनुहोस्।",
        ],
        sourceId: "nidCitizenPortal",
        lastVerified: "2026-11-24",
      },
    },
  },
  {
    slug: "citizenship-certificate",
    sector: "identity",
    name: "Citizenship certificate",
    nameNe: "नेपाली नागरिकता प्रमाणपत्र",
    summary: "Official document notices and District Administration Office contact information for Nepali citizenship.",
    summaryNe: "नेपाली नागरिकता प्रमाणपत्र सम्बन्धी आधिकारिक सूचना र जिल्ला प्रशासन कार्यालयको सम्पर्क विवरण।",
    keywords: ["citizenship", "nagarikta", "dao", "babarmahal", "नागरिकता", "जिल्ला प्रशासन"],
    sourceIds: ["daoKathmandu"],
    details: { requirements: UNKNOWN, fees: UNKNOWN, steps: UNKNOWN },
  },
  {
    slug: "personal-pan",
    sector: "tax",
    name: "Personal PAN registration",
    nameNe: "व्यक्तिगत स्थायी लेखा नम्बर (PAN)",
    summary: "Information about Personal PAN registration and online generation using your National ID number via IRD.",
    summaryNe: "आन्तरिक राजस्व विभाग (IRD) मार्फत व्यक्तिगत स्थायी लेखा नम्बर (PAN) दर्ता र अनलाइन सिर्जना सम्बन्धी जानकारी।",
    keywords: ["pan", "tax", "ird", "lazimpat", "प्यान", "स्थायी लेखा", "कर"],
    sourceIds: ["irdPortal"],
    details: {
      requirements: UNKNOWN,
      fees: UNKNOWN,
      steps: {
        state: "verified",
        items: [
          "Visit the Inland Revenue Department official portal (https://ird.gov.np/) to access the Taxpayer Portal.",
          "Individuals with a National ID (NID) number can generate a Personal PAN automatically online through IRD's system.",
        ],
        itemsNe: [
          "आन्तरिक राजस्व विभागको आधिकारिक वेबसाइट (https://ird.gov.np/) मार्फत Taxpayer Portal खोल्नुहोस्।",
          "राष्ट्रिय परिचयपत्र (NID) नम्बर भएका व्यक्तिले IRD को प्रणालीबाट अनलाइनमार्फत स्वचालित रूपमा व्यक्तिगत PAN सिर्जना गर्न सक्नुहुन्छ।",
        ],
        sourceId: "irdPortal",
        lastVerified: "2026-11-24",
      },
    },
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

