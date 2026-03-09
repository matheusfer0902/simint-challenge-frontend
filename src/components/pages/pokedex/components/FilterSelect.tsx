"use client";

import type { ReactNode, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

export interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FilterSelect({ value, onChange, icon, children, className = "" }: FilterSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-7 text-xs font-semibold text-slate-600 outline-none transition focus:border-red-300 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}
