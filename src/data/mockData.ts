/**
 * DEMO DATA ONLY — synthetic records created for the SIH 26018 prototype.
 * No real landowner information is used. Confidence values are illustrative
 * prototype numbers, not measured model accuracy.
 */

export type RecordStatus = "verified" | "needs_review" | "issue" | "processing";
export type Priority = "high" | "medium" | "low";

export interface AuditEntry {
  label: string;
  actor: string;
  timestamp: string;
  detail?: string | undefined;
}

export interface LandRecord {
  id: string;
  ownerName: string;
  ownerNameHi: string;
  fatherName: string;
  surveyNumber: string;
  khasraNumber: string;
  khataNumber: string;
  plotArea: string;
  areaUnit: string;
  village: string;
  villageHi: string;
  tehsil: string;
  district: string;
  state: string;
  landClassification: string;
  ownershipType: string;
  mutationNumber: string;
  mutationDate: string;
  registrationNumber: string;
  registrationDate: string;
  documentType: string;
  language: string;
  uploadedAt: string;
  priority: Priority;
  status: RecordStatus;
  confidence: Record<string, number>;
  lat: number;
  lng: number;
  audit: AuditEntry[];
}

export const FIELD_LABELS: { key: keyof LandRecord | string; label: string; group: string }[] = [
  { key: "ownerName", label: "Owner Name", group: "Landowner Details" },
  { key: "fatherName", label: "Father's / Guardian Name", group: "Landowner Details" },
  { key: "ownershipType", label: "Ownership Type", group: "Ownership Details" },
  { key: "surveyNumber", label: "Survey Number", group: "Land Identification" },
  { key: "khasraNumber", label: "Khasra Number", group: "Land Identification" },
  { key: "khataNumber", label: "Khata Number", group: "Land Identification" },
  { key: "plotArea", label: "Plot Area (hectare)", group: "Land Identification" },
  { key: "landClassification", label: "Land Classification", group: "Land Identification" },
  { key: "village", label: "Village", group: "Location" },
  { key: "tehsil", label: "Tehsil", group: "Location" },
  { key: "district", label: "District", group: "Location" },
  { key: "state", label: "State", group: "Location" },
  { key: "mutationNumber", label: "Mutation Number", group: "Mutation Information" },
  { key: "mutationDate", label: "Mutation Date", group: "Mutation Information" },
  { key: "registrationNumber", label: "Registration Number", group: "Registration Information" },
  { key: "registrationDate", label: "Registration Date", group: "Registration Information" },
];

const baseAudit = (uploadedAt: string): AuditEntry[] => [
  { label: "Document uploaded", actor: "Data Entry Operator", timestamp: uploadedAt },
  { label: "OCR processed", actor: "Digitization pipeline (demo)", timestamp: uploadedAt },
  { label: "Fields extracted", actor: "Digitization pipeline (demo)", timestamp: uploadedAt },
];

interface Seed {
  id: string;
  ownerName: string;
  ownerNameHi: string;
  fatherName: string;
  khasra: string;
  khata: string;
  survey: string;
  area: string;
  village: string;
  villageHi: string;
  tehsil: string;
  district: string;
  state: string;
  cls: string;
  status: RecordStatus;
  priority: Priority;
  docType: string;
  language: string;
  date: string;
  lat: number;
  lng: number;
  conf: Partial<Record<string, number>>;
}

