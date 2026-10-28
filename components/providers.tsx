"use client";

import { ToastProvider } from "@/components/ui/toast";

/** App-wide client providers (no auth: Eatsly runs on sample data). */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
