import type { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

/**
 * Responsive table: real table on md+, stacked cards on small screens.
 */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  emptyMessage = "No records match the current filters.",
  caption,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  caption?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-card md:block">
        <table className="w-full border-collapse text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`px-3 py-2.5 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase whitespace-nowrap ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-accent/40">
                {columns.map((c) => (
                  <td key={c.key} className={`px-3 py-2.5 align-middle ${c.className ?? ""}`}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {rows.map((row) => (
          <li key={row.id} className="rounded-lg border border-border bg-card p-3 shadow-card">
            <dl className="space-y-1.5">
              {columns.map((c) => (
                <div key={c.key} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-2">
                  <dt className="text-xs font-medium text-muted-foreground">{c.header}</dt>
                  <dd className="min-w-0 text-sm">{c.cell(row)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
