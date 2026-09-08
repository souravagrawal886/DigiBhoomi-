import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DataTable, type Column } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBar } from "@/components/ConfidenceBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DOC_TYPES,
  STATES,
  TEHSILS,
  VILLAGES,
  overallConfidence,
  type LandRecord,
  type RecordStatus,
} from "@/data/mockData";
import { filterRecords, toCsv } from "@/services/api";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/records/")({
  validateSearch: (search: Record<string, unknown>): { q?: string | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Land Records Repository — Digi Bhoomi" },
      {
        name: "description",
        content:
          "Search and filter digitized land records by owner, Khasra, Khata, district, status and extraction confidence.",
      },
      { property: "og:title", content: "Land Records Repository — Digi Bhoomi" },
      {
        property: "og:description",
        content:
          "Searchable repository of digitized land records with confidence and verification status.",
      },
    ],
  }),
  component: RecordsPage,
});

const PAGE_SIZE = 8;

function RecordsPage() {
  const { q } = Route.useSearch();
  const records = useAppStore((s) => s.records);
  const [search, setSearch] = useState(q ?? "");
  const [state, setState] = useState("all");
  const [district, setDistrict] = useState("all");
  const [tehsil, setTehsil] = useState("all");
  const [village, setVillage] = useState("all");
  const [status, setStatus] = useState<RecordStatus | "all">("all");
  const [documentType, setDocumentType] = useState("all");
  const [minConfidence, setMinConfidence] = useState("0");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      filterRecords(records, {
        search,
        state,
        district,
        tehsil,
        village,
        status,
        documentType,
        minConfidence: Number(minConfidence),
      }),
    [records, search, state, district, tehsil, village, status, documentType, minConfidence],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

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
    { key: "survey", header: "Survey No.", cell: (r) => r.surveyNumber },
    { key: "khasra", header: "Khasra No.", cell: (r) => r.khasraNumber },
    { key: "khata", header: "Khata No.", cell: (r) => r.khataNumber },
    { key: "area", header: "Area (ha)", cell: (r) => r.plotArea },
    { key: "village", header: "Village", cell: (r) => r.village },
    { key: "tehsil", header: "Tehsil", cell: (r) => r.tehsil },
    { key: "district", header: "District", cell: (r) => r.district },
    {
      key: "conf",
      header: "Confidence",
      cell: (r) => <ConfidenceBar value={overallConfidence(r)} />,
    },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
    {
      key: "action",
      header: "Action",
      cell: (r) => (
        <div className="flex flex-wrap gap-1.5">
          <Button asChild size="sm" variant="outline">
            <Link to="/records/$id" params={{ id: r.id }}>
              View
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link to="/verification/$id" params={{ id: r.id }}>
              Verify
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  function exportCsv() {
    const csv = toCsv(
      filtered.map((r) => ({
        id: r.id,
        owner: r.ownerName,
        khasra: r.khasraNumber,
        khata: r.khataNumber,
        area: r.plotArea,
        village: r.village,
        district: r.district,
        state: r.state,
        confidence: overallConfidence(r),
        status: r.status,
      })),
    );
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "digibhoomi-records-demo.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="Land Records"
      description="Searchable repository of digitized land records. All entries are synthetic demonstration data."
      breadcrumb={[{ label: "Land Records" }]}
    >
      <div className="rounded-lg border border-border bg-card p-4 shadow-card">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
          <div className="relative min-w-0">
            <Label htmlFor="record-search" className="sr-only">
              Search records
            </Label>
            <Search
              aria-hidden
              className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="record-search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search owner, Khasra, Khata or Record ID"
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" aria-hidden /> Export CSV
          </Button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="State" value={state} onChange={setState} options={STATES} />
          <FilterSelect
            label="District"
            value={district}
            onChange={setDistrict}
            options={DISTRICTS}
          />
          <FilterSelect label="Tehsil" value={tehsil} onChange={setTehsil} options={TEHSILS} />
          <FilterSelect label="Village" value={village} onChange={setVillage} options={VILLAGES} />
          <FilterSelect
            label="Status"
            value={status}
            onChange={(v) => setStatus(v as RecordStatus | "all")}
            options={["verified", "needs_review", "issue", "processing"]}
            labels={{
              verified: "Verified",
              needs_review: "Needs Review",
              issue: "Issue",
              processing: "Processing",
            }}
          />
          <FilterSelect
            label="Document Type"
            value={documentType}
            onChange={setDocumentType}
            options={DOC_TYPES}
          />
          <FilterSelect
            label="Minimum Confidence"
            value={minConfidence}
            onChange={setMinConfidence}
            options={["0", "60", "80", "90"]}
            labels={{
              "0": "Any",
              "60": "60% and above",
              "80": "80% and above",
              "90": "90% and above",
            }}
            allLabel={null}
          />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Showing {rows.length} of {filtered.length} records
      </p>

      <div className="mt-2">
        <DataTable columns={columns} rows={rows} caption="Digitized land records" />
      </div>

      <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 1}
          onClick={() => setPage(current - 1)}
        >
          Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          Page {current} of {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={current === pageCount}
          onClick={() => setPage(current + 1)}
        >
          Next
        </Button>
      </nav>
    </AppShell>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  labels,
  allLabel = "All",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
  allLabel?: string | null;
}) {
  const id = `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="min-w-0">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="mt-1.5 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {allLabel && <SelectItem value="all">{allLabel}</SelectItem>}
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {labels?.[o] ?? o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
