import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FileCheck2, History } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DocumentViewer } from "@/components/DocumentViewer";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { ValidationChecklist } from "@/components/ValidationAlert";
import { Button } from "@/components/ui/button";
import { overallConfidence } from "@/data/mockData";
import { validateRecord } from "@/services/api";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/records/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Record ${params.id} — Digi Bhoomi Land Records` },
      {
        name: "description",
        content: `Full digitized land record details, validation status and audit history for record ${params.id}.`,
      },
      { property: "og:title", content: `Record ${params.id} — Digi Bhoomi Land Records` },
      {
        property: "og:description",
        content: "Digitized land record details, validation status and verification audit trail.",
      },
    ],
  }),
  component: RecordDetailsPage,
});

function RecordDetailsPage() {
  const { id } = Route.useParams();
  const record = useAppStore((s) => s.records.find((r) => r.id === id));

  if (!record) {
    return (
      <AppShell
        title="Record not found"
        breadcrumb={[{ label: "Land Records", to: "/records" }, { label: id }]}
      >
        <p className="text-sm text-muted-foreground">No record exists with the identifier {id}.</p>
      </AppShell>
    );
  }

  const rules = validateRecord(record);

  return (
    <AppShell
      title={`Record ${record.id}`}
      breadcrumb={[{ label: "Land Records", to: "/records" }, { label: record.id }]}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/records" search={{ q: "" }}>
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden /> Back to records
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/verification/$id" params={{ id: record.id }}>
              <FileCheck2 className="mr-1.5 h-4 w-4" aria-hidden /> Open verification
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Download className="mr-1.5 h-4 w-4" aria-hidden /> Download / Print
          </Button>
          <StatusBadge status={record.status} />
          <ConfidenceBadge value={overallConfidence(record)} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <DocumentViewer record={record} />

        <div className="space-y-4">
          <Section title="Owner Information">
            <Item label="Owner Name" value={`${record.ownerName} · ${record.ownerNameHi}`} />
            <Item label="Father's / Guardian Name" value={record.fatherName} />
            <Item label="Ownership Type" value={record.ownershipType} />
          </Section>

          <Section title="Land Information">
            <Item label="Survey Number" value={record.surveyNumber} />
            <Item label="Khasra Number" value={record.khasraNumber} />
            <Item label="Khata Number" value={record.khataNumber} />
            <Item label="Plot Area" value={`${record.plotArea} ${record.areaUnit}`} />
            <Item label="Land Classification" value={record.landClassification} />
          </Section>

          <Section title="Location Information">
            <Item label="Village" value={`${record.village} · ${record.villageHi}`} />
            <Item label="Tehsil" value={record.tehsil} />
            <Item label="District" value={record.district} />
            <Item label="State" value={record.state} />
            <Item
              label="Approx. coordinates (demo)"
              value={`${record.lat.toFixed(4)}, ${record.lng.toFixed(4)}`}
            />
          </Section>

          <Section title="Mutation Information">
            <Item label="Mutation Number" value={record.mutationNumber} />
            <Item label="Mutation Date" value={record.mutationDate} />
          </Section>

          <Section title="Registration Information">
            <Item label="Registration Number" value={record.registrationNumber} />
            <Item label="Registration Date" value={record.registrationDate} />
            <Item label="Document Type" value={record.documentType} />
            <Item label="Source Language" value={record.language} />
          </Section>

          <Section title="Validation Status">
            <div className="col-span-full">
              <ValidationChecklist rules={rules} />
            </div>
          </Section>

          <section className="rounded-lg border border-border bg-card p-4 shadow-card">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <History aria-hidden className="h-4 w-4 text-secondary" /> Audit History
            </h2>
            <ol className="mt-3 space-y-0">
              {record.audit.map((entry, i) => (
                <li key={`${entry.label}-${i}`} className="relative flex gap-3 pb-4 last:pb-0">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-secondary"
                  />
                  {i < record.audit.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-4 left-[4.5px] h-full w-px bg-border"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{entry.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {entry.actor} · {entry.timestamp}
                    </p>
                    {entry.detail && (
                      <p className="text-xs text-muted-foreground">{entry.detail}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-card">
      <h2 className="text-sm font-semibold">{title}</h2>
      <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-hi truncate text-sm font-medium">{value}</dd>
    </div>
  );
}
