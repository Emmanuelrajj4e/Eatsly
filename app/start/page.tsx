import type { Metadata } from "next";
import { Suspense } from "react";
import { RoleChooser } from "@/components/start/role-chooser";

export const metadata: Metadata = {
  title: "Choose your role",
};

export default function StartPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-14" aria-busy="true">
          <div className="h-7 w-40 animate-pulse rounded-full bg-wash" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-44 animate-pulse rounded-card bg-wash" />
            ))}
          </div>
        </div>
      }
    >
      <RoleChooser />
    </Suspense>
  );
}
