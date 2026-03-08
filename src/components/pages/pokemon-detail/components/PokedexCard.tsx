"use client";

import { getDetailTypeStyle } from "../data";
import type { PokemonDetail } from "../types";

interface PokedexCardProps {
  pokemon: PokemonDetail;
}

export function PokedexCard({ pokemon }: PokedexCardProps) {
  const primaryType = getDetailTypeStyle(pokemon.types[0]);

  return (
    <div className="relative mb-6 overflow-hidden rounded-3xl border-2 border-slate-200/80 bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
        <div className="flex gap-1.5">
          <div className="h-3.5 w-3.5 rounded-full bg-red-500 shadow-inner" />
          <div className="h-3.5 w-3.5 rounded-full bg-yellow-400 shadow-inner" />
          <div className="h-3.5 w-3.5 rounded-full bg-green-400 shadow-inner" />
        </div>
        <div
          className={`h-2 w-24 rounded-full bg-gradient-to-r ${primaryType.gradient} opacity-80`}
        />
        <span className="ml-auto font-pixel text-[9px] uppercase tracking-wider text-slate-500">
          POKÉDEX v2.0
        </span>
      </div>

      <div className="p-6">
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-lg bg-white/10 px-3 py-1.5 font-pixel text-[9px] uppercase tracking-wider text-slate-300">
              Ability: {pokemon.ability}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            {pokemon.description}
          </p>
          <p className="mt-3 border-t border-white/10 pt-3 text-[11px] italic text-slate-500">
            &ldquo;{pokemon.flavourText}&rdquo;
          </p>
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 px-6 py-3">
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i === 0 ? `bg-gradient-to-br ${primaryType.gradient}` : "bg-slate-700"}`}
            />
          ))}
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-10 rounded bg-slate-700" />
          <div className="h-5 w-10 rounded bg-slate-700" />
        </div>
      </div>
    </div>
  );
}
