"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

/** Disclosure accordion: one open at a time, keyboard and aria wired. */
export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-${item.id}`}
                onClick={() => setOpenId(open ? null : item.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left",
                  "font-display text-base font-semibold leading-snug hover:bg-wash",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]",
                )}
              >
                <span>{item.question}</span>
                <Plus
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    open && "rotate-45",
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </h3>
            <div
              id={`faq-${item.id}`}
              role="region"
              hidden={!open}
              className="pb-5 text-sm leading-7 text-muted"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