const seeds: Seed[] = [
  {
    id: "LR-1042",
    ownerName: "Ram Kumar",
    ownerNameHi: "राम कुमार",
    fatherName: "Shyam Lal",
    khasra: "123/4",
    khata: "456",
    survey: "SN-123",
    area: "2.45",
    village: "Rampur",
    villageHi: "रामपुर",
    tehsil: "Najafgarh",
    district: "South West Delhi",
    state: "Delhi",
    cls: "Agricultural",
    status: "needs_review",
    priority: "high",
    docType: "Land Record / RoR",
    language: "Hindi",
    date: "2026-08-28",
    lat: 28.6092,
    lng: 76.9797,
    conf: {
      ownerName: 96,
      surveyNumber: 92,
      khasraNumber: 91,
      khataNumber: 95,
      plotArea: 63,
      village: 94,
      tehsil: 93,
      district: 97,
    },
  },
  {
    id: "LR-1041",
    ownerName: "Sunita Devi",
    ownerNameHi: "सुनीता देवी",
    fatherName: "Mahesh Prasad",
    khasra: "87/2",
    khata: "212",
    survey: "SN-087",
    area: "1.10",
    village: "Bhojpur",
    villageHi: "भोजपुर",
    tehsil: "Sadar",
    district: "Kanpur Nagar",
    state: "Uttar Pradesh",
    cls: "Agricultural",
    status: "verified",
    priority: "low",
    docType: "Land Record / RoR",
    language: "Hindi",
    date: "2026-08-28",
    lat: 26.4499,
    lng: 80.3319,
    conf: {
      ownerName: 97,
      surveyNumber: 95,
      khasraNumber: 96,
      khataNumber: 93,
      plotArea: 92,
      village: 96,
      tehsil: 95,
      district: 98,
    },
  },
  {
    id: "LR-1040",
    ownerName: "Abdul Rahman",
    ownerNameHi: "अब्दुल रहमान",
    fatherName: "Yusuf Khan",
    khasra: "45/1",
    khata: "108",
    survey: "SN-045",
    area: "0.85",
    village: "Chandpur",
    villageHi: "चांदपुर",
    tehsil: "Bhopal",
    district: "Bhopal",
    state: "Madhya Pradesh",
    cls: "Residential",
    status: "needs_review",
    priority: "medium",
    docType: "Mutation Record",
    language: "Hindi",
    date: "2026-08-27",
    lat: 23.2599,
    lng: 77.4126,
    conf: {
      ownerName: 84,
      surveyNumber: 88,
      khasraNumber: 79,
      khataNumber: 90,
      plotArea: 86,
      village: 91,
      tehsil: 92,
      district: 95,
    },
  },
  {
    id: "LR-1039",
    ownerName: "Lakshmi Narayanan",
    ownerNameHi: "लक्ष्मी नारायणन",
    fatherName: "Subramanian",
    khasra: "301/7",
    khata: "774",
    survey: "SN-301",
    area: "3.20",
    village: "Tiruvallur",
    villageHi: "तिरुवल्लूर",
    tehsil: "Poonamallee",
    district: "Tiruvallur",
    state: "Tamil Nadu",
    cls: "Agricultural",
    status: "verified",
    priority: "low",
    docType: "Registration Record",
    language: "Other Indian Language",
    date: "2026-08-27",
    lat: 13.1439,
    lng: 79.9094,
    conf: {
      ownerName: 93,
      surveyNumber: 94,
      khasraNumber: 90,
      khataNumber: 91,
      plotArea: 89,
      village: 92,
      tehsil: 90,
      district: 96,
    },
  },
  {
    id: "LR-1038",
    ownerName: "Harpreet Singh",
    ownerNameHi: "हरप्रीत सिंह",
    fatherName: "Gurdeep Singh",
    khasra: "56/3",
    khata: "331",
    survey: "SN-056",
    area: "4.05",
    village: "Bhikhi",
    villageHi: "भीखी",
    tehsil: "Budhlada",
    district: "Mansa",
    state: "Punjab",
    cls: "Agricultural",
    status: "needs_review",
    priority: "high",
    docType: "Land Record / RoR",
    language: "Other Indian Language",
    date: "2026-08-26",
    lat: 29.9931,
    lng: 75.5333,
    conf: {
      ownerName: 88,
      surveyNumber: 85,
      khasraNumber: 71,
      khataNumber: 87,
      plotArea: 83,
      village: 89,
      tehsil: 88,
      district: 94,
    },
  },
  {
    id: "LR-1037",
    ownerName: "Meena Patel",
    ownerNameHi: "मीना पटेल",
    fatherName: "Kiran Patel",
    khasra: "212/9",
    khata: "902",
    survey: "SN-212",
    area: "1.75",
    village: "Vadod",
    villageHi: "वडोद",
    tehsil: "Anand",
    district: "Anand",
    state: "Gujarat",
    cls: "Commercial",
    status: "issue",
    priority: "high",
    docType: "Legacy PDF",
    language: "Other Indian Language",
    date: "2026-08-26",
    lat: 22.5645,
    lng: 72.9289,
    conf: {
      ownerName: 58,
      surveyNumber: 64,
      khasraNumber: 61,
      khataNumber: 72,
      plotArea: 55,
      village: 77,
      tehsil: 80,
      district: 88,
    },
  },
  {
    id: "LR-1036",
    ownerName: "Ganesh Pawar",
    ownerNameHi: "गणेश पवार",
    fatherName: "Dattatray Pawar",
    khasra: "78/5",
    khata: "144",
    survey: "SN-078",
    area: "2.10",
    village: "Shirur",
    villageHi: "शिरूर",
    tehsil: "Shirur",
    district: "Pune",
    state: "Maharashtra",
    cls: "Agricultural",
    status: "verified",
    priority: "low",
    docType: "Land Record / RoR",
    language: "Other Indian Language",
    date: "2026-08-25",
    lat: 18.8237,
    lng: 74.3732,
    conf: {
      ownerName: 95,
      surveyNumber: 93,
      khasraNumber: 94,
      khataNumber: 92,
      plotArea: 91,
      village: 95,
      tehsil: 94,
      district: 97,
    },
  },
  {
    id: "LR-1035",
    ownerName: "Anita Mahato",
    ownerNameHi: "अनीता महतो",
    fatherName: "Birsa Mahato",
    khasra: "19/2",
    khata: "77",
    survey: "SN-019",
    area: "0.60",
    village: "Barhi",
    villageHi: "बरही",
    tehsil: "Barhi",
    district: "Hazaribagh",
    state: "Jharkhand",
    cls: "Agricultural",
    status: "processing",
    priority: "medium",
    docType: "Land Record / RoR",
    language: "Hindi",
    date: "2026-09-01",
    lat: 24.2926,
    lng: 85.4139,
    conf: {
      ownerName: 82,
      surveyNumber: 80,
      khasraNumber: 81,
      khataNumber: 79,
      plotArea: 76,
      village: 85,
      tehsil: 84,
      district: 90,
    },
  },
  {
    id: "LR-1034",
    ownerName: "Vikram Rathore",
    ownerNameHi: "विक्रम राठौड़",
    fatherName: "Devendra Rathore",
    khasra: "144/8",
    khata: "560",
    survey: "SN-144",
    area: "5.30",
    village: "Bagru",
    villageHi: "बगरू",
    tehsil: "Sanganer",
    district: "Jaipur",
    state: "Rajasthan",
    cls: "Agricultural",
    status: "needs_review",
    priority: "medium",
    docType: "Mutation Record",
    language: "Hindi",
    date: "2026-08-24",
    lat: 26.8146,
    lng: 75.5453,
    conf: {
      ownerName: 78,
      surveyNumber: 86,
      khasraNumber: 88,
      khataNumber: 85,
      plotArea: 74,
      village: 90,
      tehsil: 89,
      district: 93,
    },
  },
  {
    id: "LR-1033",
    ownerName: "Sabita Nayak",
    ownerNameHi: "सबिता नायक",
    fatherName: "Prafulla Nayak",
    khasra: "63/1",
    khata: "298",
    survey: "SN-063",
    area: "1.35",
    village: "Balianta",
    villageHi: "बालिआंता",
    tehsil: "Balianta",
    district: "Khordha",
    state: "Odisha",
    cls: "Agricultural",
    status: "verified",
    priority: "low",
    docType: "Land Record / RoR",
    language: "Other Indian Language",
    date: "2026-08-24",
    lat: 20.2376,
    lng: 85.8894,
    conf: {
      ownerName: 92,
      surveyNumber: 91,
      khasraNumber: 93,
      khataNumber: 90,
      plotArea: 88,
      village: 93,
      tehsil: 92,
      district: 95,
    },
  },
  {
    id: "LR-1032",
    ownerName: "Mohan Yadav",
    ownerNameHi: "मोहन यादव",
    fatherName: "Ramesh Yadav",
    khasra: "98/6",
    khata: "410",
    survey: "SN-098",
    area: "2.80",
    village: "Sohna",
    villageHi: "सोहना",
    tehsil: "Sohna",
    district: "Gurugram",
    state: "Haryana",
    cls: "Agricultural",
    status: "needs_review",
    priority: "high",
    docType: "Legacy PDF",
    language: "Hindi",
    date: "2026-08-23",
    lat: 28.2476,
    lng: 77.0654,
    conf: {
      ownerName: 87,
      surveyNumber: 69,
      khasraNumber: 84,
      khataNumber: 88,
      plotArea: 79,
      village: 88,
      tehsil: 87,
      district: 92,
    },
  },
  {
    id: "LR-1031",
    ownerName: "Kavita Sharma",
    ownerNameHi: "कविता शर्मा",
    fatherName: "Naresh Sharma",
    khasra: "27/3",
    khata: "185",
    survey: "SN-027",
    area: "0.95",
    village: "Solan",
    villageHi: "सोलन",
    tehsil: "Solan",
    district: "Solan",
    state: "Himachal Pradesh",
    cls: "Residential",
    status: "verified",
    priority: "low",
    docType: "Registration Record",
    language: "Hindi",
    date: "2026-08-22",
    lat: 30.9045,
    lng: 77.0967,
    conf: {
      ownerName: 94,
      surveyNumber: 92,
      khasraNumber: 95,
      khataNumber: 91,
      plotArea: 90,
      village: 94,
      tehsil: 93,
      district: 96,
    },
  },
  {
    id: "LR-1030",
    ownerName: "Imran Ali",
    ownerNameHi: "इमरान अली",
    fatherName: "Nasir Ali",
    khasra: "305/2",
    khata: "620",
    survey: "SN-305",
    area: "1.55",
    village: "Phulwari",
    villageHi: "फुलवारी",
    tehsil: "Phulwari Sharif",
    district: "Patna",
    state: "Bihar",
    cls: "Residential",
    status: "issue",
    priority: "high",
    docType: "Land Map",
    language: "Hindi",
    date: "2026-08-22",
    lat: 25.5772,
    lng: 85.0578,
    conf: {
      ownerName: 66,
      surveyNumber: 59,
      khasraNumber: 68,
      khataNumber: 71,
      plotArea: 57,
      village: 80,
      tehsil: 82,
      district: 89,
    },
  },
  {
    id: "LR-1029",
    ownerName: "Deepak Bhandari",
    ownerNameHi: "दीपक भंडारी",
    fatherName: "Kailash Bhandari",
    khasra: "11/9",
    khata: "090",
    survey: "SN-011",
    area: "0.75",
    village: "Kotdwar",
    villageHi: "कोटद्वार",
    tehsil: "Kotdwar",
    district: "Pauri Garhwal",
    state: "Uttarakhand",
    cls: "Forest Adjacent",
    status: "needs_review",
    priority: "medium",
    docType: "Land Record / RoR",
    language: "Hindi",
    date: "2026-08-21",
    lat: 29.7451,
    lng: 78.522,
    conf: {
      ownerName: 78,
      surveyNumber: 85,
      khasraNumber: 87,
      khataNumber: 86,
      plotArea: 84,
      village: 89,
      tehsil: 88,
      district: 92,
    },
  },
  {
    id: "LR-1028",
    ownerName: "Renuka Gowda",
    ownerNameHi: "रेणुका गौड़ा",
    fatherName: "Shivanna Gowda",
    khasra: "202/4",
    khata: "512",
    survey: "SN-202",
    area: "3.60",
    village: "Nelamangala",
    villageHi: "नेलमंगला",
    tehsil: "Nelamangala",
    district: "Bengaluru Rural",
    state: "Karnataka",
    cls: "Agricultural",
    status: "verified",
    priority: "low",
    docType: "Land Record / RoR",
    language: "Other Indian Language",
    date: "2026-08-20",
    lat: 13.0996,
    lng: 77.3936,
    conf: {
      ownerName: 96,
      surveyNumber: 94,
      khasraNumber: 93,
      khataNumber: 94,
      plotArea: 92,
      village: 95,
      tehsil: 94,
      district: 97,
    },
  },
  {
    id: "LR-1027",
    ownerName: "Prakash Sahu",
    ownerNameHi: "प्रकाश साहू",
    fatherName: "Bhagwat Sahu",
    khasra: "74/8",
    khata: "336",
    survey: "SN-074",
    area: "2.20",
    village: "Dhamtari",
    villageHi: "धमतरी",
    tehsil: "Dhamtari",
    district: "Dhamtari",
    state: "Chhattisgarh",
    cls: "Agricultural",
    status: "processing",
    priority: "medium",
    docType: "Legacy PDF",
    language: "Hindi",
    date: "2026-09-01",
    lat: 20.7073,
    lng: 81.5495,
    conf: {
      ownerName: 83,
      surveyNumber: 82,
      khasraNumber: 80,
      khataNumber: 81,
      plotArea: 78,
      village: 86,
      tehsil: 85,
      district: 91,
    },
  },
  {
    id: "LR-1026",
    ownerName: "Jyoti Das",
    ownerNameHi: "ज्योति दास",
    fatherName: "Ranjan Das",
    khasra: "38/5",
    khata: "247",
    survey: "SN-038",
    area: "1.05",
    village: "Barasat",
    villageHi: "बारासात",
    tehsil: "Barasat",
    district: "North 24 Parganas",
    state: "West Bengal",
    cls: "Residential",
    status: "verified",
    priority: "low",
    docType: "Registration Record",
    language: "Other Indian Language",
    date: "2026-08-19",
    lat: 22.7248,
    lng: 88.4805,
    conf: {
      ownerName: 91,
      surveyNumber: 90,
      khasraNumber: 92,
      khataNumber: 89,
      plotArea: 87,
      village: 92,
      tehsil: 91,
      district: 95,
    },
  },
  {
    id: "LR-1025",
    ownerName: "Suresh Meena",
    ownerNameHi: "सुरेश मीणा",
    fatherName: "Chetram Meena",
    khasra: "159/1",
    khata: "701",
    survey: "SN-159",
    area: "6.15",
    village: "Dausa",
    villageHi: "दौसा",
    tehsil: "Dausa",
    district: "Dausa",
    state: "Rajasthan",
    cls: "Agricultural",
    status: "needs_review",
    priority: "medium",
    docType: "Land Map",
    language: "Hindi",
    date: "2026-08-18",
    lat: 26.8896,
    lng: 76.3369,
    conf: {
      ownerName: 85,
      surveyNumber: 88,
      khasraNumber: 86,
      khataNumber: 84,
      plotArea: 72,
      village: 88,
      tehsil: 87,
      district: 93,
    },
  },
  {
    id: "LR-1024",
    ownerName: "Rekha Tiwari",
    ownerNameHi: "रेखा तिवारी",
    fatherName: "Om Prakash Tiwari",
    khasra: "92/7",
    khata: "428",
    survey: "SN-092",
    area: "1.90",
    village: "Sarnath",
    villageHi: "सारनाथ",
    tehsil: "Pindra",
    district: "Varanasi",
    state: "Uttar Pradesh",
    cls: "Agricultural",
    status: "verified",
    priority: "low",
    docType: "Land Record / RoR",
    language: "Hindi",
    date: "2026-08-18",
    lat: 25.3811,
    lng: 83.0217,
    conf: {
      ownerName: 95,
      surveyNumber: 93,
      khasraNumber: 94,
      khataNumber: 92,
      plotArea: 90,
      village: 94,
      tehsil: 93,
      district: 96,
    },
  },
  {
    id: "LR-1023",
    ownerName: "Nitin Joshi",
    ownerNameHi: "नितिन जोशी",
    fatherName: "Anil Joshi",
    khasra: "66/2",
    khata: "233",
    survey: "SN-066",
    area: "0.50",
    village: "Wagholi",
    villageHi: "वाघोली",
    tehsil: "Haveli",
    district: "Pune",
    state: "Maharashtra",
    cls: "Commercial",
    status: "issue",
    priority: "high",
    docType: "Legacy PDF",
    language: "English",
    date: "2026-08-17",
    lat: 18.5793,
    lng: 73.9819,
    conf: {
      ownerName: 62,
      surveyNumber: 58,
      khasraNumber: 65,
      khataNumber: 70,
      plotArea: 54,
      village: 79,
      tehsil: 81,
      district: 87,
    },
  },
];

