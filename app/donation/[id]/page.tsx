import { Suspense } from "react";
import { AppShell, Guard } from "@/components/app-shell";
import { DonationDetail } from "@/components/donation-detail";
import { Skeleton } from "@/components/ui/badge";

export const metadata = { title: "Donation" };

export default function DonationPage(props: PageProps<'/donation/[id]'>) {
  return (
    <Guard>
      <AppShell>
        <Suspense
          fallback={
            <div className="mx-auto max-w-5xl px-4 py-10">
              <Skeleton className="h-72 w-full" />
            </div>
          }
        >
          <DonationDetail id={props.params.then((p) => p.id)} />
        </Suspense>
      </AppShell>
    </Guard>
  );
}
