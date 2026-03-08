"use client";

import { getDetailTypeStyle } from "../data";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const meta = getDetailTypeStyle(type);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.badge}`}
    >
      {type}
    </span>
  );
}
