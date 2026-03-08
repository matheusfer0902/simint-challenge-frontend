"use client";

import { useState } from "react";
import { Plus, Trophy, TrendingUp, Star } from "lucide-react";
import type { Team } from "../types";
import { TeamCard } from "./TeamCard";
import { CreateTeamModal } from "./CreateTeamModal";

interface TeamListViewProps {
  teams: Team[];
  onViewTeam: (id: string) => void;
}

export function TeamListView({ teams, onViewTeam }: TeamListViewProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Dashboard</span>
            <span>›</span>
            <span className="font-semibold text-poke-red">My Teams</span>
          </div>
          <h1 className="font-pixel text-2xl text-poke-red sm:text-3xl">
            MY TEAMS
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Manage and battle with your Pokémon teams.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              {
                icon: <Trophy className="h-3 w-3 text-yellow-500" />,
                label: `${teams.length} Teams`,
              },
              {
                icon: <TrendingUp className="h-3 w-3 text-emerald-500" />,
                label: "432 Total Wins",
              },
              {
                icon: <Star className="h-3 w-3 text-amber-400" />,
                label: "2 S-Rank Teams",
              },
            ].map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
              >
                {icon} {label}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-poke-red to-rose-600 px-5 py-3 font-pixel text-[10px] tracking-wider text-white shadow-lg shadow-poke-red/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-poke-red/30 active:scale-[0.97] focus:outline-none"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <Plus className="h-4 w-4" />
          CREATE NEW TEAM
        </button>
      </div>

      <div className="mb-6 h-px bg-gradient-to-r from-poke-red/30 via-slate-200 to-transparent" />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {teams.map((team, i) => (
          <div
            key={team.id}
            className="animate-fadeSlideUp"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
          >
            <TeamCard team={team} onView={onViewTeam} />
          </div>
        ))}
      </div>

      <CreateTeamModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
