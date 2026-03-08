"use client";

import { Filter } from "lucide-react";
import { FILTER_OPTIONS } from "../data";
import type { FilterOption } from "../types";

interface FilterBarProps {
  active: FilterOption;
  onChange: (f: FilterOption) => void;
  counts: Record<FilterOption, number>;
}

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          <Filter className="h-3 w-3" />
          Filter:
        </span>
        {FILTER_OPTIONS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`rounded-full border px-3 py-1 text-[10px] font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-1 ${
                isActive
                  ? "border-poke-red bg-poke-red/10 text-poke-red shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {label}
              <span className={`ml-1 text-[9px] ${isActive ? "text-poke-red/70" : "text-slate-400"}`}>
                {counts[id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
