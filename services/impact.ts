import impactData from "@/data/impact.json";
import { getBoard, subscribe as subscribeBoard } from "@/services/listings";
import { KG_PER_SERVING } from "@/config/brand";
import type { ImpactStats } from "@/types";

const DAYS = impactData.days as Array<{ label: string; meals: number }>;

function isToday(iso: string | undefined, nowMs: number) {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date(nowMs).toDateString();
}

/** Live impact numbers: seed baseline + everything delivered on this board. */
export function getImpact(nowMs = Date.now()): ImpactStats {
  const board = getBoard(nowMs);
  const open = board.filter((l) => l.status === "open");
  const delivered = board.filter((l) => l.status === "delivered");

  const deliveredToday = delivered
    .filter((l) => isToday(l.deliveredAt, nowMs))
    .reduce((sum, l) => sum + l.servings, 0);

  const waiting = open.reduce((sum, l) => sum + l.servings, 0);

  const dayIndex = (new Date(nowMs).getDay() + 6) % 7; // Mon..Sun
  const last7Days = DAYS.map((d, i) =>
    i === dayIndex ? d.meals + deliveredToday : d.meals,
  );

  return {
    mealsRescuedToday: impactData.mealsTodayBase + deliveredToday,
    servingsWaitingNow: waiting,
    kgSaved: impactData.kgSavedBase + delivered.reduce((sum, l) => sum + l.servings, 0) * KG_PER_SERVING,
    last7Days,
  };
}

/** Same notifications as the board (claims change waiting, deliveries move counters). */
export function subscribeImpact(fn: (stats: ImpactStats) => void): () => void {
  return subscribeBoard(() => {
    fn(getImpact());
  });
}
