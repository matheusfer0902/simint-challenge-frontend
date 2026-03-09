"use client";

import { Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { UserFilter } from "../types";
import { FILTER_OPTIONS } from "../data";

function UsersToolbarShimmer() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
  );
}

export interface UsersToolbarProps {
  filter: UserFilter | "";
  onFilterChange: (value: UserFilter | "") => void;
  onNewUser: () => void;
}

export function UsersToolbar({ filter, onFilterChange, onNewUser }: UsersToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
      <div className="relative">
        <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <select
          value={filter}
          onChange={(e) => onFilterChange((e.target.value || "") as UserFilter | "")}
          className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-7 text-xs font-semibold text-slate-600 outline-none"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
      </div>

      <button
        type="button"
        onClick={onNewUser}
        className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-2.5 font-pixel text-[10px] tracking-wider text-white shadow-lg shadow-red-500/20 transition hover:scale-[1.01] hover:shadow-xl hover:shadow-red-500/30 active:scale-[0.97] focus:outline-none"
      >
        <UsersToolbarShimmer />
        <Plus className="h-4 w-4" />
        NEW USER
      </button>
    </div>
  );
}
