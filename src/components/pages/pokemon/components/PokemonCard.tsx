"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getMeta } from "../data";
import type { PokemonData } from "../types";
import { TypeBadge } from "./TypeBadge";
import { StatusTag } from "./StatusTag";
import { StatBar } from "./StatBar";
import { PokemonAvatar } from "./PokemonAvatar";

type CatchResult = "idle" | "loading" | "caught" | "escaped";

interface PokemonCardProps {
  pokemon: PokemonData;
  index: number;
  onAction: (p: PokemonData) => Promise<boolean | void> | boolean | void;
}

export function PokemonCard({ pokemon, index, onAction }: PokemonCardProps) {
  const [hovered, setHovered] = useState(false);
  const [catchResult, setCatchResult] = useState<CatchResult>("idle");
  const { gradient, light } = getMeta(pokemon.types[0]);

  const isWild = pokemon.tag === "wild";
  const dexNumber = `#${pokemon.id.toString().padStart(3, "0")}`;
  const locationLabel = pokemon.location?.replace(/-/g, " ") ?? "";

  const isDisabled = catchResult === "loading" || catchResult === "caught";

  const handleAction = async () => {
    if (isDisabled) return;

    if (!isWild) {
      await onAction(pokemon);
      return;
    }

    setCatchResult("loading");
    try {
      const result = await onAction(pokemon);
      const wasCaught = result !== false;
      setCatchResult(wasCaught ? "caught" : "escaped");

      if (!wasCaught) {
        setTimeout(() => setCatchResult("idle"), 2500);
      }
    } catch {
      setCatchResult("escaped");
      setTimeout(() => setCatchResult("idle"), 2500);
    }
  };

  const buttonGradient = (() => {
    if (catchResult === "caught")  return "from-emerald-500 to-green-600";
    if (catchResult === "escaped") return "from-orange-500 to-red-500";
    return gradient;
  })();

  return (
    <article
      className="animate-fadeSlideUp relative flex cursor-default flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/80"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <StatusTag tag={pokemon.tag} />

      <span className="absolute left-2.5 top-2.5 z-10 font-pixel text-[8px] text-slate-400/60">
        {dexNumber}
      </span>

      <div className={`relative flex flex-col items-center justify-center gap-1 pb-3 pt-6 transition-all duration-300 ${light}`}>
        <div className={`absolute h-24 w-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl`} />

        {isWild && catchResult === "caught" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-emerald-500/90 backdrop-blur-sm animate-fadeSlideUp">
            <CheckCircle2 className="h-10 w-10 text-white drop-shadow-lg" />
            <span className="font-pixel text-[10px] text-white tracking-widest">CAUGHT!</span>
          </div>
        )}

        {isWild && catchResult === "escaped" && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-orange-500/90 backdrop-blur-sm animate-fadeSlideUp">
            <XCircle className="h-10 w-10 text-white drop-shadow-lg" />
            <span className="font-pixel text-[10px] text-white tracking-widest">ESCAPED!</span>
          </div>
        )}

        <PokemonAvatar pokemon={pokemon} size={88} />
        <span className={`mt-2 rounded-full bg-gradient-to-r ${gradient} px-3 py-0.5 text-[9px] font-black text-white shadow-sm`}>
          Lv. {pokemon.level}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div>
          <h3 className="font-pixel text-[11px] capitalize leading-snug text-slate-800">{pokemon.name}</h3>
          {locationLabel && (
            <p className="mt-0.5 text-[10px] capitalize text-slate-400">{locationLabel}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
        </div>

        <div
          className={`space-y-1 overflow-hidden transition-all duration-300 ${
            hovered ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <StatBar label="HP"  value={pokemon.hp}          color="bg-emerald-400" />
          <StatBar label="ATK" value={pokemon.baseAttack}  color="bg-red-400" />
          <StatBar label="DEF" value={pokemon.baseDefense} color="bg-blue-400" />
          <StatBar label="SPD" value={pokemon.baseSpeed}   color="bg-yellow-400" />
        </div>

        <div className="flex-1" />

        <button
          onClick={handleAction}
          disabled={isDisabled}
          className={`group flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r ${buttonGradient} py-2.5 text-[10px] font-bold text-white shadow-sm transition-all duration-300 hover:shadow-md active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {catchResult === "loading" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span className="font-pixel tracking-wider">CATCHING...</span>
            </>
          ) : catchResult === "caught" ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="font-pixel tracking-wider">CAUGHT!</span>
            </>
          ) : catchResult === "escaped" ? (
            <>
              <XCircle className="h-3.5 w-3.5" />
              <span className="font-pixel tracking-wider">ESCAPED!</span>
            </>
          ) : (
            <span className="font-pixel tracking-wider">
              {isWild ? "CATCH POKÉMON" : "VIEW DETAILS"}
            </span>
          )}
        </button>
      </div>
    </article>
  );
}
