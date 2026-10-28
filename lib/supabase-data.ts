import { getSupabase } from "@/lib/supabase";
import type {
  Donation,
  ImpactStats,
  Notification,
  Profile,
  Report,
} from "@/types";

/**
 * Supabase implementation of the data API. Table rows mirror the TS types
 * (quoted camelCase columns, see supabase/migrations). Every query relies on
 * RLS for authorization — the client runs with the signed-in user's JWT.
 */

const sb = () => getSupabase()!;

export async function pullDonations(): Promise<Donation[]> {
  const { data, error } = await sb()
    .from("donations")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Donation[];
}

export async function getDonationById(id: string): Promise<Donation | null> {
  const { data, error } = await sb()
    .from("donations")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as unknown as Donation | null;
}

export async function insertDonation(input: Donation): Promise<Donation> {
  const { data, error } = await sb()
    .from("donations")
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as Donation;
}

export async function patchDonationRow(
  id: string,
  patch: Partial<Donation>
): Promise<Donation> {
  const { data, error } = await sb()
    .from("donations")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as unknown as Donation;
}

export async function uploadDonationPhoto(file: File, donorId: string): Promise<string> {
  const bucket = "donation-photos";
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${donorId}/${Date.now()}-${safeName}`;
  const { error } = await sb().storage
    .from(bucket)
    .upload(path, file, { upsert: false, cacheControl: "3600" });
  if (error) throw new Error(error.message);
  return sb().storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/* ---------------- profiles ---------------- */

export async function fetchNgos(): Promise<Profile[]> {
  const { data, error } = await sb()
    .from("profiles")
    .select('*')
    .eq("role", "ngo")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Profile[];
}

export async function updateProfile(id: string, patch: Partial<Profile>): Promise<void> {
  const { error } = await sb().from("profiles").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------- notifications ---------------- */

export async function fetchNotificationsFor(userId: string): Promise<Notification[]> {
  const { data, error } = await sb()
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Notification[];
}

export async function pushNotification(n: Omit<Notification, "id">): Promise<void> {
  const { error } = await sb().from("notifications").insert(n);
  if (error) throw new Error(error.message);
}

export async function markNotificationsRead(userId: string): Promise<void> {
  const { error } = await sb()
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);
  if (error) throw new Error(error.message);
}

/* ---------------- reports ---------------- */

export async function fetchReports(): Promise<Report[]> {
  const { data, error } = await sb()
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Report[];
}

export async function createReport(r: Omit<Report, "id">): Promise<void> {
  const { error } = await sb().from("reports").insert(r);
  if (error) throw new Error(error.message);
}

export async function setReportStatus(id: string, status: Report["status"]): Promise<void> {
  const { error } = await sb().from("reports").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

/* ---------------- realtime ---------------- */

export function onDonationsChanged(cb: () => void): () => void {
  const client = getSupabase();
  if (!client) return () => {};
  const chan = client
    .channel("donations-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "donations" },
      () => cb()
    )
    .subscribe();
  return () => {
    void client.removeChannel(chan);
  };
}

/* ---------------- aggregate reads (client-side reduction for MVP) ---------------- */

export async function computeImpact(): Promise<ImpactStats> {
  const [donations, ngos] = await Promise.all([
    pullDonations(),
    fetchNgos(),
  ]);
  return summarize(donations, ngos);
}

export function summarize(donations: Donation[], ngos: Profile[]): ImpactStats {
  const delivered = donations.filter((d) => d.status === "delivered");
  const kg = delivered.reduce((s, d) => s + (d.kg || 0), 0);
  const meals = delivered.reduce((s, d) => s + (d.servings || 0), 0);
  return {
    meals,
    kg,
    co2: kg * CO2_FACTOR,
    deliveries: delivered.length,
    activeListings: donations.filter((d) => d.status === "available").length,
    partnerNgos: ngos.filter((n) => n.approved).length,
  };
}

const CO2_FACTOR = 2.5;
