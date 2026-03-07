"use client";

import { Swords, Users } from "lucide-react";
import type { Tab } from "../types";

interface TabBarProps {
  active: Tab;
  onChange: (t: Tab) => void;
  battleCount: number;
  usersCount: number;
}

export function TabBar({ active, onChange, battleCount, usersCount }: TabBarProps) {
  return (
    <div className="flex items-center gap-3">
      {(
        [
          { id: "battle" as Tab, label: "Battles", icon: Swords, count: battleCount },
          { id: "users" as Tab, label: "Users", icon: Users, count: usersCount },
        ] as const
      ).map(({ id, label, icon: Icon, count }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`
              relative flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200
              focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2
              ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "border-2 border-slate-200 bg-white text-slate-600 hover:border-poke-red/30 hover:text-poke-red"
              }
            `}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline font-pixel text-[9px] tracking-wider">
              {label.toUpperCase()}
            </span>
            <span
              className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
