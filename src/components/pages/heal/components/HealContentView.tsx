"use client";

import { Heart, CheckCircle2, Sparkles } from "lucide-react";
import type { HealPokemon, HealState } from "../types";
import { HealHeader } from "./HealHeader";
import { HealMachine } from "./HealMachine";
import { PatientCard } from "./PatientCard";
import { SuccessToast } from "./SuccessToast";
import { HealEmptyState } from "./HealEmptyState";
import { HealShimmer } from "./HealShimmer";
import { HealSpinner } from "./HealSpinner";
import { HealPageStyles } from "./HealPageStyles";

export interface HealContentViewProps {
  loading: boolean;
  team: HealPokemon[];
  tray: HealPokemon[];
  state: HealState;
  debouncedSearch: string;
  isInTray: (p: HealPokemon) => boolean;
  trayIndex: (p: HealPokemon) => number;
  onHeal: () => void;
  onAddToTray: (p: HealPokemon) => void;
  onRemoveFromTray: (p: HealPokemon) => void;
  healError: string | null;
  onClearHealError: () => void;
}

export function HealContentView({
  loading,
  team,
  tray,
  state,
  debouncedSearch,
  isInTray,
  trayIndex,
  onHeal,
  onAddToTray,
  onRemoveFromTray,
  healError,
  onClearHealError,
}: HealContentViewProps) {
  const isRunning = ["loading", "sequencing", "filling"].includes(state.phase);
  const isDone = state.phase === "done";
  const hasSearch = debouncedSearch.trim().length > 0;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <HealHeader />

      <div className="mb-6 h-px bg-gradient-to-r from-red-500/30 via-slate-200 to-transparent" />

      {loading ? (
        <div className="mb-6 flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <HealMachine state={state} tray={tray} />
          </div>

          {healError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {healError}
              <button type="button" onClick={onClearHealError} className="ml-2 underline">
                Fechar
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onHeal}
            disabled={isRunning || tray.length === 0}
            className={`group relative mb-6 w-full overflow-hidden rounded-2xl py-5 font-pixel text-[11px] tracking-widest text-white shadow-xl transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70
                ${isDone ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/25 hover:shadow-xl" : isRunning ? "bg-slate-600" : "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30 hover:scale-[1.01] hover:shadow-2xl"}`}
          >
            <HealShimmer />
            <span className="relative flex items-center justify-center gap-3">
              {isRunning ? (
                <>
                  <HealSpinner /> CURANDO TIME...
                </>
              ) : isDone ? (
                <>
                  <CheckCircle2 className="h-5 w-5" /> POKEMONS CURADOS! CURAR NOVAMENTE?
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" /> CURAR POKEMONS <Sparkles className="h-5 w-5" />
                </>
              )}
            </span>
          </button>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3.5 w-1 rounded-full bg-red-500" />
              <h2 className="font-pixel text-[9px] uppercase tracking-widest text-slate-500">
                STATUS DOS POKEMONS
              </h2>
            </div>
            <p className="mb-3 text-[10px] text-slate-500">
              Clique em um Pokémon para colocá-lo na bandeja de recuperação (máx. 6).
            </p>
            {team.length === 0 ? (
              <HealEmptyState hasSearch={hasSearch} />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {team.map((p, i) => {
                  const idx = trayIndex(p);
                  const useDisplayHp =
                    idx >= 0 && (state.phase === "filling" || state.phase === "done");
                  const currentHp = useDisplayHp ? (state.displayHp[idx] ?? p.hp) : p.hp;
                  return (
                    <PatientCard
                      key={p.id}
                      pokemon={p}
                      currentHp={currentHp}
                      slotIndex={idx >= 0 ? idx : i}
                      activeSlot={state.activeSlot}
                      isLit={idx >= 0 && state.litSlots[idx]}
                      isHealing={state.phase === "filling"}
                      isInTray={isInTray(p)}
                      onClick={() => (isInTray(p) ? onRemoveFromTray(p) : onAddToTray(p))}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <SuccessToast visible={state.showToast} />
      <HealPageStyles />
    </div>
  );
}
