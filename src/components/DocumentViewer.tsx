import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  RotateCw,
  Scan,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MockScanDocument } from "@/components/MockScanDocument";
import type { LandRecord } from "@/data/mockData";
import { cn } from "@/lib/utils";

const TOTAL_PAGES = 2;

export function DocumentViewer({ record }: { record: LandRecord }) {
  const [zoom, setZoom] = useState(0.85);
  const [rotation, setRotation] = useState(0);
  const [page, setPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card",
        fullscreen && "fixed inset-2 z-50 shadow-raised",
      )}
      aria-label="Original document viewer"
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <Scan aria-hidden className="h-4 w-4 shrink-0 text-secondary" />
          <h2 className="truncate text-sm font-semibold">Original Document</h2>
          <span className="hidden shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            {record.documentType}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Zoom out" onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}>
            <ZoomOut className="h-4 w-4" />
          </IconBtn>
          <span className="w-11 text-center text-xs tabular-nums text-muted-foreground">
            {Math.round(zoom * 100)}%
          </span>
          <IconBtn label="Zoom in" onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}>
            <ZoomIn className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Rotate document" onClick={() => setRotation((r) => (r + 90) % 360)}>
            <RotateCw className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Fit to screen"
            onClick={() => {
              setZoom(0.85);
              setRotation(0);
            }}
          >
            <Minimize2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label={fullscreen ? "Exit full screen" : "Full screen"}
            onClick={() => setFullscreen((f) => !f)}
          >
            <Maximize2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </header>

      <div
        className={cn(
          "flex-1 overflow-auto bg-muted/60 p-4",
          fullscreen ? "min-h-0" : "max-h-[640px] min-h-[420px]",
        )}
      >
        <div
          className="origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        >
          <MockScanDocument record={record} page={page} />
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">Demo scan generated for prototype</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs tabular-nums text-muted-foreground">
            Page {page} of {TOTAL_PAGES}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={page === TOTAL_PAGES}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </section>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}
