import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import type { RecordStatus, Priority } from "@/data/mockData";
import { cn } from "@/lib/utils";

const map: Record<RecordStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  verified: {
    label: "Verified",
    className: "bg-success-soft text-success border-success/30",
    Icon: CheckCircle2,
  },
  needs_review: {
    label: "Needs Review",
    className: "bg-warning-soft text-warning border-warning/30",
    Icon: AlertTriangle,
  },
  issue: {
    label: "Issue",
    className: "bg-danger-soft text-destructive border-destructive/30",
    Icon: XCircle,
  },
  processing: {
    label: "Processing",
    className: "bg-info-soft text-info border-info/30",
    Icon: Loader2,
  },
};

export function StatusBadge({ status, className }: { status: RecordStatus; className?: string }) {
  const { label, className: tone, Icon } = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tone,
        className,
      )}
    >
      <Icon aria-hidden className={cn("h-3.5 w-3.5", status === "processing" && "animate-spin")} />
      {label}
    </span>
  );
}

const priorityMap: Record<Priority, string> = {
  high: "bg-danger-soft text-destructive border-destructive/30",
  medium: "bg-warning-soft text-warning border-warning/30",
  low: "bg-muted text-muted-foreground border-border",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        priorityMap[priority],
      )}
    >
      {priority}
    </span>
  );
}
