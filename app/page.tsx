import Link from "next/link";
import { LandingCounters } from "@/components/landing-counters";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonClasses } from "@/components/ui/button-styles";
import { Card } from "@/components/ui/card";

const steps = [
  {
    emoji: "📸",
    title: "Post surplus in 60 seconds",
    body: "Snap a photo, say what it is, servings, packed time and safe-consume-by. We handle validation and expiry timers.",
  },
  {
    emoji: "🔔",
    title: "Nearby NGOs get notified",
    body: "Receivers see new donations on a live map, filtered by distance, food type and time left — then claim in one tap.",
  },
  {
    emoji: "🛵",
    title: "Volunteer picks up & delivers",
    body: "A volunteer accepts the pickup, delivery status is tracked in real time, and impact is recorded: meals, kg and CO₂ avoided.",
  },
];

const roles = [
  { emoji: "🍽️", title: "Donor", body: "Restaurants, hostels, caterers, events, you.", role: "donor" },
  { emoji: "🤝", title: "NGO / Receiver", body: "Browse nearby food and claim what you can use.", role: "ngo" },
  { emoji: "🛵", title: "Volunteer", body: "Move food from donor to people who need it.", role: "volunteer" },
  { emoji: "🛡️", title: "Admin", body: "Approve NGOs, keep listings safe, watch impact.", role: "admin" },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-40 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-20 sm:px-6 lg:flex-row-reverse lg:pt-24">
          <div className="relative w-full max-w-sm animate-float lg:w-[38%]">
            {/* Floating demo cards */}
            <Card className="relative z-10 rotate-2 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-surface-2 text-2xl" aria-hidden="true">🍛</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Veg thali extra, 40 servings</p>
                  <p className="text-xs text-muted-foreground">Annapurna Mess · 2.1 km</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">VEG</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">⏳ 2h 40m left</span>
              </div>
            </Card>
            <Card className="-mt-6 -rotate-2 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-surface-2 text-2xl" aria-hidden="true">🍞</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Evening bakery, 25 packs</p>
                  <p className="text-xs text-muted-foreground">Sunrise Cafe · 0.8 km</p>
                </div>
                <span className="text-xs font-semibold text-primary">Open</span>
              </div>
            </Card>
            <Card className="ml-8 mt-2 rotate-3 p-3">
              <p className="text-sm font-semibold text-primary">🏆 1,842 meals served</p>
              <p className="text-xs text-muted-foreground">this week in your city</p>
            </Card>
          </div>

          <div className="max-w-xl animate-fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              🌱 Free for NGOs · No paid APIs · OpenStreetMap
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Good food finds <span className="text-primary">people</span>, not
              the <span className="text-accent">bin</span>.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              FoodBridge connects surplus-food donors with nearby NGOs and
              volunteers — claim, pick up, deliver, and see the meals, kilos
              and CO₂ you saved.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login?role=donor" className={buttonClasses("primary", "lg")}>
                🍃 Donate food
              </Link>
              <Link href="/login?role=ngo" className={buttonClasses("outline", "lg")}>
                🤝 Join as NGO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live impact (reads the app's real data layer) */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
        <LandingCounters />
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">How it works</h2>
        <p className="mt-2 text-center text-muted-foreground">
          From extra plates on your counter to meals served — in three steps.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.title} className="relative p-6">
              <span
                aria-hidden="true"
                className="absolute right-4 top-4 text-4xl font-black text-primary/10"
              >
                {i + 1}
              </span>
              <span className="text-3xl" aria-hidden="true">{s.emoji}</span>
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <Link
              key={r.role}
              href={`/login?role=${r.role}`}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-transform hover:-translate-y-1 hover:border-primary/40"
            >
              <span className="text-2xl" aria-hidden="true">{r.emoji}</span>
              <p className="mt-2 font-semibold">
                {r.title}
                <span aria-hidden="true" className="ml-1 inline-block opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100">→</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>
            🥗 <span className="font-semibold text-foreground">FoodBridge</span> —
            built as an MVP. Maps © OpenStreetMap contributors.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hover:text-foreground">Sign in</Link>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </main>
  );
}
