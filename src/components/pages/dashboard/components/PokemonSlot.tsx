"use client";

import { useState } from "react";
import type { PokemonSlotData } from "../types";

function getTypeGlow(type: string): string {
  const map: Record<string, string> = {
    electric: "rgba(250,204,21,0.25)",
    fire: "rgba(239,68,68,0.2)",
    water: "rgba(59,130,246,0.2)",
    grass: "rgba(34,197,94,0.2)",
    psychic: "rgba(168,85,247,0.2)",
    ghost: "rgba(99,102,241,0.2)",
    dragon: "rgba(139,92,246,0.2)",
    ice: "rgba(6,182,212,0.2)",
    fighting: "rgba(249,115,22,0.2)",
    poison: "rgba(217,70,239,0.2)",
    flying: "rgba(56,189,248,0.2)",
  };
  return map[type] ?? "rgba(148,163,184,0.15)";
}

export function PokemonSlot({ pokemon, index }: { pokemon: PokemonSlotData; index: number }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-1 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-poke-red/30 hover:shadow-md"
      style={{ animationDelay: `${index * 60}ms` }}
      title={pokemon.name}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at center, ${getTypeGlow(pokemon.type)}, transparent 70%)`,
        }}
      />

      <div className="relative h-full w-full">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse rounded-lg bg-slate-100" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className={`h-full w-full object-contain drop-shadow-sm transition-all duration-300 group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-0.5 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        {pokemon.name}
      </div>
    </div>
  );
}
