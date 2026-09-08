import { AlertTriangle, Bell, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { store, useAppStore } from "@/store/appStore";
import type { AppNotification } from "@/data/mockData";

const icons = {
  info: { Icon: Info, tone: "text-info" },
  warning: { Icon: AlertTriangle, tone: "text-warning" },
  error: { Icon: XCircle, tone: "text-destructive" },
  success: { Icon: CheckCircle2, tone: "text-success" },
} as const;

export function NotificationDropdown() {
  const notifications = useAppStore((s) => s.notifications);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => store.markAllRead()}
          >
            Mark all read
          </Button>
        </div>
        <ul className="max-h-80 overflow-auto">
          {notifications.map((n: AppNotification) => {
            const { Icon, tone } = icons[n.severity];
            return (
              <li
                key={n.id}
                className={`flex gap-2.5 border-b border-border px-3 py-2.5 last:border-0 ${n.read ? "" : "bg-accent/40"}`}
              >
                <Icon aria-hidden className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.detail}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{n.time}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
