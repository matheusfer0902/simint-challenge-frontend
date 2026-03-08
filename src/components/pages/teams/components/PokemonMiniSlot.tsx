"use client";

import { useState } from "react";
import { getTypeGradient } from "../data";
import type { PokemonSummary } from "../types";

interface PokemonMiniSlotProps {
  pokemon: PokemonSummary;
}

export function PokemonMiniSlot({ pokemon }: PokemonMiniSlotProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${getTypeGradient(pokemon.type)} shadow-sm transition-transform hover:scale-110`}
      title={`${pokemon.name} (Lv.${pokemon.level})`}
    >
      {!loaded && (
        <div className="absolute inset-1 animate-pulse rounded-lg bg-white/30" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={pokemon.sprite}
        alt={pokemon.name}
        className={`h-8 w-8 object-contain drop-shadow transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
