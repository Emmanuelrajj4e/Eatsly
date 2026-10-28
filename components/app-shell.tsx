"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { roleHome, useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notification-bell";
import { ThemeToggle } from "@/components/theme-toggle";

interface GuardProps {
  children: React.ReactNode;
  /** Roles allowed on this page; omit to allow any signed-in user. */
  allowed?: import("@/types").Role[];
}

/** Redirect-based page guard for protected routes. */
export function Guard({ children, allowed }: GuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      router.replace(`/login?next=${next}`);
      return;
    }
    if (allowed && !allowed.includes(user.role)) {
      router.replace(roleHome(user.role));
    }
  }, [loading, user, router, allowed]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-4 h-40 w-full" />
      </div>
    );
  }
  if (!user || (allowed && !allowed.includes(user.role))) return null;
  return <>{children}</>;
}

export const ROLE_LABEL: Record<string, string> = {
  donor: "Donor",
  ngo: "NGO / Receiver",
  volunteer: "Volunteer",
  admin: "Admin",
};

/** Links shown in the shell, depending on role. */
function linksFor(role: string | null): Array<{ href: string; label: string; emoji: string }> {
  const base = [
    { href: "/browse", label: "Browse", emoji: "🧭" },
    { href: "/impact", label: "Impact", emoji: "🌍" },
  ];
  if (role === "donor")
    return base.concat([
      { href: "/donor/new", label: "Post food", emoji: "➕" },
      { href: "/donor/listings", label: "My listings", emoji: "📋" },
    ]);
  if (role === "ngo") return base.concat([{ href: "/ngo/claims", label: "My claims", emoji: "🤝" }]);
  if (role === "volunteer")
    return base.concat([{ href: "/volunteer/tasks", label: "My tasks", emoji: "🛵" }]);
  if (role === "admin")
    return base.concat([
      { href: "/admin", label: "Admin", emoji: "🛡️" },
      { href: "/donor/new", label: "Post food", emoji: "➕" },
    ]);
  return base;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, demoMode, signOut } = useAuth();
  const router = useRouter();
  const links = linksFor(user?.role ?? null);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href={user ? roleHome(user.role) : "/"} className="flex items-center gap-2 font-bold">
            <span aria-hidden="true">🥗</span>
            <span>FoodBridge</span>
          </Link>
          {demoMode && (
            <span className="hidden rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 sm:inline dark:text-amber-400">
              demo mode
            </span>
          )}

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            {!loading && user && <NotificationBell userId={user.id} />}
            <ThemeToggle />
            {!loading && user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm sm:block">
                  <span className="font-medium">{user.name}</span>
                  <span className="ml-1 text-xs text-muted-foreground">
                    · {ROLE_LABEL[user.role]}
                  </span>
                </span>
                <button
                  onClick={() => {
                    void signOut().then(() => router.push("/"));
                  }}
                  className="rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                >
                  Log out
                </button>
              </div>
            ) : !loading ? (
              <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                Sign in
              </Link>
            ) : null}
          </div>
        </div>

        {/* Nav links (client pathname is runtime data → streamed inside Suspense) */}
        <Suspense fallback={null}>
          <NavLinks links={links} loading={loading} />
        </Suspense>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        🥗 FoodBridge MVP · maps © OpenStreetMap contributors
        {demoMode && " · demo data lives in your browser only"}
      </footer>
    </div>
  );
}

function NavLinks({
  links,
  loading,
}: {
  links: Array<{ href: string; label: string; emoji: string }>;
  loading: boolean;
}) {
  const pathname = usePathname();

  if (loading) return null;
  return (
    <>
      <nav aria-label="Main" className="hidden items-center gap-1 px-4 pb-1 md:flex md:px-6 md:absolute md:right-24 md:top-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              pathname === l.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            )}
          >
            <span aria-hidden="true" className="mr-1">{l.emoji}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobile nav */}
      <nav
        aria-label="Mobile"
        className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 md:hidden"
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium",
              pathname === l.href
                ? "bg-primary/10 text-primary"
                : "bg-surface-2 text-muted-foreground"
            )}
          >
            <span aria-hidden="true" className="mr-1">{l.emoji}</span>
            {l.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
