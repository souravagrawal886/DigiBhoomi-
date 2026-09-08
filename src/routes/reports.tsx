import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DemoDataNote } from "@/components/ChartCard";
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
import { STATES, DISTRICTS } from "@/data/mockData";
import { generateReport, toCsv } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Digi Bhoomi" },
      {
        name: "description",
        content:
          "Generate digitization, verification and exception reports from synthetic land record data.",
      },
      { property: "og:title", content: "Reports — Digi Bhoomi" },
      {
        property: "og:description",
        content: "Generate and export demo land record digitization reports.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportsPage,
});

type ReportResult = Awaited<ReturnType<typeof generateReport>>;

function ReportsPage() {
  const [type, setType] = useState("digitization_summary");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-09-01");
  const [state, setState] = useState("all");
  const [district, setDistrict] = useState("all");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportResult | null>(null);

  async function onGenerate() {
    setLoading(true);
    try {
      const result = await generateReport({ type, from, to, state, district });
      setReport(result);
      toast.success(`Report ${result.id} generated (demo data)`);
    } finally {
      setLoading(false);
    }
  }

  function onExportCsv() {
    if (!report) return;
    const csv = toCsv(report.rows);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppShell
      title="Reports"
      description="Report outputs are generated from synthetic demonstration records."
      breadcrumb={[{ label: "Home", to: "/dashboard" }, { label: "Reports" }]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-card md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-1.5">
            <Label htmlFor="rep-type">Report type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="rep-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="digitization_summary">Digitization summary</SelectItem>
                <SelectItem value="verification_activity">Verification activity</SelectItem>
                <SelectItem value="exception_report">Exception report</SelectItem>
                <SelectItem value="confidence_audit">Confidence audit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rep-from">From</Label>
            <Input
              id="rep-from"
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rep-to">To</Label>
            <Input id="rep-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rep-state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="rep-state">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All states</SelectItem>
                {STATES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rep-district">District</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger id="rep-district">
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

        <div className="flex flex-wrap gap-3">
          <Button onClick={onGenerate} disabled={loading}>
            <FileText className="mr-2 h-4 w-4" />
            {loading ? "Generating…" : "Generate report"}
          </Button>
          <Button variant="outline" onClick={onExportCsv} disabled={!report}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            disabled={!report}
            onClick={() => toast.info("PDF export is a demo placeholder in this prototype.")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PDF (demo)
          </Button>
        </div>

        {report ? (
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold text-foreground">
                {report.id} · {report.rows.length} records
              </h2>
              <p className="text-xs text-muted-foreground">Generated {report.generatedAt}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2">Record ID</th>
                    <th className="px-4 py-2">Owner</th>
                    <th className="px-4 py-2">District</th>
                    <th className="px-4 py-2">State</th>
                    <th className="px-4 py-2">Confidence</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-4 py-2 font-medium">{r.id}</td>
                      <td className="px-4 py-2">{r.owner}</td>
                      <td className="px-4 py-2">{r.district}</td>
                      <td className="px-4 py-2">{r.state}</td>
                      <td className="px-4 py-2">{r.confidence}%</td>
                      <td className="px-4 py-2 capitalize">{r.status.replace("_", " ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <DemoDataNote />
      </div>
    </AppShell>
  );
}
