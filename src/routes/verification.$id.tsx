import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Save, Send, XCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DocumentViewer } from "@/components/DocumentViewer";
import { ExtractedField } from "@/components/ExtractedField";
import { ValidationAlert, ValidationChecklist } from "@/components/ValidationAlert";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { FIELD_LABELS, overallConfidence, type LandRecord } from "@/data/mockData";
import {
  approveRecord,
  rejectRecord,
  sendForReview,
  updateRecord,
  validateRecord,
} from "@/services/api";
import { store, useAppStore, type FieldEdit } from "@/store/appStore";
import { toast } from "sonner";

export const Route = createFileRoute("/verification/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Verify ${params.id} — Digi Bhoomi OCR Verification` },
      {
        name: "description",
        content: `Side-by-side review of the original scanned document and AI-extracted fields with confidence scores for record ${params.id}.`,
      },
      { property: "og:title", content: `Verify ${params.id} — Digi Bhoomi OCR Verification` },
      {
        property: "og:description",
        content:
          "Human-in-the-loop verification of AI-extracted land record fields with confidence scoring.",
      },
    ],
  }),
  component: VerificationPage,
});

const EMPTY_EDITS: FieldEdit[] = [];

function VerificationPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const record = useAppStore((s) => s.records.find((r) => r.id === id));
  const editsMap = useAppStore((s) => s.edits);
  const edits = editsMap[id] ?? EMPTY_EDITS;
  const user = useAppStore((s) => s.user);
  const actor = user?.role ?? "Administrator";

  const [draft, setDraft] = useState<Record<string, string>>({});

  const values = useMemo(() => {
    const base: Record<string, string> = {};
    if (!record) return base;
    for (const f of FIELD_LABELS) {
      const key = f.key as keyof LandRecord;
      base[f.key as string] = String(record[key] ?? "");
    }
    return { ...base, ...draft };
  }, [record, draft]);

  if (!record) {
    return (
      <AppShell
        title="Record not found"
        breadcrumb={[{ label: "Verification Queue", to: "/verification" }, { label: id }]}
      >
        <p className="text-sm text-muted-foreground">No record exists with the identifier {id}.</p>
      </AppShell>
    );
  }

  const rules = validateRecord({ ...record, ...(values as Partial<LandRecord>) } as LandRecord);
  const lowFields = FIELD_LABELS.filter((f) => (record.confidence[f.key as string] ?? 100) < 80);
  const groups = Array.from(new Set(FIELD_LABELS.map((f) => f.group)));

  function handleChange(key: string, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    if (!record) return;
    const patch: Record<string, string> = {};
    for (const [key, value] of Object.entries(draft)) {
      const original = String(record[key as keyof LandRecord] ?? "");
      if (original !== value) {
        patch[key] = value;
        store.recordEdit(record.id, { field: key, original, updated: value, actor });
      }
    }
    if (Object.keys(patch).length === 0) {
      toast.info("No changes to save.");
      return;
    }
    await updateRecord(record.id, patch as Partial<LandRecord>);
    store.appendAudit(
      record.id,
      "Field corrected",
      actor,
      `${Object.keys(patch).length} field(s) updated`,
    );
    setDraft({});
    toast.success("Correction saved", { description: `Modified by ${actor}.` });
  }

  async function handleApprove() {
    if (!record) return;
    await handleSaveSilently();
    await approveRecord(record.id, actor);
    store.notify({
      title: `${record.id} approved`,
      detail: "Record approved after human verification.",
      severity: "success",
    });
    toast.success("Record approved", { description: `${record.id} is now marked verified.` });
    navigate({ to: "/dashboard" });
  }

  async function handleSaveSilently() {
    if (!record) return;
    const patch: Record<string, string> = {};
    for (const [key, value] of Object.entries(draft)) {
      const original = String(record[key as keyof LandRecord] ?? "");
      if (original !== value) {
        patch[key] = value;
        store.recordEdit(record.id, { field: key, original, updated: value, actor });
      }
    }
    if (Object.keys(patch).length) {
      await updateRecord(record.id, patch as Partial<LandRecord>);
      store.appendAudit(record.id, "Field corrected", actor);
      setDraft({});
    }
  }

  return (
    <AppShell
      title={`OCR Verification · ${record.id}`}
      breadcrumb={[{ label: "Verification Queue", to: "/verification" }, { label: record.id }]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={record.status} />
          <ConfidenceBadge value={overallConfidence(record)} />
          <span className="text-xs text-muted-foreground">
            Extracted from a demonstration scan — no live OCR service is connected.
          </span>
        </div>
      }
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <DocumentViewer record={record} />

        <section aria-label="AI extracted information" className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h2 className="text-sm font-semibold">AI Extracted Information</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Each field shows the extracted value and its confidence score. Fields below 80% are
              amber; below 60% are red and require correction.
            </p>
          </div>

          {lowFields.length > 0 && (
            <ValidationAlert
              title={`${lowFields.length} field(s) need manual verification`}
              detail={`Potential mismatch: the extracted ${lowFields.map((f) => f.label).join(", ")} value(s) require manual verification against the original document.`}
            />
          )}

          {groups.map((group) => (
            <div key={group} className="space-y-3">
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {group}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {FIELD_LABELS.filter((f) => f.group === group).map((f) => {
                  const key = f.key as string;
                  return (
                    <ExtractedField
                      key={key}
                      id={`field-${key}`}
                      label={f.label}
                      value={values[key] ?? ""}
                      confidence={record.confidence[key] ?? 90}
                      onChange={(v) => handleChange(key, v)}
                      edit={edits.find((e) => e.field === key)}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h3 className="text-sm font-semibold">Validation Checks</h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Frontend demonstration rules only — real business rules and cross-database
              verification will run on the backend.
            </p>
            <ValidationChecklist rules={rules} />
          </div>

          {edits.length > 0 && (
            <div className="rounded-lg border border-info/30 bg-info-soft p-4">
              <h3 className="text-sm font-semibold text-info">Human corrections in this record</h3>
              <ul className="mt-2 space-y-1 text-xs">
                {edits.map((e) => (
                  <li key={e.field}>
                    <span className="font-medium">
                      {FIELD_LABELS.find((f) => f.key === e.field)?.label ?? e.field}:
                    </span>{" "}
                    <span className="line-through">{e.original}</span> →{" "}
                    <span className="font-semibold">{e.updated}</span>{" "}
                    <span className="text-muted-foreground">· modified by {e.actor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="sticky bottom-0 flex flex-wrap gap-2 rounded-lg border border-border bg-card p-3 shadow-raised">
            <Button variant="outline" onClick={handleSave}>
              <Save className="mr-1.5 h-4 w-4" aria-hidden /> Save Correction
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await sendForReview(record.id, actor);
                toast.info("Sent for secondary review");
              }}
            >
              <Send className="mr-1.5 h-4 w-4" aria-hidden /> Send for Review
            </Button>
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-danger-soft"
              onClick={async () => {
                await rejectRecord(record.id, actor);
                toast.error("Record rejected", {
                  description: `${record.id} flagged as an issue.`,
                });
              }}
            >
              <XCircle className="mr-1.5 h-4 w-4" aria-hidden /> Reject Record
            </Button>
            <Button className="ml-auto" onClick={handleApprove}>
              <CheckCircle2 className="mr-1.5 h-4 w-4" aria-hidden /> Approve Record
            </Button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
