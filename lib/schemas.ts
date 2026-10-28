import { z } from "zod";
import { FOOD_CATEGORIES } from "@/lib/constants";

export const donationSchema = z
  .object({
    title: z.string().trim().min(5, "Give the food a clear name (min 5 chars)").max(90),
    description: z.string().trim().max(400).optional().or(z.literal("")),
    category: z.enum(FOOD_CATEGORIES),
    isVeg: z.union([z.literal(true), z.literal(false)], {
      message: "Tell receivers if the food is veg or non-veg",
    }),
    servings: z.coerce
      .number({ message: "Servings must be a number" })
      .int("Servings must be a whole number")
      .min(1, "At least 1 serving")
      .max(2000, "Split very large batches into multiple listings"),
    kg: z.coerce
      .number({ message: "Weight must be a number" })
      .min(0.1, "Estimate at least 0.1 kg")
      .max(500, "That's a truckload — split it?"),
    packedAt: z.string().min(1, "When was the food packed?"),
    bestBefore: z.string().min(1, "Until when is this safe to distribute?"),
    address: z
      .string()
      .trim()
      .min(8, "Add a pickup address (area, landmark)"),
    photoUrl: z.string().optional().nullable(),
  })
  .refine((v) => new Date(v.bestBefore) > new Date(v.packedAt), {
    message: "Safe-consume-by must be after packed time",
    path: ["bestBefore"],
  })
  .refine((v) => new Date(v.bestBefore).getTime() <= Date.now() + 48 * 3600e3, {
    message: "For safety, listings cannot run beyond 48 hours after packing",
    path: ["bestBefore"],
  });

export type DonationFormValues = z.infer<typeof donationSchema>;
