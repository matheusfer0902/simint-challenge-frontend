"use client";

import type { PokemonDetailDto } from "@/lib/api/pokemon.service";
import type { ViewMode } from "../types";
import { PokemonCard } from "./PokemonCard";
import { PokedexListRow } from "./PokedexListRow";
import { PokedexEmptyState } from "./PokedexEmptyState";

export interface PokedexGridProps {
  pokemon: PokemonDetailDto[];
  capturedIds: number[];
  viewMode: ViewMode;
  onSelect: (id: number) => void;
}

export function PokedexGrid({ pokemon, capturedIds, viewMode, onSelect }: PokedexGridProps) {
  if (pokemon.length === 0) {
    return <PokedexEmptyState />;
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        {pokemon.map((p, i) => (
          <PokedexListRow
            key={p.id}
            pokemon={p}
            idx={i}
            captured={capturedIds.includes(p.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {pokemon.map((p, i) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          index={i}
          captured={capturedIds.includes(p.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
