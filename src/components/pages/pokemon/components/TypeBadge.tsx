"use client";

import { getMeta } from "../data";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { badge, icon: Icon } = getMeta(type);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge}`}
    >
      <Icon className="h-3 w-3" />
      {type}
    </span>
  );
}
