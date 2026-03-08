"use client";

import { TYPE_COLORS } from "../data";

export function TypeBadge({ type }: { type: string }) {
  const cls = TYPE_COLORS[type] ?? TYPE_COLORS.normal;
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${cls}`}
    >
      {type}
    </span>
  );
}
