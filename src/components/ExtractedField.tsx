import { AlertTriangle, PencilLine } from "lucide-react";
import { ConfidenceBadge, confidenceLevel } from "@/components/ConfidenceBadge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ExtractedField({
  id,
  label,
  value,
  confidence,
  onChange,
  edit,
}: {
  id: string;
  label: string;
  value: string;
  confidence: number;
  onChange: (v: string) => void;
  edit?: { original: string; updated: string; actor: string } | undefined;
}) {
  const level = confidenceLevel(confidence);
  const frame =
    level === "low"
      ? "border-destructive/40 bg-danger-soft/50"
      : level === "medium"
        ? "border-warning/40 bg-warning-soft/50"
        : "border-border bg-card";

  return (
    <div className={cn("rounded-lg border p-3 transition-colors", frame)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <Label htmlFor={id} className="truncate text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        <ConfidenceBadge value={confidence} />
      </div>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 bg-background font-medium"
        aria-describedby={level !== "high" ? `${id}-hint` : undefined}
      />
      {level !== "high" && (
        <p id={`${id}-hint`} className="mt-2 flex items-start gap-1.5 text-xs text-warning">
          <AlertTriangle aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            {level === "low"
              ? "Very low confidence — this value likely needs correction against the original document."
              : "Low confidence — please verify against original document."}
          </span>
        </p>
      )}
      {edit && edit.original !== edit.updated && (
        <div className="mt-2 rounded-md border border-info/30 bg-info-soft px-2.5 py-1.5 text-xs">
          <p className="flex items-center gap-1.5 font-medium text-info">
            <PencilLine aria-hidden className="h-3.5 w-3.5" /> Modified by {edit.actor}
          </p>
          <p className="mt-1 text-muted-foreground">
            Original: <span className="font-medium line-through">{edit.original}</span> → Updated:{" "}
            <span className="font-semibold text-foreground">{edit.updated}</span>
          </p>
        </div>
      )}
    </div>
  );
}
