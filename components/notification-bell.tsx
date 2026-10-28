"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchNotifications, markNotificationsRead, subscribeDonations } from "@/lib/data";
import { fmtRelative, cn } from "@/lib/utils";

export function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Awaited<ReturnType<typeof fetchNotifications>>>([]);
  const ref = useRef<HTMLDivElement>(null);

  const load = useCallback(
    () => fetchNotifications(userId).then(setItems),
    [userId]
  );

  useEffect(() => {
    void load();
    return subscribeDonations(load);
  }, [load]);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  function openBell() {
    setOpen(true);
    if (items.some((n) => !n.read)) {
      void markNotificationsRead(userId).then(load);
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications (${unread} unread)`}
        onClick={open ? () => setOpen(false) : openBell}
        className="relative flex size-9 items-center justify-center rounded-full border border-border bg-surface hover:bg-surface-2"
      >
        <span aria-hidden="true">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid size-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="fixed inset-x-3 top-16 z-50 max-h-96 overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-card sm:absolute sm:inset-x-auto sm:right-0 sm:top-11 sm:w-96 animate-fade-up"
        >
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications yet — actions you take will appear here.
            </p>
          ) : (
            <ul>
              {items.map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.donationId ? `/donation/${n.donationId}` : "#"}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-2 transition-colors hover:bg-surface-2",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      {!n.read && <span aria-hidden="true" className="size-2 rounded-full bg-primary" />}
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-xs text-muted-foreground/70">
                      {fmtRelative(n.createdAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
