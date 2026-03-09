"use client";

import { DETAIL_STAT_MAX } from "../data";

export interface StatBarProps {
  label: string;
  value: number;
  animate: boolean;
  maxStat?: number;
}

export function StatBar({ label, value, animate, maxStat = DETAIL_STAT_MAX }: StatBarProps) {
  const pct = Math.min((value / maxStat) * 100, 100);
  const color =
    value >= 120
      ? "from-emerald-400 to-green-500"
      : value >= 90
        ? "from-blue-400 to-blue-500"
        : value >= 60
          ? "from-amber-400 to-yellow-500"
          : value >= 40
            ? "from-orange-400 to-orange-500"
            : "from-red-400 to-red-500";
  return (
    <div className="grid grid-cols-[52px_1fr_34px] items-center gap-3">
      <span className="text-right font-pixel text-[7px] uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 shadow-inner">
        <div
          className={`relative h-full overflow-hidden rounded-full bg-gradient-to-r ${color} transition-all ease-out`}
          style={{ width: animate ? `${pct}%` : "0%", transitionDuration: "0.9s" }}
        >
          <div className="absolute inset-0 animate-statShimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
      <span className="font-pixel text-[9px] tabular-nums text-slate-700">{value}</span>
    </div>
  );
}
