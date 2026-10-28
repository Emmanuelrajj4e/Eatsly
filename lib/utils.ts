export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function uid() {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `${Date.now().toString(36)}-${rnd}`;
}

/** "2h 14m" style remaining time from ms (>0). */
export function fmtTimeLeft(ms: number) {
  if (ms <= 0) return "0m";
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hours < 24) return rem ? `${hours}h ${rem}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

export function fmtRelative(iso: Date | string) {
  const then = new Date(iso).getTime();
  const diff = then - Date.now();
  if (diff > 0) return `in ${fmtTimeLeft(diff)}`;
  return `${fmtTimeLeft(-diff)} ago`;
}

export function fmtDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function fmtDateTime(iso: Date | string) {
  return new Date(iso).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
