"use client";

import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { getTypeGradient, getTypeBadge } from "../data";
import type { PokemonSummary } from "../types";

interface PokemonSlotCardProps {
  pokemon: PokemonSummary | null;
  slot: number;
  onRemove?: () => void;
  onAddClick?: () => void;
}

export function PokemonSlotCard({ pokemon, slot, onRemove, onAddClick }: PokemonSlotCardProps) {
  const [loaded, setLoaded] = useState(false);

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center transition-all hover:border-poke-red/30 hover:bg-poke-red/5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-white">
          <PlusCircle className="h-6 w-6 text-slate-300" />
        </div>
        <div>
          <p className="font-pixel text-[9px] text-slate-400">SLOT {slot + 1}</p>
          <p className="mt-0.5 text-xs text-slate-400">Empty</p>
        </div>
        {onAddClick != null && (
          <button
            type="button"
            onClick={onAddClick}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500 transition-all hover:border-poke-red/30 hover:text-poke-red focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2"
          >
            + Add Pokémon
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${getTypeGradient(pokemon.type)}`}
      />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800/80 text-white transition-colors hover:bg-poke-red"
          aria-label="Remover Pokémon do time"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="relative flex w-full items-center justify-center py-6">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getTypeGradient(pokemon.type)} opacity-[0.07]`}
        />
        {!loaded && (
          <div className="absolute h-16 w-16 animate-pulse rounded-full bg-slate-100" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={`relative z-10 h-20 w-20 object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="w-full p-4">
        <div className="flex items-baseline justify-between gap-1">
          <h4 className="font-pixel text-[10px] truncate text-slate-800 capitalize">
            {pokemon.name}
          </h4>
          <span className="shrink-0 font-pixel text-[8px] text-slate-400">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase ${getTypeBadge(pokemon.type)}`}
          >
            {pokemon.type}
          </span>
          <span
            className={`rounded-full bg-gradient-to-r ${getTypeGradient(pokemon.type)} px-2.5 py-0.5 text-[9px] font-black text-white`}
          >
            Lv.{pokemon.level}
          </span>
          {pokemon.region && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] font-semibold text-slate-600 capitalize">
              {pokemon.region}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