function buildRecord(s: Seed): LandRecord {
  const conf: Record<string, number> = {
    ownerName: 90,
    fatherName: 88,
    ownershipType: 90,
    surveyNumber: 90,
    khasraNumber: 90,
    khataNumber: 90,
    plotArea: 85,
    landClassification: 89,
    village: 92,
    tehsil: 92,
    district: 95,
    state: 98,
    mutationNumber: 86,
    mutationDate: 84,
    registrationNumber: 87,
    registrationDate: 85,
    ...s.conf,
  };
  const audit = baseAudit(`${s.date}T09:12:00`);
  if (s.status === "verified") {
    audit.push(
      { label: "Human verification started", actor: "Verifier", timestamp: `${s.date}T11:04:00` },
      {
        label: "Field corrected",
        actor: "Verifier",
        timestamp: `${s.date}T11:11:00`,
        detail: "Plot Area updated after manual check",
      },
      { label: "Record approved", actor: "District Officer", timestamp: `${s.date}T11:20:00` },
    );
  } else if (s.status === "needs_review") {
    audit.push({
      label: "Queued for human verification",
      actor: "Validation engine (demo)",
      timestamp: `${s.date}T09:20:00`,
    });
  } else if (s.status === "issue") {
    audit.push({
      label: "Validation failed",
      actor: "Validation engine (demo)",
      timestamp: `${s.date}T09:22:00`,
      detail: "Multiple fields below confidence threshold",
    });
  }
  return {
    id: s.id,
    ownerName: s.ownerName,
    ownerNameHi: s.ownerNameHi,
    fatherName: s.fatherName,
    surveyNumber: s.survey,
    khasraNumber: s.khasra,
    khataNumber: s.khata,
    plotArea: s.area,
    areaUnit: "hectare",
    village: s.village,
    villageHi: s.villageHi,
    tehsil: s.tehsil,
    district: s.district,
    state: s.state,
    landClassification: s.cls,
    ownershipType: "Individual (Bhumidhar)",
    mutationNumber: `MUT-${s.id.slice(3)}`,
    mutationDate: "2019-06-14",
    registrationNumber: `REG-${s.id.slice(3)}-A`,
    registrationDate: "2011-03-02",
    documentType: s.docType,
    language: s.language,
    uploadedAt: s.date,
    priority: s.priority,
    status: s.status,
    confidence: conf,
    lat: s.lat,
    lng: s.lng,
    audit,
  };
}

