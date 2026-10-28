/**
 * Flat colour placeholder for a photo that is not yet included.
 * Tone = one of the brand tints; a soft white weave + subject label keep
 * the grid readable. Real files go to public/images/ (see IMAGES_NEEDED.md).
 */
type Tone = "orange" | "green" | "blue" | "yellow" | "neutral";

const TONES: Record<Tone, { bg: string; chip: string }> = {
  orange: { bg: "var(--orange-tint)", chip: "bg-orange-tint" },
  green: { bg: "var(--green-tint)", chip: "bg-green-tint" },
  blue: { bg: "var(--blue-tint)", chip: "bg-blue-tint" },
  yellow: { bg: "var(--yellow-tint)", chip: "bg-yellow-tint" },
  neutral: { bg: "var(--line)", chip: "bg-line" },
};

export function PatternImage({
  subject,
  ratio = "3 / 2",
  caption,
  tone = "neutral",
  className,
}: {
  subject: string;
  ratio?: string;
  caption?: string;
  tone?: Tone;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <figure
      className={`photo-wrap relative m-0 w-full ${className ?? ""}`}
      style={{ aspectRatio: ratio, backgroundColor: t.bg }}
    >
      <div className="pattern-image absolute inset-0" aria-hidden="true" />
      <div className="absolute inset-0 grid place-items-center p-4 text-center" aria-hidden="false">
        <span className="rounded-full bg-white/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-ink/80">
          {subject}
        </span>
      </div>
      {caption && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}
