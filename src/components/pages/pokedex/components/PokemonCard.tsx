"use client";

import { useState } from "react";
import { Microscope, Lock, HelpCircle } from "lucide-react";
import type { PokemonDetailDto } from "@/lib/api/pokemon.service";
import { getTypeMeta } from "../data";
import { TypeBadge } from "./TypeBadge";
import { PokeballSVG } from "./PokeballSVG";

export interface PokemonCardProps {
  pokemon: PokemonDetailDto;
  index: number;
  captured: boolean;
  onSelect: (id: number) => void;
}

export function PokemonCard({ pokemon, index, captured, onSelect }: PokemonCardProps) {
  const [loaded, setLoaded] = useState(false);
  const primaryType = pokemon.types[0] ?? "normal";
  const tm = getTypeMeta(primaryType);
  const displayName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-red-500 ${
        captured
          ? "cursor-pointer border-slate-200/80 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
          : "cursor-default border-slate-700/50"
      }`}
      style={{ animation: `pokedexCardIn .4s ease-out ${Math.min(index * 40, 800)}ms both` }}
      onClick={() => captured && onSelect(pokemon.id)}
      tabIndex={captured ? 0 : -1}
      onKeyDown={e => {
        if (captured && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(pokemon.id);
        }
      }}
      aria-label={captured ? `${displayName} — analisar` : "Pokémon não capturado"}
    >
      {captured ? (
        <>
          <div className={`relative overflow-hidden bg-gradient-to-br ${tm.gradient} p-4 pb-8`}>
            <PokeballSVG className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 opacity-[0.12]" />
            <div className="relative z-10 mb-1 flex items-center justify-between">
              <span className="font-pixel text-[7px] text-white/70">
                #{String(pokemon.id).padStart(4, "0")}
              </span>
              {pokemon.region && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 font-pixel text-[6px] uppercase text-white/80">
                  {pokemon.region}
                </span>
              )}
            </div>
            <div className="relative flex h-24 items-center justify-center">
              <div
                className="pointer-events-none absolute inset-0 rounded-full opacity-30 blur-2xl"
                style={{
                  background: "radial-gradient(circle, white 0%, transparent 70%)",
                }}
              />
              {!loaded && (
                <div className="h-20 w-20 animate-pulse rounded-full bg-white/20" />
              )}
              <img
                src={pokemon.spriteUrl}
                alt={displayName}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 h-20 w-20 object-contain drop-shadow-lg transition-all duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "absolute opacity-0"}`}
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-white p-3">
            <h3 className="mb-2 truncate font-pixel text-[9px] text-slate-800">{displayName}</h3>
            <div className="mb-3 flex flex-wrap gap-1">
              {pokemon.types.map(slug => (
                <TypeBadge key={slug} slug={slug} />
              ))}
            </div>
            <button
              className={`mt-auto flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${tm.gradient} py-2 font-pixel text-[7px] tracking-wider text-white shadow-sm transition hover:brightness-105 active:scale-[0.97]`}
              onClick={e => {
                e.stopPropagation();
                onSelect(pokemon.id);
              }}
              tabIndex={-1}
            >
              <Microscope className="h-3 w-3" /> ANALISAR
            </button>
          </div>
          <div className="absolute left-2 top-2 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400/90 shadow">
            <span className="font-pixel text-[5px] text-white">✓</span>
          </div>
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl ring-0 transition-all duration-200 group-hover:ring-2 group-hover:ring-offset-1"
            style={{ "--tw-ring-color": tm.accent } as React.CSSProperties}
          />
        </>
      ) : (
        <>
          <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 p-4 pb-8">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 8px)",
              }}
            />
            <div className="relative z-10 mb-1 flex w-full items-center justify-between">
              <span className="font-pixel text-[7px] text-slate-600">
                #{String(pokemon.id).padStart(4, "0")}
              </span>
              <Lock className="h-2.5 w-2.5 text-slate-600" />
            </div>
            <div className="relative flex h-24 items-center justify-center">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.15] blur-2xl"
                style={{
                  background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
                }}
              />
              {!loaded && (
                <div className="h-20 w-20 animate-pulse rounded-full bg-slate-700" />
              )}
              <img
                src={pokemon.spriteUrl}
                alt="???"
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 h-20 w-20 object-contain transition-opacity duration-500 ${loaded ? "opacity-100" : "absolute opacity-0"}`}
                style={{
                  filter: "brightness(0) saturate(0) invert(0.08)",
                  WebkitFilter: "brightness(0) saturate(0) invert(0.08)",
                }}
              />
              <HelpCircle className="animate-mystery absolute h-7 w-7 text-slate-600/40" />
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-slate-900 p-3">
            <div className="mb-2 h-2.5 w-14 animate-pulse rounded-full bg-slate-700" />
            <div className="mb-3 flex gap-1">
              {pokemon.types.map((_, i) => (
                <span
                  key={i}
                  className="flex items-center gap-0.5 rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 font-bold text-[7px] text-slate-500"
                >
                  ❓ ???
                </span>
              ))}
            </div>
            <button
              disabled
              className="mt-auto flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/60 py-2 font-pixel text-[7px] tracking-wider text-slate-600"
            >
              <Lock className="h-2.5 w-2.5" /> NÃO CAPTURADO
            </button>
          </div>
        </>
      )}
    </article>
  );
}