export const mockRecords: LandRecord[] = seeds.map(buildRecord);

export const overallConfidence = (r: LandRecord) => {
  const vals = Object.values(r.confidence);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
};

export const lowConfidenceFields = (r: LandRecord, threshold = 80) =>
  FIELD_LABELS.filter((f) => (r.confidence[f.key as string] ?? 100) < threshold).map(
    (f) => f.label,
  );

/* ---------- Aggregate demo metrics (illustrative prototype values) ---------- */

export const digitizationActivity = [
  { month: "Mar", processed: 640, verified: 480 },
  { month: "Apr", processed: 820, verified: 610 },
  { month: "May", processed: 910, verified: 700 },
  { month: "Jun", processed: 1180, verified: 940 },
  { month: "Jul", processed: 1340, verified: 1090 },
  { month: "Aug", processed: 1520, verified: 1260 },
];

export const validationOverview = [
  { name: "Verified", value: 9870, key: "verified" },
  { name: "Needs Review", value: 1540, key: "needs_review" },
  { name: "Issues", value: 760, key: "issue" },
  { name: "Processing", value: 370, key: "processing" },
];

export const recordsByState = [
  { name: "Uttar Pradesh", value: 2840 },
  { name: "Maharashtra", value: 2110 },
  { name: "Rajasthan", value: 1670 },
  { name: "Madhya Pradesh", value: 1490 },
  { name: "Bihar", value: 1280 },
  { name: "Karnataka", value: 1050 },
  { name: "Delhi", value: 720 },
];

