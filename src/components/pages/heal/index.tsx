"use client";

import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useHealHandler, useDebounce } from "./useHandler";
import { HealContentView } from "./components/HealContentView";

const SEARCH_DEBOUNCE_MS = 400;

export function HealPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const {
    team,
    loading,
    tray,
    addToTray,
    removeFromTray,
    isInTray,
    trayIndex,
    state,
    heal,
    healError,
    clearHealError,
  } = useHealHandler(debouncedSearch);

  const handleSearchChange = useCallback((v: string) => {
    setSearchInput(v);
  }, []);

  return (
    <AppLayout
      search={searchInput}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search Pokémon..."
    >
      <HealContentView
        loading={loading}
        team={team}
        tray={tray}
        state={state}
        debouncedSearch={debouncedSearch}
        isInTray={isInTray}
        trayIndex={trayIndex}
        onHeal={heal}
        onAddToTray={addToTray}
        onRemoveFromTray={removeFromTray}
        healError={healError}
        onClearHealError={clearHealError}
      />
    </AppLayout>
  );
}

export { useHealHandler, useDebounce } from "./useHandler";
export type { HealPokemon, HealState, HealPhase, PokeStatus } from "./useHandler";
export { getTypeColors, TYPE_COLORS, STATUS_CFG, hpBarColor, MAX_TRAY } from "./data";
export type { TypeColors, StatusConfig } from "./types";
export {
  HealMachine,
  PatientCard,
  HealContentView,
  HealEmptyState,
  HealHeader,
  SuccessToast,
  MachineSlot,
  HealPageStyles,
  HealPokeballSVG,
} from "./components";
