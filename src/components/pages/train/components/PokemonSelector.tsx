"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TrainPokemon } from "../types";
import { getTypeColors } from "../data";

export interface PokemonSelectorProps {
  roster: TrainPokemon[];
  selected: number;
  onChange: (i: number) => void;
}

export function PokemonSelector({ roster, selected, onChange }: PokemonSelectorProps) {
  const prev = () => onChange((selected - 1 + roster.length) % roster.length);
  const next = () => onChange((selected + 1) % roster.length);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={prev}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:text-red-500 active:scale-90"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto py-1 scroll-smooth">
        {roster.map((p, i) => {
          const tc = getTypeColors(p.type);
          const active = i === selected;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(i)}
              className={`relative flex shrink-0 flex-col items-center gap-1 rounded-2xl border-2 px-3 py-2.5 transition-all duration-200
                ${active ? `scale-[1.08] border-transparent bg-gradient-to-br ${tc.gradient} shadow-lg` : "border-slate-200 bg-white hover:scale-[1.02] hover:border-slate-300"}`}
            >
              <img
                src={p.sprite}
                alt={p.name}
                className="h-10 w-10 object-contain drop-shadow"
                loading="lazy"
              />
              <span
                className={`font-pixel text-[7px] leading-none ${active ? "text-white" : "text-slate-600"}`}
              >
                {p.name.slice(0, 7).toUpperCase()}
              </span>
              <span className={`text-[8px] ${active ? "text-white/80" : "text-slate-400"}`}>
                Lv.{p.level}
              </span>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/20">
                <div
                  className="h-full rounded-full bg-white/70"
                  style={{ width: `${Math.round((p.xp / p.xpToNext) * 100)}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={next}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-red-200 hover:text-red-500 active:scale-90"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
