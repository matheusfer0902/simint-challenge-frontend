"use client";

import { useState, useCallback } from "react";
import { MapPin, Zap, Star, Shield, Swords, ChevronRight } from "lucide-react";
import type { BattleCardData } from "../types";
import { RANK_COLORS } from "../data";
import { Avatar } from "./Avatar";
import { RankBadge } from "./RankBadge";
import { TypeBadge } from "./TypeBadge";
import { PokemonSlot } from "./PokemonSlot";

export function BattleCard({ card }: { card: BattleCardData }) {
  const [hovered, setHovered] = useState(false);
  const [battling, setBattling] = useState(false);

  const handleBattle = useCallback(() => {
    setBattling(true);
    setTimeout(() => setBattling(false), 1200);
  }, []);

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 ${
        hovered ? "-translate-y-1 shadow-lg shadow-slate-200/60" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`h-1 w-full bg-gradient-to-r ${RANK_COLORS[card.rank]} transition-all duration-300 ${
          hovered ? "opacity-100" : "opacity-70"
        }`}
      />

      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#000" />
          <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#000" />
          <rect x="5" y="47" width="90" height="6" fill="#000" />
          <circle cx="50" cy="50" r="10" fill="#fff" />
          <circle cx="50" cy="50" r="6" fill="#000" />
        </svg>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-pixel text-[11px] leading-snug text-slate-800 truncate">
              {card.teamName}
            </h3>
            <div className="mt-1.5 flex items-center gap-1.5">
              <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
              <span className="text-[11px] text-slate-500 truncate">{card.owner.region}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <RankBadge rank={card.rank} />
            <Avatar src={card.owner.avatar} alt={card.owner.name} size={36} ring />
          </div>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Zap className="h-3 w-3 text-yellow-500" />
            <span className="font-medium text-slate-700">{card.wins}</span>
            <span>wins</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Star className="h-3 w-3 text-amber-400" />
            <span>Lv. {card.owner.level}</span>
          </div>
          <TypeBadge type={card.pokemon[0].type} />
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {card.pokemon.map((p, i) => (
            <PokemonSlot key={p.id} pokemon={p} index={i} />
          ))}
        </div>

        <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <Shield className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-500">Leader:</span>
          <span className="text-[11px] font-semibold text-slate-700">{card.owner.name}</span>
        </div>

        <button
          onClick={handleBattle}
          className={`group relative w-full overflow-hidden rounded-xl py-3 text-sm font-bold text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2 active:scale-[0.98] ${
            battling
              ? "bg-orange-500"
              : "bg-gradient-to-r from-poke-red to-rose-600 hover:shadow-lg hover:shadow-poke-red/25"
          }`}
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <span className="relative flex items-center justify-center gap-2">
            {battling ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Challenging...
              </>
            ) : (
              <>
                <Swords className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                <span className="font-pixel text-[10px] tracking-wider">BATTLE NOW</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </span>
        </button>
      </div>
    </article>
  );
}
