"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { donationSchema } from "@/lib/schemas";
import { FOOD_CATEGORIES, CATEGORY_META, DEFAULT_CENTER } from "@/lib/constants";
import { createDonation, uploadDonationPhoto } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/input";
import type { FoodCategory } from "@/lib/constants";

/** Donation posting form: validation, loading + error states, photo upload. */
export function DonationForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [values, setValues] = useState(() => ({
    title: "",
    description: "",
    category: FOOD_CATEGORIES[0] as FoodCategory,
    isVeg: true,
    servings: 10,
    kg: 2.5,
    packedAt: "",
    bestBefore: "",
    address: "",
    photoUrl: null as string | null,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [emptyError, setEmptyError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const localValue = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

  // Sensible datetime defaults once mounted (deferred out of the effect
  // body to avoid a synchronous setState; client-only, SSR-safe).
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const now = new Date();
      setValues((v) => ({
        ...v,
        packedAt: localValue(new Date(now.getTime() - 2 * 3600e3)),
        bestBefore: localValue(new Date(now.getTime() + 4 * 3600e3)),
        address: v.address || user?.address || "",
      }));
    });
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof typeof values>(key: K, val: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function onPickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      setEmptyError("Photo is over 8 MB — pick a smaller one.");
      return;
    }
    setEmptyError(null);
    try {
      const url = await uploadDonationPhoto(file, user?.id ?? "anon");
      set("photoUrl", url);
    } catch {
      setEmptyError("Photo upload failed — listing can be posted without a photo.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmptyError(null);
    const parsed = donationSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    if (!user) {
      setEmptyError("Your session expired — sign in again.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await createDonation(
        {
          ...parsed.data,
          description: parsed.data.description ?? "",
          packedAt: new Date(values.packedAt).toISOString(),
          bestBefore: new Date(values.bestBefore).toISOString(),
          photoUrl: values.photoUrl,
          lat: user.lat || DEFAULT_CENTER.lat,
          lng: user.lng || DEFAULT_CENTER.lng,
        },
        user
      );
      toast("Listing posted — nearby NGOs notified 🔔");
      router.push(`/donation/${created.id}`);
    } catch (err) {
      setEmptyError(err instanceof Error ? err.message : "Could not post the listing");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div>
        <Label htmlFor="title">What food is it? *</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Veg thali extra — rice, sambar, curd"
          aria-invalid={!!errors.title}
        />
        <FieldError>{errors.title}</FieldError>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          value={values.category}
          onChange={(e) => set("category", e.target.value as FoodCategory)}
        >
          {FOOD_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label>Veg or non-veg? *</Label>
        <div className="flex gap-2" role="radiogroup" aria-label="Food type">
          {[
            { veg: true, label: "🟢 Veg" },
            { veg: false, label: "🔴 Non-veg" },
          ].map((o) => (
            <button
              key={String(o.veg)}
              type="button"
              role="radio"
              aria-checked={values.isVeg === o.veg}
              onClick={() => set("isVeg", o.veg)}
              className={
                "rounded-xl border px-4 py-2 text-sm font-medium transition-colors " +
                (values.isVeg === o.veg
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface-2")
              }
            >
              {o.label}
            </button>
          ))}
        </div>
        <FieldError>{errors.isVeg}</FieldError>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="servings">Servings *</Label>
          <Input
            id="servings"
            type="number"
            min={1}
            value={values.servings}
            onChange={(e) => set("servings", Number(e.target.value))}
            aria-invalid={!!errors.servings}
          />
          <FieldError>{errors.servings}</FieldError>
        </div>
        <div>
          <Label htmlFor="kg">Weight (kg) *</Label>
          <Input
            id="kg"
            type="number"
            min={0.1}
            step={0.1}
            value={values.kg}
            onChange={(e) => set("kg", Number(e.target.value))}
            aria-invalid={!!errors.kg}
          />
          <FieldError>{errors.kg}</FieldError>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="packedAt">Packed at *</Label>
          <Input
            id="packedAt"
            type="datetime-local"
            value={values.packedAt}
            max={localValue(new Date())}
            onChange={(e) => set("packedAt", e.target.value)}
            aria-invalid={!!errors.packedAt}
          />
          <FieldError>{errors.packedAt}</FieldError>
        </div>
        <div>
          <Label htmlFor="bestBefore">Safe consume-by *</Label>
          <Input
            id="bestBefore"
            type="datetime-local"
            value={values.bestBefore}
            onChange={(e) => set("bestBefore", e.target.value)}
            aria-invalid={!!errors.bestBefore}
          />
          <FieldError>{errors.bestBefore}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="address">Pickup address (area + landmark) *</Label>
        <Input
          id="address"
          value={values.address}
          onChange={(e) => set("address", e.target.value)}
          placeholder="e.g. Shop 12, Kothaguda X roads, near Botanical Garden"
          aria-invalid={!!errors.address}
        />
        <FieldError>{errors.address}</FieldError>
        <p className="mt-1 text-xs text-muted-foreground">
          Demo builds use your default city centre for the map pin.
          {/* TODO: geocoding (free OpenStreetMap Nominatim) to place the pin from the address */}
        </p>
      </div>

      <div>
        <Label htmlFor="photo">Photo (optional but recommended)</Label>
        <input
          ref={fileRef}
          id="photo"
          type="file"
          accept="image/*"
          onChange={onPickPhoto}
          className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-2 file:text-sm file:font-medium"
        />
        {values.photoUrl && (
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={values.photoUrl}
              alt="Preview of selected food photo"
              className="size-16 rounded-xl object-cover"
            />
            <button
              type="button"
              className="text-xs text-rose-600 hover:underline"
              onClick={() => {
                set("photoUrl", null);
                if (fileRef.current) fileRef.current.value = "";
              }}
            >
              Remove photo
            </button>
          </div>
        )}
        <FieldError>{errors.photoUrl}</FieldError>
      </div>

      <div>
        <Label htmlFor="description">Anything the receiver should know?</Label>
        <Textarea
          id="description"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Sealed containers kept warm; needs cold carry for curd."
        />
        <FieldError>{errors.description}</FieldError>
      </div>

      <FieldError>{emptyError ?? undefined}</FieldError>

      <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-auto">
        🍃 Post this donation
      </Button>
    </form>
  );
}
