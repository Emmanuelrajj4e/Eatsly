import { CITY } from "@/config/brand";
import { Tag } from "@/components/ui/chip";
import data from "@/data/city.json";

const AREAS = data as Array<{ area: string; donors: number; ngos: number }>;

/** Areas of the pilot city with sample donor / NGO counts. */
export function CityBreakdown() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14" aria-label={`${CITY} areas`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="max-w-xl">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Where food is moving
          </h2>
          <p className="mt-2 text-muted">
            Eleven neighbourhoods in {CITY} already have donors and NGOs on the board —
            from the market rows of Secunderabad to the tech canteens of Gachibowli.
          </p>
        </div>
        <Tag>sample data</Tag>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {AREAS.map((a) => (
          <li key={a.area}>
            <div className="h-full rounded-card border border-line bg-surface p-4">
              <h3 className="font-display text-base font-semibold">{a.area}</h3>
              <p className="mt-2 font-mono text-xs text-muted">
                {a.donors} donors · {a.ngos} NGOs
              </p>
              <div
                className="mt-3 h-1.5 rounded-full bg-line"
                role="img"
                aria-label={`${a.area}: ${a.donors} donors, ${a.ngos} NGOs`}
              >
                <div
                  className="h-full rounded-full bg-leaf"
                  style={{ width: `${Math.min(100, (a.donors / 14) * 100)}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
