import { cn } from "@/lib/utils";

/** Original mark: land parcel grid + digital node, no government emblem used. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Digi Bhoomi logo"
      className={cn("h-8 w-8", className)}
      fill="none"
    >
      <rect x="1.5" y="1.5" width="29" height="29" rx="7" className="fill-secondary" />
      <path
        d="M6 21.5 13 15l5 4 8-8"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-saffron"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 25.5h20"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-primary-foreground/70"
        strokeLinecap="round"
      />
      <rect
        x="6"
        y="6"
        width="8"
        height="6"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.4"
        className="text-primary-foreground/80"
      />
      <circle cx="26" cy="11" r="2.4" className="fill-primary-foreground" />
    </svg>
  );
}
