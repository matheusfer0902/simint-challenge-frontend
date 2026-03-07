"use client";

import { useState, useEffect } from "react";
import { YOUR_POKEMON } from "../data";
import type { FilterOption, PokemonData } from "../types";
import { FilterBar } from "./FilterBar";
import { PokemonCard } from "./PokemonCard";

interface YourPokemonGridProps {
  onDetails: (p: PokemonData) => void;
}

export function YourPokemonGrid({ onDetails }: YourPokemonGridProps) {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const filtered = YOUR_POKEMON.filter((p) => {
    const matchFilter = filter === "all" || p.tag === filter;
    const matchSearch =
      !debouncedSearch ||
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.types.some((t) => t.toLowerCase().includes(debouncedSearch.toLowerCase())) ||
      p.region.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts: Record<FilterOption, number> = {
    all:      YOUR_POKEMON.length,
    created:  YOUR_POKEMON.filter((p) => p.tag === "created").length,
    captured: YOUR_POKEMON.filter((p) => p.tag === "captured").length,
  };

  return (
    <div>
      <div className="mb-5">
        <FilterBar
          active={filter}
          onChange={setFilter}
          counts={counts}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 opacity-25">
            <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16">
              <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" />
              <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#e2e8f0" />
              <rect x="5" y="47" width="90" height="6" fill="#94a3b8" />
              <circle cx="50" cy="50" r="14" fill="#94a3b8" />
              <circle cx="50" cy="50" r="10" fill="#f1f5f9" />
              <circle cx="50" cy="50" r="6" fill="#cbd5e1" />
            </svg>
          </div>
          <p className="font-pixel text-[10px] text-slate-500">No Pokémon found</p>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtered.map((p, i) => (
            <PokemonCard key={p.id} pokemon={p} index={i} onDetails={onDetails} />
          ))}
        </div>
      )}
    </div>
  );
}
