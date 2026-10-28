"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { roleHome, useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError, Input, Label, Select } from "@/components/ui/input";
import type { Role } from "@/types";

const roleCopy: Record<Role, string> = {
  donor: "I have surplus food to give",
  ngo: "We feed people and can pick up nearby food",
  volunteer: "I can ride, drive or carry food",
  admin: "I keep the marketplace clean",
};

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, loading, demoMode, signIn, signUp, signInDemo } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [defaultRole] = useState<Role>((params.get("role") as Role) || "donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState<Role>(defaultRole);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyRole, setBusyRole] = useState<Role | null>(null);

  async function finish(target: string) {
    router.replace(target);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        await finish(params.get("next") ?? roleHome(null));
      } else {
        await signUp({
          email,
          password,
          name,
          role,
          orgName: role === "ngo" ? orgName : undefined,
        });
        await finish(params.get("next") ?? roleHome(role));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function demoLogin(demoRole: keyof typeof DEMO_ACCOUNTS) {
    setError(null);
    setBusyRole(demoRole);
    setBusy(true);
    try {
      await signInDemo(demoRole);
      await finish(params.get("next") ?? roleHome(demoRole));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setBusyRole(null);
      setBusy(false);
    }
  }

  if (user && !loading) {
    return (
      <Card className="mx-auto mt-8 max-w-md text-center">
        <CardHeader>
          <CardTitle>You are already signed in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {user.name} · {roleHome(user.role).slice(1)}
          </p>
          <Link
            href={roleHome(user.role)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Go to your dashboard →
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            {mode === "signin" ? "Sign in to FoodBridge" : "Create your account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <Label htmlFor="role">I am a…</Label>
                  <Select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                  >
                    {(Object.keys(roleCopy) as Role[]).map((r) => (
                      <option key={r} value={r}>
                        {r === "ngo" ? "NGO / Receiver" : r[0].toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </Select>
                  <p className="mt-1 text-xs text-muted-foreground">{roleCopy[role]}</p>
                </div>
                <div>
                  <Label htmlFor="name">
                    {role === "ngo" ? "Contact person name" : "Your name"}
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
                {role === "ngo" && (
                  <div>
                    <Label htmlFor="orgName">Organisation name</Label>
                    <Input
                      id="orgName"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                placeholder={mode === "signup" ? "min 8 characters" : ""}
              />
            </div>
            <FieldError>{error ?? undefined}</FieldError>
            <Button type="submit" loading={busy} className="w-full">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "signin"
                ? "New here? Create an account →"
                : "← Back to sign in"}
            </button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Try it in 30 seconds</CardTitle>
          <p className="text-sm text-muted-foreground">
            One click, full access: each demo login is a real role with seed data.
          </p>
        </CardHeader>
        <CardContent className="grid gap-2">
          <Button
            variant="outline"
            loading={busyRole === "donor" && busy}
            disabled={busy}
            onClick={() => demoLogin("donor")}
          >
            🍽️ Enter as Donor
          </Button>
          <Button
            variant="outline"
            loading={busyRole === "ngo" && busy}
            disabled={busy}
            onClick={() => demoLogin("ngo")}
          >
            🤝 Enter as NGO
          </Button>
          <Button
            variant="outline"
            loading={busyRole === "volunteer" && busy}
            disabled={busy}
            onClick={() => demoLogin("volunteer")}
          >
            🛵 Enter as Volunteer
          </Button>
          <Button
            variant="outline"
            loading={busyRole === "admin" && busy}
            disabled={busy}
            onClick={() => demoLogin("admin")}
          >
            🛡️ Enter as Admin
          </Button>
          {demoMode && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Demo data is stored in this browser — reset it any time from the admin page.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
