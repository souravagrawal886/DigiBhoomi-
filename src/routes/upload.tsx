import { useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileUp, Loader2, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROCESSING_STAGES, processDocument, uploadRecord } from "@/services/api";
import { STATES, DISTRICTS, VILLAGES } from "@/data/mockData";
import { store } from "@/store/appStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Land Record — Digi Bhoomi" },
      {
        name: "description",
        content:
          "Upload scanned land records, handwritten registers, maps or legacy PDF files for AI-assisted digitization and verification.",
      },
      { property: "og:title", content: "Upload Land Record — Digi Bhoomi" },
      {
        property: "og:description",
        content:
          "Submit scanned land documents for AI-assisted digitization in the Digi Bhoomi prototype.",
      },
    ],
  }),
  component: UploadPage,
});

const DOC_TYPES = [
  "Land Record / RoR",
  "Mutation Record",
  "Registration Record",
  "Land Map",
  "Legacy PDF",
  "Other",
];
const LANGUAGES = ["Hindi", "English", "Other Indian Language"];
const MAX_SIZE = 20 * 1024 * 1024;

interface PickedFile {
  name: string;
  size: number;
  type: string;
}

function UploadPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<PickedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState(DOC_TYPES[0]!);
  const [language, setLanguage] = useState(LANGUAGES[0]!);
  const [state, setState] = useState("Delhi");
  const [district, setDistrict] = useState("South West Delhi");
  const [village, setVillage] = useState("Rampur");
  const [notes, setNotes] = useState("");

  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  function accept(f: File) {
    setError(null);
    const ok = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!ok.includes(f.type)) {
      setError("Unsupported file type. Please upload a PDF, JPG, JPEG or PNG file.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File exceeds the 20 MB maximum size.");
      return;
    }
    setFile({ name: f.name, size: f.size, type: f.type });
  }

  async function handleProcess() {
    if (!file) {
      setError("Please select a document before processing.");
      return;
    }
    await uploadRecord({ file, documentType, language, state, district, village, notes });
    setPhase("processing");
    setProgress(0);
    processDocument(
      (idx, pct) => {
        setStageIndex(idx);
        setProgress(pct);
      },
      () => {
        setPhase("done");
        store.notify({
          title: "Document processing completed",
          detail: `${file.name} is ready for verification as LR-1042.`,
          severity: "success",
        });
      },
    );
  }

  return (
    <AppShell
      title="Upload Land Record"
      description="Upload scanned land records, handwritten documents, maps or legacy PDF files for AI-assisted digitization."
      breadcrumb={[{ label: "Upload Record" }]}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) accept(f);
            }}
            className={cn(
              "rounded-lg border-2 border-dashed bg-card p-8 text-center transition-colors sm:p-12",
              dragging ? "border-secondary bg-info-soft" : "border-border",
            )}
          >
            <UploadCloud aria-hidden className="mx-auto h-10 w-10 text-secondary" />
            <p className="mt-3 text-base font-semibold">Drag &amp; Drop your document here</p>
            <p className="text-sm text-muted-foreground">or browse files</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => inputRef.current?.click()}
            >
              <FileUp className="mr-2 h-4 w-4" aria-hidden /> Browse files
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              aria-label="Choose a land record document"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) accept(f);
              }}
            />
            <p className="mt-4 text-xs text-muted-foreground">
              Supported: PDF, JPG, JPEG, PNG · Maximum size 20 MB
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-destructive/40 bg-danger-soft px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {file && (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "unknown"} ·{" "}
                  <span className="text-success">Ready to process</span>
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${file.name}`}
                onClick={() => {
                  setFile(null);
                  setPhase("idle");
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-card sm:grid-cols-2">
            <Field label="Document Type" id="doc-type">
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger id="doc-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Language" id="lang">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="lang" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="State" id="state">
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="District" id="district">
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger id="district" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Village" id="village">
              <Select value={village} onValueChange={setVillage}>
                <SelectTrigger id="village" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VILLAGES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Label htmlFor="notes" className="text-xs font-medium text-muted-foreground">
                Notes (optional)
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Condition of the document, register volume, remarks for the verifier…"
                className="mt-1.5"
                rows={3}
              />
            </div>
          </div>

          <Button size="lg" onClick={handleProcess} disabled={phase === "processing"}>
            {phase === "processing" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" aria-hidden />
            )}
            Process with AI
          </Button>
        </section>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h2 className="text-sm font-semibold">AI Processing Pipeline</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Simulated pipeline for the prototype. No OCR or AI service is executed in this build;
              each stage maps to a backend call that the team can connect later.
            </p>

            <div className="mt-4" aria-live="polite">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 text-xs">
                <span className="truncate text-muted-foreground">
                  {phase === "idle"
                    ? "Waiting for document"
                    : phase === "done"
                      ? "Document processed successfully"
                      : PROCESSING_STAGES[stageIndex]}
                </span>
                <span className="font-medium tabular-nums">{progress}%</span>
              </div>
              <Progress value={progress} className="mt-2" />
            </div>

            <ol className="mt-4 space-y-2">
              {PROCESSING_STAGES.map((stage, i) => {
                const done = phase === "done" || (phase === "processing" && i < stageIndex);
                const active = phase === "processing" && i === stageIndex;
                return (
                  <li key={stage} className="flex items-center gap-2 text-sm">
                    {done ? (
                      <CheckCircle2 aria-hidden className="h-4 w-4 shrink-0 text-success" />
                    ) : active ? (
                      <Loader2
                        aria-hidden
                        className="h-4 w-4 shrink-0 animate-spin text-secondary"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="h-4 w-4 shrink-0 rounded-full border border-border"
                      />
                    )}
                    <span className={done || active ? "text-foreground" : "text-muted-foreground"}>
                      {stage}
                    </span>
                  </li>
                );
              })}
            </ol>

            {phase === "done" && (
              <div className="mt-4 rounded-md border border-success/30 bg-success-soft p-3">
                <p className="flex items-center gap-2 text-sm font-medium text-success">
                  <CheckCircle2 aria-hidden className="h-4 w-4" /> Document processed successfully
                </p>
                <Button
                  className="mt-3 w-full"
                  onClick={() => navigate({ to: "/verification/$id", params: { id: "LR-1042" } })}
                >
                  Review Extracted Data
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
