"use client";

import type { ReactNode } from "react";
import { useCountUp } from "../useHandler";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon: ReactNode;
  animate: boolean;
}

export function StatBar({
  label,
  value,
  max = 200,
  color,
  icon,
  animate,
}: StatBarProps) {
  const displayed = useCountUp(value, 900, animate);

  const pct = (displayed / max) * 100;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color} text-white shadow-sm`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {label}
          </span>
          <span className="font-pixel text-[11px] text-slate-700">{displayed}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
