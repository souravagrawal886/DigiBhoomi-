import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileStack,
  Gauge,
  Layers,
  Upload as UploadIcon,
  Zap,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ChartCard, DemoDataNote } from "@/components/ChartCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfidenceBar } from "@/components/ConfidenceBadge";
import { DataTable, type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  dashboardStats,
  digitizationActivity,
  FIELD_LABELS,
  ocrConfidenceDemo,
  overallConfidence,
  recordsByDistrict,
  recordsByState,
  validationOverview,
  type LandRecord,
} from "@/data/mockData";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Land Record Intelligence Dashboard — Digi Bhoomi" },
      {
        name: "description",
        content:
          "Monitor digitization throughput, extraction quality, verification activity and low-confidence fields across districts.",
      },
      { property: "og:title", content: "Land Record Intelligence Dashboard — Digi Bhoomi" },
      {
        property: "og:description",
        content: "Digitization, extraction quality and verification analytics for land records.",
      },
    ],
  }),
  component: DashboardPage,
});

const DONUT_COLORS = [
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-destructive)",
  "var(--color-info)",
];

function DashboardPage() {
  const records = useAppStore((s) => s.records);
  const recent = records.slice(0, 6);

  const lowConfidence = records
    .flatMap((r) =>
      FIELD_LABELS.map((f) => ({
        record: r.id,
        field: f.label,
        value: r.confidence[f.key as string] ?? 100,
      })),
    )
    .filter((x) => x.value < 80)
    .sort((a, b) => a.value - b.value)
    .slice(0, 6);

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
    { key: "khasra", header: "Khasra Number", cell: (r) => r.khasraNumber },
    { key: "village", header: "Village", cell: (r) => r.village },
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
        <Button asChild variant="outline" size="sm">
          <Link to="/verification/$id" params={{ id: r.id }}>
            Review
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <AppShell
      title="Land Record Intelligence Dashboard"
      description="Monitor digitization, extraction quality and verification activity."
      breadcrumb={[{ label: "Dashboard" }]}
    >
      <DemoDataNote className="mb-4" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Records"
          value={dashboardStats.totalRecords}
          Icon={FileStack}
          hint="Demo value"
        />
        <StatCard
          label="Verified Records"
          value={dashboardStats.verifiedRecords}
          Icon={CheckCircle2}
          tone="success"
          hint="Demo value"
        />
        <StatCard
          label="Pending Verification"
          value={dashboardStats.pendingVerification}
          Icon={Clock}
          tone="warning"
          hint="Demo value"
        />
        <StatCard
          label="Potential Issues"
          value={dashboardStats.potentialIssues}
          Icon={AlertTriangle}
          tone="danger"
          hint="Demo value"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Records Processed Today"
          value={dashboardStats.processedToday}
          Icon={Zap}
        />
        <StatCard label="Processing Queue" value={dashboardStats.processingQueue} Icon={Layers} />
        <StatCard
          label="Average Confidence"
          value={`${dashboardStats.averageConfidence}%`}
          Icon={Gauge}
          tone="success"
        />
        <StatCard
          label="Documents Uploaded"
          value={dashboardStats.documentsUploaded}
          Icon={UploadIcon}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Digitization Activity"
            description="Records processed and verified over time (demo)."
          >
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={digitizationActivity} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "var(--color-border)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="processed"
                  name="Processed"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="verified"
                  name="Verified"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard title="Validation Overview" description="Distribution of record states (demo).">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={validationOverview}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
              >
                {validationOverview.map((entry, i) => (
                  <Cell key={entry.key} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Records by State" description="Top contributing states (demo).">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={recordsByState} margin={{ left: -18, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={54}
                stroke="var(--color-muted-foreground)"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }}
              />
              <Bar
                dataKey="value"
                name="Records"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Records by District"
          description="District-wise digitization progress (demo)."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={recordsByDistrict} layout="vertical" margin={{ left: 24, right: 12 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                horizontal={false}
              />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={100}
                stroke="var(--color-muted-foreground)"
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, borderColor: "var(--color-border)", fontSize: 12 }}
              />
              <Bar
                dataKey="value"
                name="Records"
                fill="var(--color-chart-5)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="OCR Confidence by Document Class"
          description="Prototype/demo metrics — not measured model accuracy."
        >
          <ul className="space-y-4">
            {ocrConfidenceDemo.map((item) => (
              <li key={item.name}>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 text-sm">
                  <span className="truncate text-foreground">{item.name}</span>
                  <span className="font-medium tabular-nums">{item.value}%</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={
                      item.value >= 80
                        ? "h-full bg-success"
                        : item.value >= 60
                          ? "h-full bg-warning"
                          : "h-full bg-destructive"
                    }
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </ChartCard>

        <div className="lg:col-span-2">
          <ChartCard
            title="Low Confidence Fields"
            description="Fields flagged for human verification."
            action={
              <Button asChild size="sm" variant="outline">
                <Link to="/verification">Open Verification Queue</Link>
              </Button>
            }
          >
            <ul className="divide-y divide-border">
              {lowConfidence.map((item) => (
                <li
                  key={`${item.record}-${item.field}`}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.field}</p>
                    <p className="text-xs text-muted-foreground">Record {item.record}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <ConfidenceBar value={item.value} />
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/verification/$id" params={{ id: item.record }}>
                        Verify
                      </Link>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </ChartCard>
        </div>
      </div>

      <section className="mt-6">
        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <h2 className="text-sm font-semibold">Recent Records</h2>
          <Button asChild size="sm" variant="outline">
            <Link to="/records">View all records</Link>
          </Button>
        </div>
        <DataTable columns={columns} rows={recent} caption="Recently digitized land records" />
      </section>
    </AppShell>
  );
}
