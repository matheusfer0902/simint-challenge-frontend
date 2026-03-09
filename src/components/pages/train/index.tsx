"use client";

import { useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTrainHandler, useDebounce } from "./useHandler";
import { TrainContentView } from "./components/TrainContentView";

const SEARCH_DEBOUNCE_MS = 400;

export function TrainingPage() {
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);
  const {
    roster,
    loading,
    selectedIdx,
    setSelectedIdx,
    pokemon,
    state,
    train,
    trainError,
    clearTrainError,
  } = useTrainHandler(debouncedSearch);

  const handleSearchChange = useCallback((v: string) => {
    setSearchInput(v);
  }, []);

  return (
    <AppLayout
      search={searchInput}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar Pokémon..."
    >
      <TrainContentView
        loading={loading}
        roster={roster}
        selectedIdx={selectedIdx}
        pokemon={pokemon}
        state={state}
        trainError={trainError}
        debouncedSearch={debouncedSearch}
        onSelectedIdxChange={setSelectedIdx}
        onTrain={train}
        onClearTrainError={clearTrainError}
      />
    </AppLayout>
  );
}

export { useTrainHandler, useDebounce } from "./useHandler";
export type { TrainPokemon, TrainState, Phase } from "./useHandler";
export { getTypeColors, TYPE_COLORS, DEFAULT_TRAIN_POKEMON } from "./data";
export type { TypeColors } from "./types";
export {
  GymStage,
  PokemonSelector,
  TrainContentView,
  TrainEmptyState,
  TrainHeader,
  XpBar,
  LevelUpOverlay,
  ParticleCanvas,
  TrainPageStyles,
} from "./components";
