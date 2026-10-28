import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p aria-hidden="true" className="text-6xl">🍽️</p>
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for moved or never existed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
