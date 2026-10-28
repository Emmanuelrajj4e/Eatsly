"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/icons";

type Tone = "success" | "error" | "info";

export interface ToastItem {
  id: number;
  message: string;
  tone: Tone;
}

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

/** Announce confirmations politely; screen readers hear them without focus moves. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const show = useCallback((message: string, tone: Tone = "success") => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-card border bg-surface px-4 py-3 text-sm shadow-[var(--shadow-selected)] fade-up",
              t.tone === "success" && "border-leaf/40",
              t.tone === "error" && "border-chilli/50",
              t.tone === "info" && "border-line",
            )}
          >
            {t.tone === "success" && <CheckIcon className="h-5 w-5 shrink-0 text-leaf" />}
            {t.tone === "error" && <AlertIcon className="h-5 w-5 shrink-0 text-chilli" />}
            {t.tone === "info" && <InfoIcon className="h-5 w-5 shrink-0 text-muted" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
