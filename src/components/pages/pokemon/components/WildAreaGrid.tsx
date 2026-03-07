"use client";

import { Globe } from "lucide-react";
import { WILD_POKEMON } from "../data";
import type { PokemonData } from "../types";
import { PokemonCard } from "./PokemonCard";

interface WildAreaGridProps {
  onDetails: (p: PokemonData) => void;
}

export function WildAreaGrid({ onDetails }: WildAreaGridProps) {
  return (
    <div>
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="font-pixel text-[11px] text-white">WILD AREA</h3>
            <p className="mt-1 text-xs text-slate-400">
              Pokémon roaming freely — approach with caution.
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-1 rounded-full bg-red-500/20 px-3 py-1.5 sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
            <span className="text-[10px] font-semibold text-red-400">LIVE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {WILD_POKEMON.map((p, i) => (
          <PokemonCard key={p.id} pokemon={p} index={i} onDetails={onDetails} />
        ))}
      </div>
    </div>
  );
}
