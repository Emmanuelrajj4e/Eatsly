"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  /** Visible panel title; wired as aria-labelledby. */
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accessible modal: Escape/click-outside closes, focus enters the panel,
 * Tab cycles inside, and focus returns to the opener on close.
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);
  const titleId = `dlg-${title.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const panel = panelRef.current;
    if (panel) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const focus = () => panel.focus();
      const id = requestAnimationFrame(focus);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
          return;
        }
        if (e.key !== "Tab" || !panelRef.current) return;
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => {
        cancelAnimationFrame(id);
        document.removeEventListener("keydown", onKey);
        document.body.style.overflow = prevOverflow;
        const opener = openerRef.current;
        if (opener instanceof HTMLElement) opener.focus();
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-foreground/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
          "max-h-[85vh] overflow-auto rounded-card border border-line-strong bg-background p-5 fade-up",
          className,
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-line pb-3">
          <h2 id={titleId} className="font-display text-lg font-bold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="grid h-11 w-11 -mr-2 -mt-3 shrink-0 cursor-pointer place-items-center border border-transparent text-foreground hover:border-line hover:bg-wash"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
