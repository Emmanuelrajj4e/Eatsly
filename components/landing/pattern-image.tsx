/**
 * Monochrome placeholder for a photo that is not yet included.
 * Fine grain pattern + caption keep the editorial grid intact.
 * Real files go to public/images/ (see IMAGES_NEEDED.md) and replace this.
 */
export function PatternImage({
  subject,
  ratio = "3 / 2",
  caption,
  className,
}: {
  subject: string;
  ratio?: string;
  caption: string;
  className?: string;
}) {
  return (
    <figure
      className={`photo-wrap relative m-0 w-full ${className ?? ""}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="pattern-image absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0 grid place-items-center p-4 text-center"
        aria-hidden={false}
      >
        <span className="bg-background/0 font-mono text-[11px] uppercase tracking-widest text-foreground [opacity:0.85]">
          {subject}
        </span>
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
    </figure>
  );
}
