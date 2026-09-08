/**
 * API-ready service layer.
 *
 * Every function below is a placeholder backed by local demo data. No OCR,
 * AI or government service is called. Swap each body for a real `fetch`
 * against the team's backend without changing any component.
 *
 *   const BASE_URL = import.meta.env.VITE_API_BASE_URL
 *   return fetch(`${BASE_URL}/records`).then(r => r.json())
 */

import {
  dashboardStats,
  confidenceDistribution,
  digitizationActivity,
  documentTypeDistribution,
  languageDistribution,
  ocrConfidenceDemo,
  overallConfidence,
  recordsByDistrict,
  recordsByState,
  validationOverview,
  type LandRecord,
  type RecordStatus,
} from "@/data/mockData";
import { store } from "@/store/appStore";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export interface RecordQuery {
  search?: string;
  state?: string;
  district?: string;
  tehsil?: string;
  village?: string;
  status?: RecordStatus | "all";
  documentType?: string;
  minConfidence?: number;
}

export async function getRecords(query: RecordQuery = {}): Promise<LandRecord[]> {
  await delay(120);
  return filterRecords(store.getState().records, query);
}

export function filterRecords(records: LandRecord[], q: RecordQuery): LandRecord[] {
  const term = (q.search ?? "").trim().toLowerCase();
  return records.filter((r) => {
    if (term) {
      const hay = [
        r.id,
        r.ownerName,
        r.ownerNameHi,
        r.khasraNumber,
        r.khataNumber,
        r.surveyNumber,
        r.village,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(term)) return false;
    }
    if (q.state && q.state !== "all" && r.state !== q.state) return false;
    if (q.district && q.district !== "all" && r.district !== q.district) return false;
    if (q.tehsil && q.tehsil !== "all" && r.tehsil !== q.tehsil) return false;
    if (q.village && q.village !== "all" && r.village !== q.village) return false;
    if (q.status && q.status !== "all" && r.status !== q.status) return false;
    if (q.documentType && q.documentType !== "all" && r.documentType !== q.documentType)
      return false;
    if (q.minConfidence && overallConfidence(r) < q.minConfidence) return false;
    return true;
  });
}

export async function getRecordById(id: string): Promise<LandRecord | undefined> {
  await delay(80);
  return store.getState().records.find((r) => r.id === id);
}

export interface UploadPayload {
  file: { name: string; size: number; type: string };
  documentType: string;
  language: string;
  state: string;
  district: string;
  village: string;
  notes?: string;
}

export async function uploadRecord(payload: UploadPayload): Promise<{ uploadId: string }> {
  await delay(400);
  return { uploadId: `UP-${Date.now().toString().slice(-6)}` };
}

export const PROCESSING_STAGES = [
  "Uploading document",
  "Detecting document type",
  "Detecting language",
  "Detecting document layout",
  "OCR text extraction",
  "Handwriting recognition",
  "Field classification",
  "Validation checks",
  "Preparing verification view",
];

/** Simulated pipeline for the prototype — no model is executed. */
export function processDocument(
  onStage: (stageIndex: number, progress: number) => void,
  onDone: (recordId: string) => void,
) {
  let progress = 0;
  const total = PROCESSING_STAGES.length;
  const timer = setInterval(() => {
    progress = Math.min(100, progress + Math.random() * 7 + 3);
    const stageIndex = Math.min(total - 1, Math.floor((progress / 100) * total));
    onStage(stageIndex, Math.round(progress));
    if (progress >= 100) {
      clearInterval(timer);
      onDone("LR-1042");
    }
  }, 260);
  return () => clearInterval(timer);
}

export async function getExtractionResult(recordId: string) {
  await delay(150);
  const record = store.getState().records.find((r) => r.id === recordId);
  return record ?? null;
}

export async function updateRecord(id: string, patch: Partial<LandRecord>) {
  await delay(120);
  store.updateRecord(id, patch);
  return store.getState().records.find((r) => r.id === id)!;
}

export interface ValidationRule {
  label: string;
  status: "pass" | "warn" | "fail";
  detail?: string | undefined;
}

/** Frontend/demo validation rules only. */
export function validateRecord(record: LandRecord): ValidationRule[] {
  const rules: ValidationRule[] = [];
  rules.push({
    label: "Required fields present",
    status: record.ownerName && record.khasraNumber && record.village ? "pass" : "fail",
  });
  rules.push({
    label: "Khasra number format valid",
    status: /^\d+(\/\d+)?$/.test(record.khasraNumber) ? "pass" : "fail",
    detail: "Expected pattern: <number> or <number>/<number>",
  });
  rules.push({ label: "District detected", status: record.district ? "pass" : "fail" });
  rules.push({ label: "Village detected", status: record.village ? "pass" : "fail" });
  const area = parseFloat(record.plotArea);
  rules.push({
    label: "Plot area within expected range",
    status:
      (record.confidence["plotArea"] ?? 100) < 80
        ? "warn"
        : Number.isFinite(area) && area > 0
          ? "pass"
          : "fail",
    detail:
      (record.confidence["plotArea"] ?? 100) < 80
        ? "Area requires review — extracted at low confidence."
        : undefined,
  });
  rules.push({
    label: "Duplicate check (demo dataset)",
    status:
      store
        .getState()
        .records.filter(
          (r) => r.khasraNumber === record.khasraNumber && r.village === record.village,
        ).length > 1
        ? "warn"
        : "pass",
  });
  return rules;
}

export async function approveRecord(id: string, actor: string) {
  await delay(200);
  store.updateRecord(id, { status: "verified" });
  store.appendAudit(id, "Record approved", actor);
  return true;
}

export async function rejectRecord(
  id: string,
  actor: string,
  reason = "Rejected during verification",
) {
  await delay(200);
  store.updateRecord(id, { status: "issue" });
  store.appendAudit(id, "Record rejected", actor, reason);
  return true;
}

export async function sendForReview(id: string, actor: string) {
  await delay(200);
  store.updateRecord(id, { status: "needs_review" });
  store.appendAudit(id, "Sent for secondary review", actor);
  return true;
}

export async function getDashboardStats() {
  await delay(80);
  return dashboardStats;
}

export async function getAnalytics() {
  await delay(80);
  return {
    digitizationActivity,
    validationOverview,
    recordsByState,
    recordsByDistrict,
    ocrConfidenceDemo,
    confidenceDistribution,
    documentTypeDistribution,
    languageDistribution,
  };
}

export interface ReportRequest {
  type: string;
  from: string;
  to: string;
  state: string;
  district: string;
}

export async function generateReport(req: ReportRequest) {
  await delay(500);
  const records = filterRecords(store.getState().records, {
    state: req.state,
    district: req.district,
  });
  return {
    id: `RPT-${Date.now().toString().slice(-5)}`,
    generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    request: req,
    rows: records.map((r) => ({
      id: r.id,
      owner: r.ownerName,
      district: r.district,
      state: r.state,
      confidence: overallConfidence(r),
      status: r.status,
    })),
  };
}

export function toCsv(rows: Record<string, string | number>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0] ?? {});
  return [headers.join(","), ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(","))].join(
    "\n",
  );
}
