"use client";

import Link from "next/link";
import { useState } from "react";
import { Button as ButtonEl } from "@/components/ui/button";
import { buttonClasses } from "@/components/ui/button-styles";
import { useToast } from "@/components/ui/toast";
import { CATEGORY_META } from "@/lib/constants";
import {
  acceptPickupTask,
  cancelDonation,
  claimDonation,
  effectiveStatus,
  markDelivered,
  markPickedUp,
  reportDonation,
} from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { fmtDistance } from "@/lib/utils";
import type { Donation } from "@/types";

/** Role-aware action strip shown on the donation detail page. */
export function DetailActions({
  d,
  distanceKm,
  mutate,
}: {
  d: Donation;
  distanceKm: number | null;
  mutate: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState("");
  const status = effectiveStatus(d);

  async function run(label: string, fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
      toast(label);
      mutate();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Action failed", "error");
    } finally {
      setBusy(false);
    }
  }

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-surface-2 p-4">
        <p className="text-sm font-medium">Sign in to interact with this listing.</p>
        <Link href={`/login?next=/donation/${d.id}`} className={buttonClasses("primary", "sm")}>
          Sign in
        </Link>
      </div>
    );
  }

  const isDonor = user.id === d.donorId;
  const isNgoAssigned = user.id === d.ngoId;
  const isVolunteer = user.id === d.volunteerId;
  const meta = CATEGORY_META[d.category as keyof typeof CATEGORY_META];

  return (
    <div className="space-y-4">
      {status === "available" &&
        user.role === "ngo" &&
        (user.approved ? (
          <ButtonEl
            loading={busy}
            className="w-full"
            onClick={() =>
              run("Claimed! Arrange pickup at the donor's address 🤝", async () => {
                await claimDonation(d.id, user);
              })
            }
          >
            🤝 Claim this donation
          </ButtonEl>
        ) : (
          <p className="rounded-xl bg-amber-500/10 p-3 text-center text-sm text-amber-600 dark:text-amber-400">
            Your NGO awaits admin approval before it can claim listings.
          </p>
        ))}

      {status === "available" && user.role === "donor" && !isDonor && (
        <p className="text-center text-sm text-muted-foreground">
          Only approved NGOs can claim donations. Volunteers can follow along.
        </p>
      )}

      {status === "claimed" && !d.volunteerId && user.role === "volunteer" && (
        <ButtonEl
          loading={busy}
          className="w-full"
          onClick={() =>
            run("You're assigned — pickup soon 🛵", async () => {
              await acceptPickupTask(d.id, user);
            })
          }
        >
          🛵 Accept pickup task
        </ButtonEl>
      )}

      {status === "claimed" && d.volunteerId === user.id && (
        <ButtonEl
          loading={busy}
          className="w-full"
          onClick={() =>
            run("Picked up 📦", async () => {
              await markPickedUp(d.id);
            })
          }
        >
          📦 I picked it up
        </ButtonEl>
      )}

      {status === "picked_up" && d.volunteerId === user.id && (
        <ButtonEl
          loading={busy}
          className="w-full"
          onClick={() =>
            run("Delivered — impact recorded 🌱", async () => {
              await markDelivered(d.id);
            })
          }
        >
          ✅ Mark delivered (impact recorded)
        </ButtonEl>
      )}

      {isDonor && status === "available" && (
        <ButtonEl
          variant="ghost"
          className="w-full text-rose-600 hover:bg-rose-500/10"
          loading={busy}
          onClick={() =>
            run("Listing cancelled", async () => {
              await cancelDonation(d.id);
            })
          }
        >
          Cancel listing
        </ButtonEl>
      )}

      {(isDonor || isNgoAssigned || isVolunteer) && (
        <div className="rounded-xl bg-surface-2 p-4 text-sm">
          <p className="font-medium">People involved</p>
          <ul className="mt-1 space-y-0.5 text-muted-foreground">
            <li>🍽️ Donor: {d.donorName}</li>
            {d.ngoName && <li>🤝 Claimed by: {d.ngoName}</li>}
            {d.volunteerName && <li>🛵 Volunteer: {d.volunteerName}</li>}
          </ul>
        </div>
      )}

      {user.role !== "admin" && (
        <div>
          {reporting ? (
            <div className="space-y-2 rounded-xl border border-border p-4">
              <label htmlFor="reason" className="text-sm font-medium">
                What is wrong with this listing?
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface p-2 text-sm"
                rows={2}
                placeholder="e.g. address wrong / looks expired"
              />
              <div className="flex gap-2">
                <ButtonEl
                  size="sm"
                  loading={busy}
                  disabled={reason.trim().length < 5}
                  onClick={() =>
                    run("Report sent to admin 🛡️", async () => {
                      await reportDonation(d, user, reason.trim());
                      setReporting(false);
                    })
                  }
                >
                  Send report
                </ButtonEl>
                <ButtonEl size="sm" variant="ghost" onClick={() => setReporting(false)}>
                  Never mind
                </ButtonEl>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-rose-600"
              onClick={() => setReporting(true)}
            >
              ⚠️ Report this listing
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span aria-hidden="true">{meta?.emoji} {meta?.label}</span>
        {distanceKm != null && <span>{fmtDistance(distanceKm)} from you</span>}
      </div>
    </div>
  );
}
