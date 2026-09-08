import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { store, useAppStore } from "@/store/appStore";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Digi Bhoomi" },
      {
        name: "description",
        content:
          "Manage profile, language, processing preferences, notifications and security options for the Digi Bhoomi demo.",
      },
      { property: "og:title", content: "Settings — Digi Bhoomi" },
      {
        property: "og:description",
        content: "Profile, language, processing and notification preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-card">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      <Separator className="mb-4" />
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const language = useAppStore((s) => s.language);

  const [name, setName] = useState(user?.name ?? "Verification Officer");
  const [email, setEmail] = useState(user?.email ?? "officer@demo.digibhoomi.in");
  const [office, setOffice] = useState(user?.office ?? "Tehsil Office (Demo)");
  const [threshold, setThreshold] = useState("85");
  const [autoFlag, setAutoFlag] = useState(true);
  const [handwriting, setHandwriting] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [queueAlerts, setQueueAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <AppShell
      title="Settings"
      description="Preferences are stored in the browser session for this prototype."
      breadcrumb={[{ label: "Home", to: "/dashboard" }, { label: "Settings" }]}
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Profile" description="Officer identity shown across the workspace.">
          <div className="space-y-1.5">
            <Label htmlFor="set-name">Full name</Label>
            <Input id="set-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-email">Official email</Label>
            <Input
              id="set-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="set-office">Office</Label>
            <Input id="set-office" value={office} onChange={(e) => setOffice(e.target.value)} />
          </div>
          <Button
            onClick={() => {
              store.login({ name, email, office, role: user?.role ?? "Verification Officer" });
              toast.success("Profile updated");
            }}
          >
            Save profile
          </Button>
        </Section>

        <Section title="Language" description="Interface language for labels and record display.">
          <div className="space-y-1.5">
            <Label htmlFor="set-lang">Display language</Label>
            <Select
              value={language}
              onValueChange={(v) => {
                store.setLanguage(v === "hi" ? "hi" : "en");
                toast.success(v === "hi" ? "भाषा हिन्दी पर सेट की गई" : "Language set to English");
              }}
            >
              <SelectTrigger id="set-lang">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Hindi record fields render with Noto Sans Devanagari.
          </p>
        </Section>

        <Section
          title="Processing preferences"
          description="Simulated extraction behaviour for the demo pipeline."
        >
          <div className="space-y-1.5">
            <Label htmlFor="set-threshold">Low-confidence threshold (%)</Label>
            <Input
              id="set-threshold"
              type="number"
              min={50}
              max={99}
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="set-autoflag">Auto-flag fields below threshold</Label>
            <Switch id="set-autoflag" checked={autoFlag} onCheckedChange={setAutoFlag} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="set-handwriting">Enable handwriting recognition stage</Label>
            <Switch id="set-handwriting" checked={handwriting} onCheckedChange={setHandwriting} />
          </div>
        </Section>

        <Section title="Notifications" description="Alerts for queue and verification activity.">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="set-email-alerts">Email alerts</Label>
            <Switch id="set-email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="set-queue-alerts">Verification queue alerts</Label>
            <Switch id="set-queue-alerts" checked={queueAlerts} onCheckedChange={setQueueAlerts} />
          </div>
        </Section>

        <Section title="Security" description="Access protection for the officer account.">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="set-2fa">Two-factor authentication</Label>
            <Switch id="set-2fa" checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
          <Button
            variant="outline"
            onClick={() => toast.info("Password change is disabled in the demo.")}
          >
            Change password
          </Button>
        </Section>

        <Section
          title="Role & permissions"
          description="Role assignment is managed by the district admin."
        >
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="font-medium">{user?.role ?? "Verification Officer"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Approve records</dt>
              <dd className="font-medium">Allowed</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delete records</dt>
              <dd className="font-medium">Not allowed</dd>
            </div>
          </dl>
        </Section>
      </div>
    </AppShell>
  );
}
