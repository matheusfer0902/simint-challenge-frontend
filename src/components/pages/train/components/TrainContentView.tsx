"use client";

import type { TrainPokemon, TrainState } from "../types";
import { TrainHeader } from "./TrainHeader";
import { TrainEmptyState } from "./TrainEmptyState";
import { PokemonSelector } from "./PokemonSelector";
import { GymStage } from "./GymStage";
import { TrainPageStyles } from "./TrainPageStyles";

export interface TrainContentViewProps {
  loading: boolean;
  roster: TrainPokemon[];
  selectedIdx: number;
  pokemon: TrainPokemon | null;
  state: TrainState;
  trainError: string | null;
  debouncedSearch: string;
  onSelectedIdxChange: (i: number) => void;
  onTrain: () => void;
  onClearTrainError: () => void;
}

export function TrainContentView({
  loading,
  roster,
  selectedIdx,
  pokemon,
  state,
  trainError,
  debouncedSearch,
  onSelectedIdxChange,
  onTrain,
  onClearTrainError,
}: TrainContentViewProps) {
  const hasSearch = debouncedSearch.trim().length > 0;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <TrainHeader />

      <div className="mb-6 h-px bg-gradient-to-r from-red-500/30 via-slate-200 to-transparent" />

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
        </div>
      ) : roster.length === 0 ? (
        <TrainEmptyState hasSearch={hasSearch} />
      ) : (
        <>
          <div className="mb-6">
            <p className="mb-3 font-pixel text-[8px] uppercase tracking-widest text-slate-400">
              Select a Pokémon
            </p>
            <PokemonSelector
              roster={roster}
              selected={selectedIdx}
              onChange={onSelectedIdxChange}
            />
          </div>

          {pokemon && (
            <>
              {trainError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {trainError}
                  <button
                    type="button"
                    onClick={onClearTrainError}
                    className="ml-2 underline"
                  >
                    Close
                  </button>
                </div>
              )}
              <GymStage pokemon={pokemon} state={state} onTrain={onTrain} />
            </>
          )}
        </>
      )}

      <TrainPageStyles />
    </div>
  );
}
