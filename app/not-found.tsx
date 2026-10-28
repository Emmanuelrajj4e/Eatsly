import Link from "next/link";
import { ClockIcon } from "@/components/icons";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 text-center">
      <div>
        <ClockIcon className="mx-auto h-10 w-10 text-muted" />
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-2 max-w-sm text-sm text-muted">
          That page moved or never existed. The clock waits for no meal — head back to the live board.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/board" className={buttonStyles("primary", "md")}>
            Live board
          </Link>
          <Link href="/" className={buttonStyles("secondary", "md")}>
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
