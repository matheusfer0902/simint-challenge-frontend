"use client";

import { PaginationControls } from "@/components/ui/PaginationControls";
import { PokedexHeader } from "./PokedexHeader";
import { PokedexToolbar } from "./PokedexToolbar";
import { PokedexGrid } from "./PokedexGrid";
import { ResearchPanel } from "./ResearchPanel";
import { PokedexPageStyles } from "./PokedexPageStyles";
import type { PokedexFilters, ViewMode } from "../types";
import type { PaginationMeta } from "@/lib/pagination";
import type { PokemonDetailDto } from "@/lib/api/pokemon.service";

export interface PokedexListViewProps {
  list: PokemonDetailDto[];
  capturedIds: number[];
  loading: boolean;
  detail: PokemonDetailDto | null;
  panelOpen: boolean;
  filters: PokedexFilters;
  view: ViewMode;
  paginationMeta: PaginationMeta;
  activeFilterCount: number;
  onFilterChange: <K extends keyof PokedexFilters>(k: K, v: PokedexFilters[K]) => void;
  onViewChange: (view: ViewMode) => void;
  onClearFilters: () => void;
  onSelect: (id: number) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function PokedexListView({
  list,
  capturedIds,
  loading,
  detail,
  panelOpen,
  filters,
  view,
  paginationMeta,
  activeFilterCount,
  onFilterChange,
  onViewChange,
  onClearFilters,
  onSelect,
  onClosePanel,
  onPageChange,
  onLimitChange,
}: PokedexListViewProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PokedexHeader />

      <PokedexToolbar
        filters={filters}
        view={view}
        activeFilterCount={activeFilterCount}
        onFilterChange={onFilterChange}
        onViewChange={onViewChange}
        onClearFilters={onClearFilters}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            <p className="mt-4 font-pixel text-[10px] text-slate-500">Carregando...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="hidden items-center gap-4 text-[10px] text-slate-400 sm:flex">
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-br from-red-400 to-rose-500" />
                  Capturado — clique para analisar
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-slate-700" />
                  Não capturado — capture para revelar
                </span>
              </div>
            </div>
            <PokedexGrid
              pokemon={list}
              capturedIds={capturedIds}
              viewMode={view}
              onSelect={onSelect}
            />
          </>
        )}

        {paginationMeta.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <PaginationControls
              meta={paginationMeta}
              onPageChange={onPageChange}
              showLimitSelector
              onLimitChange={onLimitChange}
            />
          </div>
        )}
      </main>

      <ResearchPanel detail={detail} isOpen={panelOpen} onClose={onClosePanel} />

      <PokedexPageStyles />
    </div>
  );
}
