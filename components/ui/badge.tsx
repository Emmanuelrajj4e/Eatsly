import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "warning" | "danger" | "info";

const variants: Record<Variant, string> = {
  default: "bg-primary/10 text-primary dark:text-emerald-300",
  outline: "border border-border text-muted-foreground",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export function Badge({
  variant = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-lg bg-surface-2",
        className
      )}
      {...props}
    />
  );
}
