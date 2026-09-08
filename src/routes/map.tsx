import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { MapView } from "@/components/MapView";
import { DemoDataNote } from "@/components/ChartCard";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATES, DISTRICTS } from "@/data/mockData";
import { useAppStore } from "@/store/appStore";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Parcel Map View — Digi Bhoomi" },
      {
        name: "description",
        content:
          "GIS-style parcel map of digitized land records with demonstration coordinates and verification status.",
      },
      { property: "og:title", content: "Parcel Map View — Digi Bhoomi" },
      {
        property: "og:description",
        content:
          "Explore synthetic land parcels on a GIS-style map with verification status markers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const records = useAppStore((s) => s.records);
  const [state, setState] = useState("all");
  const [district, setDistrict] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (state === "all" || r.state === state) &&
          (district === "all" || r.district === district) &&
          (status === "all" || r.status === status),
      ),
    [records, state, district, status],
  );

  return (
    <AppShell
      title="Parcel Map View"
      description="Approximate demonstration coordinates — not survey-grade geometry."
      breadcrumb={[{ label: "Home", to: "/dashboard" }, { label: "Map View" }]}
    >
      <div className="space-y-4">
        <div className="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-card sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="map-state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="map-state">
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
            <Label htmlFor="map-district">District</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger id="map-district">
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
          <div className="space-y-1.5">
            <Label htmlFor="map-status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="map-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="needs_review">Needs review</SelectItem>
                <SelectItem value="issue">Issue</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <MapView records={filtered} />
        <DemoDataNote />
      </div>
    </AppShell>
  );
}
