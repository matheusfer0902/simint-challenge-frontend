"use client";

import { ChevronRight } from "lucide-react";
import type { Evolution } from "../types";

interface EvolutionChainProps {
  chain: Evolution[];
  currentId: number;
}

export function EvolutionChain({ chain, currentId }: EvolutionChainProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {chain.map((evo, i) => (
        <div key={evo.id} className="flex items-center gap-2">
          <div
            className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3 transition-all ${
              evo.id === currentId
                ? "border-poke-red bg-poke-red/5 shadow-md shadow-poke-red/10"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={evo.sprite}
              alt={evo.name}
              className="h-14 w-14 object-contain drop-shadow-sm"
              loading="lazy"
            />
            <span className="font-pixel text-[9px] text-slate-700">
              {evo.name}
            </span>
            {evo.level > 1 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[8px] text-slate-500">
                Lv.{evo.level}
              </span>
            )}
          </div>
          {i < chain.length - 1 && (
            <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
          )}
        </div>
      ))}
    </div>
  );
}
