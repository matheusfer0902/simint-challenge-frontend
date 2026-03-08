"use client";

import { useState } from "react";
import { Users, Globe, Lock } from "lucide-react";
import { RANK_STYLE } from "../data";
import type { Team } from "../types";
import { membersToSlots } from "../types";
import { PokemonMiniSlot } from "./PokemonMiniSlot";
import { EmptySlot } from "./EmptySlot";
import { RankBadge } from "./RankBadge";

interface TeamCardProps {
  team: Team;
  onView: (id: string) => void;
}

export function TeamCard({ team, onView }: TeamCardProps) {
  const [hovered, setHovered] = useState(false);
  const winRate =
    team.battles > 0
      ? Math.round((team.wins / team.battles) * 100)
      : 0;
  const slots = membersToSlots(team.members);

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 ${hovered ? "-translate-y-1.5 shadow-xl shadow-slate-200/80" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${RANK_STYLE[team.grade]}`} />
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 opacity-[0.04]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#000" />
          <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#000" />
          <rect x="5" y="47" width="90" height="6" fill="#000" />
          <circle cx="50" cy="50" r="10" fill="#fff" />
          <circle cx="50" cy="50" r="6" fill="#000" />
        </svg>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <h3 className="font-pixel text-[11px] truncate text-slate-800">
              {team.name}
            </h3>
            <span
              className="shrink-0 text-slate-400"
              title={team.isPublic ? "Público" : "Privado"}
              aria-label={team.isPublic ? "Time público" : "Time privado"}
            >
              {team.isPublic ? (
                <Globe className="h-3.5 w-3.5" />
              ) : (
                <Lock className="h-3.5 w-3.5" />
              )}
            </span>
          </div>
          <RankBadge rank={team.grade} />
        </div>
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {team.description}
        </p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const p = slots[i];
            return p ? (
              <PokemonMiniSlot key={i} pokemon={p} />
            ) : (
              <EmptySlot key={i} />
            );
          })}
        </div>
        <div className="mb-4 flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3">
          <div className="text-center">
            <p className="font-pixel text-[9px] uppercase text-slate-400">
              Wins
            </p>
            <p className="font-pixel text-sm text-emerald-600">{team.wins}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="font-pixel text-[9px] uppercase text-slate-400">
              Losses
            </p>
            <p className="font-pixel text-sm text-red-500">{team.losses}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="font-pixel text-[9px] uppercase text-slate-400">
              W-Rate
            </p>
            <p className="font-pixel text-sm text-blue-600">{winRate}%</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <p className="font-pixel text-[9px] uppercase text-slate-400">
              Slots
            </p>
            <p className="font-pixel text-sm text-slate-700">
              {team.members.length}/6
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onView(team.id)}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-poke-red to-rose-600 py-3 font-pixel text-[10px] tracking-wider text-white shadow-sm transition-all hover:shadow-lg hover:shadow-poke-red/20 active:scale-[0.97] focus:outline-none"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <span className="relative flex items-center justify-center gap-2">
            <Users className="h-3.5 w-3.5" />
            VIEW TEAM
          </span>
        </button>
      </div>
    </article>
  );
}
