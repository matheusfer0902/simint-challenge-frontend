"use client";

import { ArrowLeft, Globe, Ruler, Weight, Zap } from "lucide-react";
import { getDetailTypeStyle } from "../data";
import type { PokemonDetail } from "../types";
import { TypeBadge } from "./TypeBadge";
import { PokemonSprite } from "./PokemonSprite";

interface DetailHeroProps {
  pokemon: PokemonDetail;
  onBack: () => void;
}

export function DetailHero({ pokemon, onBack }: DetailHeroProps) {
  const primaryType = getDetailTypeStyle(pokemon.types[0]);

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${primaryType.gradient} pb-24 pt-8`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-[0.07]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#fff" />
          <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" />
          <rect x="5" y="47" width="90" height="6" fill="#000" />
          <circle cx="50" cy="50" r="14" fill="#000" />
          <circle cx="50" cy="50" r="10" fill="#fff" />
          <circle cx="50" cy="50" r="6" fill="#000" />
          <circle cx="50" cy="50" r="3" fill="#fff" />
        </svg>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 active:scale-[0.97]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </button>

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full bg-white/25 px-3 py-0.5 font-pixel text-[9px] text-white/90">
                {pokemon.dexNumber}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[9px] font-semibold text-white/80">
                {pokemon.category}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-0.5 text-[9px] text-white/70">
                {pokemon.generation}
              </span>
            </div>
            <h1 className="font-pixel text-3xl text-white drop-shadow-lg sm:text-4xl">
              {pokemon.name.toUpperCase()}
            </h1>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {pokemon.types.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {[
                { icon: <Ruler className="h-3 w-3" />, label: pokemon.height },
                { icon: <Weight className="h-3 w-3" />, label: pokemon.weight },
                { icon: <Globe className="h-3 w-3" />, label: pokemon.region },
                { icon: <Zap className="h-3 w-3" />, label: `Lv. ${pokemon.level}` },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 rounded-xl bg-white/25 px-3 py-1.5 backdrop-blur-sm"
                >
                  <span className="text-white/80">{icon}</span>
                  <span className="text-xs font-semibold text-white">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="shrink-0">
            <PokemonSprite pokemon={pokemon} size={220} />
          </div>
        </div>
      </div>
    </div>
  );
}
