"use client";

import { getTypeMeta, TYPE_SLUG_TO_NAME } from "../data";

export interface TypeBadgeProps {
  slug: string;
  className?: string;
}

export function TypeBadge({ slug, className = "" }: TypeBadgeProps) {
  const m = getTypeMeta(slug);
  const name = TYPE_SLUG_TO_NAME[slug] ?? slug;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide ${m.badge} ${className}`}
    >
      <span className="text-[8px]">{m.icon}</span> {name}
    </span>
  );
}
