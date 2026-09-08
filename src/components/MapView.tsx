import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import type { LandRecord } from "@/data/mockData";
import { overallConfidence } from "@/data/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

/**
 * GIS-style parcel map placeholder.
 * Markers are projected from lat/lng onto an India-bounding-box SVG canvas so
 * the same record geometry can later be handed to Leaflet / MapLibre without
 * changing the data shape. Coordinates are approximate demo coordinates.
 */
const BOUNDS = { minLat: 6, maxLat: 36, minLng: 68, maxLng: 98 };

function project(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x, y };
}

const statusColor: Record<string, string> = {
  verified: "bg-success",
  needs_review: "bg-warning",
  issue: "bg-destructive",
  processing: "bg-info",
};

export function MapView({ records }: { records: LandRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(records[0]?.id ?? null);
  const selected = useMemo(
    () => records.find((r) => r.id === selectedId) ?? null,
    [records, selectedId],
  );

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div
        className="relative h-[520px] w-full bg-[oklch(0.94_0.02_200)]"
        role="application"
        aria-label="Land record parcel map (demonstration coordinates)"
      >
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="oklch(0.86 0.02 210)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {records.map((r) => {
          const { x, y } = project(r.lat, r.lng);
          const active = r.id === selectedId;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedId(r.id)}
              aria-label={`${r.id}, ${r.village}, ${r.district} — ${r.status.replace("_", " ")}`}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-full rounded-full p-0.5 transition-transform",
                active && "z-10 scale-125",
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-full text-primary-foreground shadow-raised ring-2 ring-card",
                  statusColor[r.status],
                )}
              >
                <MapPin aria-hidden className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}

        <div className="absolute bottom-3 left-3 rounded-md border border-border bg-card/95 p-3 text-xs shadow-card">
          <p className="mb-1.5 font-semibold">Legend</p>
          <ul className="space-y-1">
            {[
              ["verified", "Verified"],
              ["needs_review", "Needs Review"],
              ["issue", "Issue"],
              ["processing", "Processing"],
            ].map(([key, label]) => (
              <li key={key} className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", statusColor[key as string])} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="absolute top-3 right-3 rounded-md border border-border bg-card/95 px-2 py-1 text-[11px] text-muted-foreground">
          Demo parcel layer · GIS-ready (Leaflet/MapLibre can be attached)
        </p>
      </div>

      {selected && (
        <aside className="border-t border-border p-4 md:absolute md:top-3 md:left-3 md:w-72 md:rounded-lg md:border md:bg-card/95 md:shadow-raised">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
            <h3 className="truncate text-sm font-semibold">{selected.id}</h3>
            <StatusBadge status={selected.status} />
          </div>
          <dl className="mt-2 space-y-1 text-xs">
            <Item label="Owner" value={`${selected.ownerName} (${selected.ownerNameHi})`} />
            <Item label="Khasra Number" value={selected.khasraNumber} />
            <Item label="Area" value={`${selected.plotArea} ha`} />
            <Item label="Village" value={selected.village} />
            <Item label="District" value={`${selected.district}, ${selected.state}`} />
            <Item label="Overall confidence" value={`${overallConfidence(selected)}%`} />
          </dl>
        </aside>
      )}
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 font-medium break-words">{value}</dd>
    </div>
  );
}
