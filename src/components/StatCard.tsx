import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  Icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  Icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "bg-info-soft text-info",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-destructive",
  }[tone];

  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-raised">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
            {typeof value === "number" ? value.toLocaleString("en-IN") : value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-md", toneClass)}>
          <Icon aria-hidden className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
