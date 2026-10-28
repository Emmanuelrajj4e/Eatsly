"use client";

import { useEffect, useState } from "react";
import { getAuth, subscribeAuth } from "@/services/auth";
import type { Auth } from "@/services/auth";

/** Auth snapshot; null until the rAF-deferred first read (prerender-safe). */
export function useAuth(): Auth | null {
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAuth(getAuth()));
    const unsub = subscribeAuth((a) => setAuth(a));
    return () => {
      cancelAnimationFrame(id);
      unsub();
    };
  }, []);

  return auth;
}
