"use client";

import { usePokedexHandler } from "./useHandler";
import { PokedexListView } from "./components/PokedexListView";
import { AppLayout } from "@/components/layout/AppLayout";

export function PokedexPage() {
  const {
    list,
    capturedIds,
    loading,
    detail,
    panelOpen,
    filters,
    view,
    paginationMeta,
    setFilter,
    setView,
    onSelect,
    onClosePanel,
    clearFilters,
    activeFilterCount,
    setPage,
    setLimit,
  } = usePokedexHandler();

  return (
    <AppLayout
      search={filters.search}
      onSearchChange={v => setFilter("search", v)}
      searchPlaceholder="Nome ou número da Pokédex..."
    >
      <PokedexListView
        list={list}
        capturedIds={capturedIds}
        loading={loading}
        detail={detail}
        panelOpen={panelOpen}
        filters={filters}
        view={view}
        paginationMeta={paginationMeta}
        activeFilterCount={activeFilterCount}
        onFilterChange={setFilter}
        onViewChange={setView}
        onClearFilters={clearFilters}
        onSelect={onSelect}
        onClosePanel={onClosePanel}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    </AppLayout>
  );
}

export { PokemonCard, PokedexGrid, ResearchPanel } from "./components";
export type { PokedexFilters, ViewMode, PanelTab } from "./types";
export { usePokedexHandler, useDebounce } from "./useHandler";
export { getTypeMeta, TYPE_FILTER_OPTIONS, TYPE_SLUG_TO_NAME } from "./data";