export const recordsByDistrict = [
  { name: "Kanpur Nagar", value: 640 },
  { name: "Pune", value: 590 },
  { name: "Jaipur", value: 520 },
  { name: "Bhopal", value: 470 },
  { name: "Patna", value: 430 },
  { name: "Varanasi", value: 380 },
];

export const ocrConfidenceDemo = [
  { name: "Printed Documents", value: 94 },
  { name: "Handwritten Documents", value: 78 },
  { name: "Poor Quality Scans", value: 61 },
];

export const confidenceDistribution = [
  { range: "90-100%", value: 5820 },
  { range: "80-89%", value: 3410 },
  { range: "70-79%", value: 1740 },
  { range: "60-69%", value: 980 },
  { range: "<60%", value: 590 },
];

export const documentTypeDistribution = [
  { name: "Land Record / RoR", value: 6100 },
  { name: "Mutation Record", value: 2400 },
  { name: "Registration Record", value: 1900 },
  { name: "Land Map", value: 1200 },
  { name: "Legacy PDF", value: 940 },
];

export const languageDistribution = [
  { name: "Hindi", value: 7200 },
  { name: "English", value: 2100 },
  { name: "Marathi", value: 1300 },
  { name: "Tamil", value: 900 },
  { name: "Bengali", value: 1040 },
];

