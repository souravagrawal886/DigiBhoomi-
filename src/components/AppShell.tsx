import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronRight, LogOut, Menu, Search, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { NAV_ITEMS, SidebarContents } from "@/components/Sidebar";
import { store, useAppStore } from "@/store/appStore";

export function AppShell({
  title,
  description,
  breadcrumb,
  actions,
  children,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV_ITEMS.find((n) => pathname.startsWith(n.to));

  useEffect(() => {
    if (!user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  return (
    <div className="flex min-h-dvh w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-dvh">
          <SidebarContents />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarContents onNavigate={() => setMobileOpen(false)} />
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-1 text-xs text-muted-foreground"
                >
                  <Link to="/dashboard" className="hover:text-foreground">
                    Digi Bhoomi
                  </Link>
                  {(breadcrumb ?? [{ label: current?.label ?? title }]).map((c) => (
                    <span key={c.label} className="flex items-center gap-1">
                      <ChevronRight aria-hidden className="h-3 w-3" />
                      {c.to ? (
                        <Link to={c.to} className="hover:text-foreground">
                          {c.label}
                        </Link>
                      ) : (
                        <span className="text-foreground">{c.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
                <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <form
                className="hidden xl:block"
                role="search"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/records", search: { q: query } });
                }}
              >
                <label htmlFor="global-search" className="sr-only">
                  Search records
                </label>
                <div className="relative">
                  <Search
                    aria-hidden
                    className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="global-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search owner, Khasra, Record ID"
                    className="w-64 pl-8"
                  />
                </div>
              </form>

              <NotificationDropdown />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="User profile menu">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user?.name ?? "Administrator"}</p>
                    <p className="text-xs font-normal text-muted-foreground">
                      {user?.email ?? "demo@digibhoomi.gov"}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      store.logout();
                      navigate({ to: "/", replace: true });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link to="/upload">
                  <Upload className="mr-1.5 h-4 w-4" /> Upload Record
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {description && (
            <p className="mb-4 max-w-3xl text-sm text-muted-foreground">{description}</p>
          )}
          {actions && <div className="mb-4">{actions}</div>}
          {children}
        </main>

        <footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-6">
          Digi Bhoomi — Intelligent Land Record Digitization &amp; Validation System · SIH 26018
          frontend prototype. All data shown is synthetic demonstration data.
        </footer>
      </div>
    </div>
  );
}
