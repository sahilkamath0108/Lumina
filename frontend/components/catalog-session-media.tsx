"use client";

import Image from "next/image";
import { CatalogVisualPlaceholder } from "@/components/catalog-visual-placeholder";
import { cn } from "@/lib/utils";

type Props = {
  /** Public HTTPS URL (e.g. Supabase Storage) or empty for placeholder */
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export function CatalogSessionMedia({
  src,
  alt,
  className,
  iconClassName,
  sizes = "(max-width: 768px) 100vw, 420px",
  priority = false,
}: Props) {
  const url = typeof src === "string" ? src.trim() : "";
  if (!url) {
    return (
      <CatalogVisualPlaceholder className={className} iconClassName={iconClassName} />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
