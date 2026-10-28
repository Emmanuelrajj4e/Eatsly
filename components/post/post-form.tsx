"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { buildFormData, PreviewPanel } from "@/components/post/preview";
import { Button } from "@/components/ui/button";
import { DietMarker } from "@/components/ui/diet-marker";
import { useToast } from "@/components/ui/toast";
import { useTicker } from "@/hooks/use-ticker";
import { postListing } from "@/services/listings";
import { MIN_POST_MINUTES, SAFE_WINDOWS } from "@/config/brand";
import rawAreas from "@/data/areas.json";
import type { FoodType } from "@/types";

const AREAS = rawAreas as Array<{ name: string }>;

const schema = z.object({
  title: z.string().trim().min(3, "Give the dish a name (3+ characters).").max(80, "Keep the name under 80 characters."),
  donorName: z.string().trim().min(2, "Tell NGOs who is sending the food."),
  area: z.string().min(1, "Pick an area so the map can place you."),
  type: z.enum(["hot", "sweets", "packaged", "produce"]),
  veg: z.boolean(),
  servings: z.coerce
    .number()
    .int("Whole servings only.")
    .min(1, "At least 1 serving.")
    .max(500, "Split bigger batches into two posts."),
  preparedTime: z.string().regex(/^\d{2}:\d{2}$/, "Set the last-cooked time."),
});

export function PostForm() {
  const nowMs = useTicker() * 1000;
  const toast = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("Rajma-chawal dinner trays");
  const [donorName, setDonorName] = useState("Tech Park Canteen");
  const [area, setArea] = useState("Gachibowli");
  const [type, setType] = useState<FoodType>("hot");
  const [veg, setVeg] = useState(true);
  const [servings, setServings] = useState("45");
  const [preparedTime, setPreparedTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill "10 minutes ago" as the last-cooked time (client-only clock).
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const d = new Date(Date.now() - 10 * 60000);
      setPreparedTime(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const data = {
    title,
    donorName,
    area,
    type,
    veg,
    servings: Number(servings),
    preparedTime,
  };
  const built = buildFormData(data, nowMs);
  const blocked = built ? built.leftMs < MIN_POST_MINUTES * 60000 : false;
  const futureTime =
    built && new Date(built.preparedAt).getTime() > nowMs + 5 * 60000;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        errs[key] ??= issue.message;
      }
      if (futureTime) {
        errs.preparedTime ??= "This time is ahead of now — set the last-cooked time.";
      }
      setErrors(errs);
      return;
    }
    if (!built) {
      setErrors({ preparedTime: "Set the last-cooked time." });
      return;
    }

    const res = postListing({
      title: data.title.trim(),
      donorName: data.donorName.trim(),
      area: data.area,
      type: data.type,
      veg: data.veg,
      servings: parsed.data.servings,
      preparedAt: built.preparedAt,
    });
    if (res.ok) {
      toast("Posted — NGOs can see it on the live board now.", "success");
      router.push("/board");
    } else {
      toast(res.error, "error");
    }
  };

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <form noValidate onSubmit={submit} aria-label="Post surplus food">
        <div className="space-y-4">
          <Field label="Dish" idBase="f-title" error={errors.title}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Veg biryani, 4 trays"
              className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
              aria-invalid={!!errors.title}
              {...(errors.title && { "aria-describedby": "f-title-e" })}
            />
          </Field>

          <Field label="From (donor)" idBase="f-donor" error={errors.donorName}>
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Name shown to NGOs, e.g. Sakina's Function Hall"
              className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
              aria-invalid={!!errors.donorName}
              {...(errors.donorName && { "aria-describedby": "f-donor-e" })}
            />
          </Field>

          <Field label="Area" idBase="f-area" error={errors.area}>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
              aria-invalid={!!errors.area}
              {...(errors.area && { "aria-describedby": "f-area-e" })}
            >
              {AREAS.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>

          <fieldset className="rounded-card border border-line bg-surface p-4">
            <legend className="px-1 font-mono text-xs uppercase tracking-wide text-muted">
              Food type (sets the safe window)
            </legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SAFE_WINDOWS).map(([key, w]) => {
                const sel = type === key;
                return (
                  <label key={key} className="cursor-pointer rounded-btn focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--leaf)]">
                    <input
                      type="radio"
                      name="type"
                      className="sr-only"
                      placeholder={`${w.label}`}
                      checked={sel}
                      onChange={() => setType(key as FoodType)}
                    />
                    <span
                      className={
                        "inline-flex h-11 items-center rounded-full border px-4 font-mono text-[13px] uppercase tracking-wide " +
                        (sel ? "border-transparent bg-foreground text-background" : "border-line bg-background")
                      }
                    >
                      {w.label} · {w.minutes / 60}h
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Servings" idBase="f-serv" error={errors.servings}>
              <input
                type="number"
                min={1}
                max={500}
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
                aria-invalid={!!errors.servings}
                {...(errors.servings && { "aria-describedby": "f-serv-e" })}
              />
            </Field>

            <Field label="Last cooked" idBase="f-time" error={errors.preparedTime}>
              <input
                type="time"
                value={preparedTime}
                onChange={(e) => setPreparedTime(e.target.value)}
                className="h-11 w-full rounded-btn border border-line bg-surface px-3 text-foreground"
                aria-invalid={!!errors.preparedTime}
                {...(errors.preparedTime && { "aria-describedby": "f-time-e" })}
              />
            </Field>
          </div>

          <fieldset className="rounded-card border border-line bg-surface p-4">
            <legend className="px-1 font-mono text-xs uppercase tracking-wide text-muted">Diet marker</legend>
            <div className="flex gap-2">
              {[
                { label: "Veg", value: true },
                { label: "Non-veg", value: false },
              ].map((o) => {
                const sel = veg === o.value;
                return (
                  <label key={o.label} className="cursor-pointer rounded-btn focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--leaf)]">
                    <input
                      type="radio"
                      name="veg"
                      className="sr-only"
                      checked={sel}
                      onChange={() => setVeg(o.value)}
                    />
                    <span
                      className={
                        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm " +
                        (sel ? "border-transparent bg-foreground text-background" : "border-line bg-background")
                      }
                    >
                      <DietMarker veg={o.value} withLabel={false} />
                      {o.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          {blocked && (
            <p role="alert" className="rounded-card border border-chilli/50 bg-chilli/[0.06] px-3 py-2 text-sm text-foreground">
              Too late for the board: under {MIN_POST_MINUTES} minutes of safe window left.
              Serve this fresh — posting is blocked so NGOs never chase food that spoils first.
            </p>
          )}
          {futureTime && !blocked && (
            <p role="status" className="rounded-card border border-amber/50 bg-amber/[0.08] px-3 py-2 text-sm text-foreground">
              The last-cooked time looks ahead of right now. Posting still works for the demo,
              but pick the actual time to make the preview honest.
            </p>
          )}

          <Button type="submit" variant="primary" disabled={blocked} className="w-full sm:w-auto sm:px-8">
            Post to the board
          </Button>
        </div>
      </form>

      <PreviewPanel data={data} nowMs={nowMs} />
    </div>
  );
}

function Field({
  label,
  idBase,
  error,
  children,
}: {
  label: string;
  idBase: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
      {error && (
        <span id={`${idBase}-e`} role="alert" className="mt-1 block text-xs font-medium text-chilli">
          {error}
        </span>
      )}
    </label>
  );
}
