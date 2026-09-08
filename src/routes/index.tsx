import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { store } from "@/store/appStore";
import loginBg from "@/assets/farmland-login-bg.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Digi Bhoomi Land Record Digitization" },
      {
        name: "description",
        content:
          "Secure workspace sign-in for Digi Bhoomi, an intelligent land record digitization and validation system prototype for Indian land administration.",
      },
      { property: "og:title", content: "Sign in — Digi Bhoomi Land Record Digitization" },
      {
        property: "og:description",
        content:
          "Government-style secure workspace for AI-assisted digitization and human verification of legacy land records.",
      },
    ],
  }),
  component: LoginPage,
});

const ROLES = ["Administrator", "District Officer", "Verifier", "Data Entry Operator"];

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("admin@digibhoomi.gov.in");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState("Administrator");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    store.login({
      name: username.split("@")[0] ?? "Administrator",
      role,
      office: "District Office · Demo",
      email: username,
    });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3">
            <BrandMark className="h-11 w-11" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Digi Bhoomi</h1>
              <p className="text-sm text-muted-foreground">
                Intelligent Land Record Digitization &amp; Validation
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-card">
            <p className="mb-5 flex items-center gap-2 text-xs font-medium tracking-wide text-secondary uppercase">
              <ShieldCheck aria-hidden className="h-4 w-4" /> Government Secure Workspace
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <Lock className="mr-2 h-4 w-4" aria-hidden /> Login
              </Button>
            </form>

            <p className="mt-4 text-xs text-muted-foreground">
              Prototype sign-in — mock authentication only. No credentials are transmitted or
              stored.
            </p>
          </div>

        </div>
      </section>

      <section className="relative hidden overflow-hidden lg:block" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${loginBg.url})`,
            filter: "blur(8px)",
            transform: "scale(1.05)",
          }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative flex h-full flex-col justify-end p-12 text-primary-foreground">
          <p className="font-hi text-lg opacity-80">भू-अभिलेख डिजिटलीकरण एवं सत्यापन</p>
          <h2 className="mt-3 max-w-md text-3xl leading-tight font-semibold">
            Digitize legacy land records with AI assistance and human verification.
          </h2>
          <p className="mt-4 max-w-md text-sm opacity-80">
            OCR-assisted extraction, confidence scoring, validation rules, audit trail and GIS
            visualization — designed for district-level land administration workflows.
          </p>
        </div>
      </section>
    </div>
  );
}
