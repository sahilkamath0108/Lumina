import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

/** Replaces product/session photos — no external or uploaded catalog images. */
export function CatalogVisualPlaceholder({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground flex items-center justify-center rounded-md border border-dashed",
        className
      )}
      aria-hidden
    >
      <CalendarDays className={cn("h-8 w-8", iconClassName)} />
    </div>
  );
}
