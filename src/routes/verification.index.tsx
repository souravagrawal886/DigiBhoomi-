import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { PriorityBadge, StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBar } from "@/components/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DISTRICTS,
  lowConfidenceFields,
  overallConfidence,
  type LandRecord,
} from "@/data/mockData";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/verification/")({
  head: () => ({
    meta: [
      { title: "Verification Queue — Digi Bhoomi" },
      {
        name: "description",
        content:
          "Records awaiting human verification, prioritised by low-confidence fields and validation issues.",
      },
      { property: "og:title", content: "Verification Queue — Digi Bhoomi" },
      {
        property: "og:description",
        content: "Human-in-the-loop review queue for AI-extracted land record fields.",
      },
    ],
  }),
  component: VerificationQueuePage,
});

function VerificationQueuePage() {
  const records = useAppStore((s) => s.records);
  const [priority, setPriority] = useState("all");
  const [district, setDistrict] = useState("all");

  const queue = useMemo(
    () =>
      records
        .filter(
          (r) => r.status === "needs_review" || r.status === "issue" || r.status === "processing",
        )
        .filter((r) => priority === "all" || r.priority === priority)
        .filter((r) => district === "all" || r.district === district)
        .sort((a, b) => overallConfidence(a) - overallConfidence(b)),
    [records, priority, district],
  );

  const columns: Column<LandRecord>[] = [
    {
      key: "id",
      header: "Record ID",
      cell: (r) => (
        <Link
          to="/records/$id"
          params={{ id: r.id }}
          className="font-medium text-secondary hover:underline"
        >
          {r.id}
        </Link>
      ),
    },
    { key: "owner", header: "Owner", cell: (r) => <span className="font-hi">{r.ownerName}</span> },
    { key: "khasra", header: "Khasra", cell: (r) => r.khasraNumber },
    { key: "district", header: "District", cell: (r) => r.district },
    {
      key: "low",
      header: "Low Confidence Fields",
      cell: (r) => {
        const fields = lowConfidenceFields(r);
        return fields.length ? (
          <span className="text-xs text-warning">{fields.join(", ")}</span>
        ) : (
          <span className="text-xs text-muted-foreground">None</span>
        );
      },
    },
    {
      key: "conf",
      header: "Overall Confidence",
      cell: (r) => <ConfidenceBar value={overallConfidence(r)} />,
    },
    { key: "date", header: "Uploaded", cell: (r) => r.uploadedAt },
    { key: "priority", header: "Priority", cell: (r) => <PriorityBadge priority={r.priority} /> },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "action",
      header: "Action",
      cell: (r) => (
        <Button asChild size="sm">
          <Link to="/verification/$id" params={{ id: r.id }}>
            Review
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      title="Verification Queue"
      description="Records flagged for human review. Lowest-confidence extractions appear first."
      breadcrumb={[{ label: "Verification Queue" }]}
    >
      <div className="mb-4 grid gap-3 rounded-lg border border-border bg-card p-4 shadow-card sm:grid-cols-2 lg:w-2/3">
        <div>
          <Label htmlFor="priority-filter" className="text-xs font-medium text-muted-foreground">
            Priority
          </Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority-filter" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="district-filter" className="text-xs font-medium text-muted-foreground">
            District
          </Label>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger id="district-filter" className="mt-1.5 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All districts</SelectItem>
              {DISTRICTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={queue}
        caption="Records requiring human verification"
        emptyMessage="The verification queue is clear."
      />
    </AppShell>
  );
}
