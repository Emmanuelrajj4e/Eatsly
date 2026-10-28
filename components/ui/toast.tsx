"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { Check, CircleAlert, Info } from "lucide-react";

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

/** Announce confirmations politely; icons are form (glyph ≠ colour-only). */
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
              "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-card border bg-background px-4 py-3 text-sm fade-up",
              t.tone === "success" && "border-line-strong",
              t.tone === "error" && "border-foreground border-2",
              t.tone === "info" && "border-line",
            )}
          >
            {t.tone === "success" && <Check className="h-5 w-5 shrink-0" strokeWidth={1.5} />}
            {t.tone === "error" && <CircleAlert className="h-5 w-5 shrink-0" strokeWidth={1.5} />}
            {t.tone === "info" && <Info className="h-5 w-5 shrink-0" strokeWidth={1.5} />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
