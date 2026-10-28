import { AppShell, Guard } from "@/components/app-shell";
import { DonationForm } from "@/components/donation-form";

export const metadata = { title: "Post surplus food" };

export default function PostDonationPage() {
  return (
    <Guard allowed={["donor", "admin"]}>
      <AppShell>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold">Post surplus food 🍃</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approved NGOs within 10 km are notified the moment you post.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-surface p-6 shadow-card">
            <DonationForm />
          </div>
        </div>
      </AppShell>
    </Guard>
  );
}
