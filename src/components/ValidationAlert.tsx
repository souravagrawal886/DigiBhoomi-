import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { ValidationRule } from "@/services/api";

export function ValidationChecklist({ rules }: { rules: ValidationRule[] }) {
  return (
    <ul className="space-y-2" aria-label="Validation checks">
      {rules.map((rule) => {
        const Icon =
          rule.status === "pass" ? CheckCircle2 : rule.status === "warn" ? AlertTriangle : XCircle;
        const tone =
          rule.status === "pass"
            ? "text-success"
            : rule.status === "warn"
              ? "text-warning"
              : "text-destructive";
        return (
          <li key={rule.label} className="flex items-start gap-2 text-sm">
            <Icon aria-hidden className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
            <span className="min-w-0">
              <span className="text-foreground">{rule.label}</span>
              <span className="sr-only">
                {rule.status === "pass"
                  ? " — passed"
                  : rule.status === "warn"
                    ? " — needs review"
                    : " — failed"}
              </span>
              {rule.detail && (
                <span className="block text-xs text-muted-foreground">{rule.detail}</span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ValidationAlert({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-lg border border-warning/40 bg-warning-soft p-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-warning">
        <AlertTriangle aria-hidden className="h-4 w-4" /> {title}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
