"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

const ToastContext = createContext<{ toast: (message: string, kind?: ToastKind) => void }>({
  toast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

const icons: Record<ToastKind, string> = { success: "✅", error: "⚠️", info: "🔔" };
const tints: Record<ToastKind, string> = {
  success: "border-emerald-500/40",
  error: "border-rose-500/40",
  info: "border-primary/40",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-xl border-l-4 bg-surface px-4 py-3 text-sm shadow-card animate-fade-up",
              tints[t.kind]
            )}
          >
            <span aria-hidden="true">{icons[t.kind]}</span>
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
