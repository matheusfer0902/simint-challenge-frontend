"use client";

import { X } from "lucide-react";
import { AppButton } from "@/components/shared/AppButton";
import { useKeyPress } from "@/lib/hooks/use-key-press";
import { getMeta } from "../data";
import type { PokemonData } from "../types";
import { PokemonAvatar } from "./PokemonAvatar";
import { StatBar } from "./StatBar";
import { StatusTag } from "./StatusTag";

interface DetailModalProps {
  pokemon: PokemonData | null;
  onClose: () => void;
}

export function DetailModal({ pokemon, onClose }: DetailModalProps) {
  useKeyPress("Escape", onClose);

  if (!pokemon) return null;

  const { gradient } = getMeta(pokemon.types[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm animate-modalIn overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className={`relative flex flex-col items-center gap-2 bg-gradient-to-br ${gradient} pb-6 pt-8`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl bg-white/20 p-1.5 text-white hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
          <PokemonAvatar pokemon={pokemon} size={110} />
          <div className="text-center">
            <p className="font-pixel text-[9px] text-white/70">{pokemon.dexNumber}</p>
            <h2 className="font-pixel text-[14px] text-white">{pokemon.name.toUpperCase()}</h2>
            <p className="mt-0.5 text-xs text-white/70">{pokemon.region}</p>
          </div>
          <div className="flex gap-1.5">
            {pokemon.types.map((t) => (
              <span key={t} className="rounded-full bg-white/25 px-2.5 py-0.5 text-[9px] font-bold uppercase text-white">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3 p-6">
          <p className="font-pixel text-[9px] uppercase tracking-widest text-slate-400">Base Stats</p>
          <StatBar label="HP"  value={pokemon.stats.hp}      color="bg-emerald-400" />
          <StatBar label="ATK" value={pokemon.stats.attack}  color="bg-red-400" />
          <StatBar label="DEF" value={pokemon.stats.defense} color="bg-blue-400" />
          <StatBar label="SPD" value={pokemon.stats.speed}   color="bg-yellow-400" />

          <div className="mt-2 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-center">
              <p className="font-pixel text-[9px] text-slate-400">LEVEL</p>
              <p className="font-pixel text-base text-slate-800">{pokemon.level}</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-center">
              <p className="font-pixel text-[9px] text-slate-400">STATUS</p>
              <div className="relative">
                <StatusTag tag={pokemon.tag} />
                {pokemon.tag === "wild" && <span className="font-pixel text-[9px] text-slate-500">WILD</span>}
              </div>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-center">
              <p className="font-pixel text-[9px] text-slate-400">SHINY</p>
              <p className="font-pixel text-[10px] text-slate-800">{pokemon.shiny ? "✨ YES" : "NO"}</p>
            </div>
          </div>

          <AppButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={onClose}
            className={`bg-gradient-to-r ${gradient} shadow-none hover:shadow-lg`}
          >
            <span className="font-pixel text-[10px] tracking-wider">CLOSE</span>
          </AppButton>
        </div>
      </div>
    </div>
  );
}
