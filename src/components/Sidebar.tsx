import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  FileStack,
  FileText,
  LayoutDashboard,
  Map,
  Settings,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Upload Record", icon: Upload },
  { to: "/records", label: "Land Records", icon: FileStack },
  { to: "/verification", label: "Verification Queue", icon: ShieldCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/map", label: "GIS Map", icon: Map },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function SidebarContents({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAppStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
        <BrandMark className="h-9 w-9 shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-base leading-tight font-semibold text-sidebar-accent-foreground">
            Digi Bhoomi
          </p>
          <p className="truncate text-[11px] leading-tight text-sidebar-foreground/70">
            Land Record Digitization
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Main navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex min-w-0 items-center gap-3 rounded-md bg-sidebar-accent px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            {(user?.name ?? "AD").slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-accent-foreground">
              {user?.role ?? "Administrator"}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/70">
              {user?.office ?? "District Office"}
            </p>
          </div>
        </div>
        <p className="mt-2 flex items-center gap-2 px-1 text-[11px] text-sidebar-foreground/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Online · Active session
        </p>
      </div>
    </div>
  );
}
