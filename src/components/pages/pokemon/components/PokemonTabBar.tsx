"use client";

import { TABS } from "../data";
import type { PageTab } from "../types";

interface PokemonTabBarProps {
  active: PageTab;
  onChange: (t: PageTab) => void;
}

export function PokemonTabBar({ active, onChange }: PokemonTabBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        const isNew = id === "new-pokemon";
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              group relative flex items-center gap-1.5 rounded-full border-2 px-4 py-2 font-pixel text-[9px] tracking-wider
              transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2
              active:scale-[0.97]
              ${
                isNew
                  ? "border-emerald-400 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  : isActive
                  ? "border-poke-red bg-poke-red text-white shadow-lg shadow-poke-red/25"
                  : "border-slate-300 bg-white text-slate-600 hover:border-poke-red/40 hover:text-poke-red"
              }
            `}
          >
            {isActive && !isNew && (
              <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
            )}
            <Icon className="h-3.5 w-3.5" />
            {label}
            {isNew && (
              <span className="ml-0.5 rounded-full bg-emerald-500 px-1 py-0.5 text-[7px] font-black text-white">
                NEW
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
