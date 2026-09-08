import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ConfidenceLevel = "high" | "medium" | "low";

export function confidenceLevel(value: number): ConfidenceLevel {
  if (value < 60) return "low";
  if (value < 80) return "medium";
  return "high";
}

const tone: Record<
  ConfidenceLevel,
  { className: string; label: string; Icon: typeof CheckCircle2 }
> = {
  high: {
    className: "bg-success-soft text-success border-success/30",
    label: "High confidence",
    Icon: CheckCircle2,
  },
  medium: {
    className: "bg-warning-soft text-warning border-warning/30",
    label: "Low confidence",
    Icon: AlertTriangle,
  },
  low: {
    className: "bg-danger-soft text-destructive border-destructive/30",
    label: "Very low confidence",
    Icon: XCircle,
  },
};

export function ConfidenceBadge({
  value,
  withLabel = true,
  className,
}: {
  value: number;
  withLabel?: boolean;
  className?: string;
}) {
  const level = confidenceLevel(value);
  const { className: toneClass, label, Icon } = tone[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium tabular-nums whitespace-nowrap",
        toneClass,
        className,
      )}
      title={`${value}% — ${label}`}
    >
      <Icon aria-hidden className="h-3.5 w-3.5" />
      {value}%{withLabel && <span className="hidden sm:inline">· {label}</span>}
    </span>
  );
}

export function ConfidenceBar({ value }: { value: number }) {
  const level = confidenceLevel(value);
  const bar =
    level === "high" ? "bg-success" : level === "medium" ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div
          className={cn("h-full rounded-full transition-all", bar)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">{value}%</span>
    </div>
  );
}