export const dashboardStats = {
  totalRecords: 12540,
  verifiedRecords: 9870,
  pendingVerification: 1540,
  potentialIssues: 760,
  processedToday: 218,
  processingQueue: 37,
  averageConfidence: 88,
  documentsUploaded: 341,
};

export interface AppNotification {
  id: string;
  title: string;
  detail: string;
  severity: "info" | "warning" | "error" | "success";
  time: string;
  read: boolean;
}

export const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "12 records require verification",
    detail: "Verification queue updated for South West Delhi.",
    severity: "warning",
    time: "5 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "LR-1042 has a low-confidence Area field",
    detail: "Extracted plot area at 63% confidence.",
    severity: "warning",
    time: "22 min ago",
    read: false,
  },
  {
    id: "n3",
    title: "5 records failed validation",
    detail: "Khasra format mismatch detected in batch B-114.",
    severity: "error",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "n4",
    title: "New document processing completed",
    detail: "Batch of 40 legacy PDFs digitized.",
    severity: "success",
    time: "3 hours ago",
    read: true,
  },
];

export const STATES = Array.from(new Set(mockRecords.map((r) => r.state))).sort();
export const DISTRICTS = Array.from(new Set(mockRecords.map((r) => r.district))).sort();
export const TEHSILS = Array.from(new Set(mockRecords.map((r) => r.tehsil))).sort();
export const VILLAGES = Array.from(new Set(mockRecords.map((r) => r.village))).sort();
export const DOC_TYPES = Array.from(new Set(mockRecords.map((r) => r.documentType))).sort();
