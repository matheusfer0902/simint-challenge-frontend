"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { getMeta } from "../data";
import type { PokemonData } from "../types";
import { TypeBadge } from "./TypeBadge";
import { StatusTag } from "./StatusTag";
import { StatBar } from "./StatBar";
import { PokemonAvatar } from "./PokemonAvatar";

interface PokemonCardProps {
  pokemon: PokemonData;
  index: number;
  onDetails: (p: PokemonData) => void;
}

export function PokemonCard({ pokemon, index, onDetails }: PokemonCardProps) {
  const [hovered, setHovered] = useState(false);
  const { gradient, light } = getMeta(pokemon.types[0]);

  return (
    <article
      className="animate-fadeSlideUp relative flex cursor-default flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/80"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StatusTag tag={pokemon.tag} />

      <span className="absolute left-2.5 top-2.5 z-10 font-pixel text-[8px] text-slate-400/60">
        {pokemon.dexNumber}
      </span>

      <div className={`relative flex flex-col items-center justify-center gap-1 pb-3 pt-6 transition-all duration-300 ${light}`}>
        <div className={`absolute h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl`} />
        <PokemonAvatar pokemon={pokemon} size={88} />
        <span className={`mt-2 rounded-full bg-gradient-to-r ${gradient} px-3 py-0.5 text-[9px] font-black text-white shadow-sm`}>
          Lv. {pokemon.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <h3 className="font-pixel text-[11px] leading-snug text-slate-800">{pokemon.name}</h3>
          <p className="mt-0.5 text-[10px] text-slate-400">{pokemon.region}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>

        <div
          className={`space-y-1 overflow-hidden transition-all duration-300 ${
            hovered ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <StatBar label="HP"  value={pokemon.stats.hp}      color="bg-emerald-400" />
          <StatBar label="ATK" value={pokemon.stats.attack}  color="bg-red-400" />
          <StatBar label="DEF" value={pokemon.stats.defense} color="bg-blue-400" />
          <StatBar label="SPD" value={pokemon.stats.speed}   color="bg-yellow-400" />
        </div>

        <div className="flex-1" />

        <button
          onClick={() => onDetails(pokemon)}
          className={`group flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${gradient} py-2.5 text-[10px] font-bold text-white shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2`}
        >
          <span className="font-pixel tracking-wider">VIEW DETAILS</span>
        </button>
      </div>
    </article>
  );
}
