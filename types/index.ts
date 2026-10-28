export type Role = "donor" | "ngo" | "volunteer" | "admin";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: Role;
  orgName?: string; // for NGOs
  approved: boolean; // NGOs need admin approval before they can claim
  address?: string;
  lat?: number;
  lng?: number;
  createdAt: string; // ISO
}

export type DonationCategory = string;

export type DonationStatus =
  | "available"
  | "claimed"
  | "picked_up"
  | "delivered"
  | "expired"
  | "cancelled";

export interface Donation {
  id: string;
  title: string;
  description: string;
  category: DonationCategory;
  isVeg: boolean;
  servings: number;
  kg: number;
  packedAt: string; // ISO
  bestBefore: string; // ISO — expiry / safe-consume-by
  address: string;
  lat: number;
  lng: number;
  photoUrl?: string | null;
  donorId: string;
  donorName: string;
  ngoId?: string | null;
  ngoName?: string | null;
  volunteerId?: string | null;
  volunteerName?: string | null;
  status: DonationStatus;
  createdAt: string; // ISO
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  donationId?: string;
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  donationId: string;
  donationTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  status: "open" | "resolved";
  createdAt: string;
}

export interface ImpactStats {
  meals: number;
  kg: number;
  co2: number;
  deliveries: number;
  activeListings: number;
  partnerNgos: number;
}
