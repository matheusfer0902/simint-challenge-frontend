"use client";

import { useState } from "react";
import { X, Grid3X3, List, Zap, CheckCircle2, SlidersHorizontal } from "lucide-react";
import type { ViewMode } from "../types";
import type { PokedexFilters, CapturedFilter } from "../types";
import { TYPE_FILTER_OPTIONS } from "../data";
import { FilterSelect } from "./FilterSelect";

export interface PokedexToolbarProps {
  filters: PokedexFilters;
  view: ViewMode;
  activeFilterCount: number;
  onFilterChange: <K extends keyof PokedexFilters>(k: K, v: PokedexFilters[K]) => void;
  onViewChange: (view: ViewMode) => void;
  onClearFilters: () => void;
}

export function PokedexToolbar({
  filters,
  view,
  activeFilterCount,
  onFilterChange,
  onViewChange,
  onClearFilters,
}: PokedexToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setFiltersOpen(v => !v)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition sm:hidden ${filtersOpen || activeFilterCount > 0 ? "border-red-300 bg-red-50 text-red-600" : "border-slate-200 bg-white text-slate-600"}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-pixel text-[6px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div
            className={`flex flex-wrap items-center gap-2 ${filtersOpen ? "flex" : "hidden sm:flex"}`}
          >
            <FilterSelect
              value={filters.type}
              onChange={v => onFilterChange("type", v)}
              icon={<Zap className="h-3.5 w-3.5" />}
            >
              <option value="">Todos Tipos</option>
              {TYPE_FILTER_OPTIONS.map(t => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </FilterSelect>

            <FilterSelect
              value={filters.captured}
              onChange={v => onFilterChange("captured", v as CapturedFilter)}
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            >
              <option value="all">Todos</option>
              <option value="captured">Capturados</option>
              <option value="not_captured">Não capturados</option>
            </FilterSelect>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearFilters}
                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <X className="h-3.5 w-3.5" /> Limpar ({activeFilterCount})
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              {(["grid", "list"] as ViewMode[]).map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onViewChange(m)}
                  className={`flex h-9 w-9 items-center justify-center transition ${view === m ? "bg-red-500 text-white" : "bg-white text-slate-400 hover:bg-slate-50"} ${i > 0 ? "border-l border-slate-200" : ""}`}
                  aria-label={m === "grid" ? "Visualização em grade" : "Visualização em lista"}
                >
                  {m === "grid" ? (
                    <Grid3X3 className="h-4 w-4" />
                  ) : (
                    <List className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
