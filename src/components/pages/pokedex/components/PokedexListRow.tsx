"use client";

import { useState } from "react";
import { BookOpen, Lock } from "lucide-react";
import type { PokemonDetailDto } from "@/lib/api/pokemon.service";
import { getTypeMeta } from "../data";
import { TypeBadge } from "./TypeBadge";

export interface PokedexListRowProps {
  pokemon: PokemonDetailDto;
  idx: number;
  captured: boolean;
  onSelect: (id: number) => void;
}

export function PokedexListRow({ pokemon, idx, captured, onSelect }: PokedexListRowProps) {
  const [loaded, setLoaded] = useState(false);
  const primaryType = pokemon.types[0] ?? "normal";
  const tm = getTypeMeta(primaryType);
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border p-3 transition-all duration-200 ${
        captured
          ? "cursor-pointer border-slate-200/80 bg-white hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
          : "cursor-default border-slate-700/50 bg-slate-900/50"
      }`}
      style={{ animation: `pokedexCardIn .3s ease-out ${Math.min(idx * 20, 500)}ms both` }}
      onClick={() => captured && onSelect(pokemon.id)}
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${captured ? `bg-gradient-to-br ${tm.gradient}` : "bg-slate-800"}`}
      >
        {!loaded && (
          <div className="h-8 w-8 animate-pulse rounded-full bg-white/20" />
        )}
        <img
          src={pokemon.spriteUrl}
          alt={captured ? displayName : "???"}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-10 w-10 object-contain transition-opacity duration-300 ${loaded ? "opacity-100" : "absolute opacity-0"}`}
          style={
            !captured
              ? {
                  filter: "brightness(0) saturate(0) invert(0.08)",
                  WebkitFilter: "brightness(0) saturate(0) invert(0.08)",
                }
              : undefined
          }
        />
      </div>
      <div className="min-w-[64px]">
        <p
          className={`font-pixel text-[7px] ${captured ? "text-slate-400" : "text-slate-600"}`}
        >
          #{String(pokemon.id).padStart(4, "0")}
        </p>
        <p
          className={`text-sm font-semibold ${captured ? "text-slate-800" : "text-slate-500"}`}
        >
          {captured ? displayName : "???"}
        </p>
      </div>
      <div className="hidden flex-wrap gap-1.5 sm:flex">
        {captured ? (
          pokemon.types.map(slug => <TypeBadge key={slug} slug={slug} />)
        ) : (
          <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-[7px] text-slate-500">
            ???
          </span>
        )}
      </div>
      <div className="hidden text-[10px] text-slate-400 md:block">
        {captured ? pokemon.region ?? "—" : "—"}
      </div>
      {captured ? (
        <button
          className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tm.gradient} text-white shadow-sm transition hover:brightness-110`}
          onClick={e => {
            e.stopPropagation();
            onSelect(pokemon.id);
          }}
        >
          <BookOpen className="h-3.5 w-3.5" />
        </button>
      ) : (
        <Lock className="ml-auto h-4 w-4 text-slate-600" />
      )}
    </div>
  );
}
