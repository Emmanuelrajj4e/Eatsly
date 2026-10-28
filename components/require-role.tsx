"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABELS } from "@/services/auth";
import type { Role } from "@/services/auth";
import { Card } from "@/components/ui/card";
import { buttonStyles } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Route guard for role-gated pages (/board, /pickups, /post).
 * - signed out        → redirect /start?reason=signin
 * - signed in w/o role → redirect /start?reason=role (+ explain on /start)
 * Renders a short message card briefly; no flash of hidden content.
 */
export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAuth();

  const denied = auth !== null && !roles.includes(auth.role);
  const signedOut = auth === null;

  useEffect(() => {
    if (auth === null && signedOut) {
      const id = requestAnimationFrame(() => {
        router.replace("/start?reason=signin");
      });
      return () => cancelAnimationFrame(id);
    }
    if (denied) {
      const id = requestAnimationFrame(() => {
        router.replace("/start?reason=role&need=" + roles.join("+"));
      });
      return () => cancelAnimationFrame(id);
    }
  }, [auth, denied, signedOut, roles, router]);

  if (signedOut || denied || auth === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Card>
          <p className="font-display text-lg font-bold">
            {signedOut ? "This page needs a role" : `For ${roles.map((r) => ROLE_LABELS[r]).join(" & ")} roles`}
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

/** Inline variant for pages that render their own empty states. */
export function RoleGateMessage({ to = "/start" }: { to?: string }) {
  return (
    <Card className="mx-auto max-w-md text-center">
      <p className="font-display text-lg font-bold">Pick a role to continue</p>
      <p className="mt-2 text-sm text-muted">
        Eatsly is demo-signed-in per role. No real accounts are involved.
      </p>
      <Link href={to} className={cn(buttonStyles("primary", "md", "mt-4"))}>
        Choose your role
      </Link>
    </Card>
  );
}
