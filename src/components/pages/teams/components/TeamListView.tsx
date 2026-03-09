"use client";

import { useState, useCallback } from "react";
import { Plus, Trophy, TrendingUp, Star, Loader2 } from "lucide-react";
import type { Team } from "../types";
import type { TeamFilter } from "@/lib/api/team.service";
import type { PaginationMeta } from "@/lib/pagination";
import { TeamCard } from "./TeamCard";
import { CreateTeamModal } from "./CreateTeamModal";
import { PaginationControls } from "@/components/ui/PaginationControls";

interface TeamListViewProps {
  teams: Team[];
  total: number;
  page: number;
  limit: number;
  search: string;
  filter: TeamFilter | "";
  loading: boolean;
  error: string | null;
  onViewTeam: (id: string) => void;
  onFilterChange: (value: TeamFilter | "") => void;
  onPageChange: (page: number) => void;
  onFetchTeams: (opts?: { search?: string; filter?: TeamFilter | "" }) => void;
  onCreateTeam: (data: {
    name: string;
    description: string;
    isPublic?: boolean;
    members?: { pokemonId: number }[];
  }) => Promise<Team>;
  paginationMeta: PaginationMeta;
}

export function TeamListView({
  teams,
  total,
  page,
  limit,
  search,
  filter,
  loading,
  error,
  onViewTeam,
  onFilterChange,
  onPageChange,
  onFetchTeams,
  onCreateTeam,
  paginationMeta,
}: TeamListViewProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const totalWins = teams.reduce((acc, t) => acc + t.wins, 0);
  const sRankCount = teams.filter((t) => t.grade === "S").length;

  const handleFilterClick = useCallback(
    (value: TeamFilter | "") => {
      onFilterChange(value);
      onPageChange(0);
    },
    [onFilterChange, onPageChange]
  );

  const handleCreateSuccess = useCallback(
    async (data: { name: string; description: string; isPublic?: boolean }) => {
      setSubmitting(true);
      try {
        await onCreateTeam(data);
        setCreateOpen(false);
      } finally {
        setSubmitting(false);
      }
    },
    [onCreateTeam]
  );

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
                label: `${total} Teams`,
              },
              {
                icon: <TrendingUp className="h-3 w-3 text-emerald-500" />,
                label: `${totalWins} Total Wins`,
              },
              {
                icon: <Star className="h-3 w-3 text-amber-400" />,
                label: `${sRankCount} S-Rank Teams`,
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

      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        <div className="flex gap-2">
          {(["", "public", "private"] as const).map((f) => (
            <button
              key={f || "all"}
              type="button"
              onClick={() => handleFilterClick(f)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                filter === f
                  ? "border-poke-red bg-poke-red/10 text-poke-red"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {f === "" ? "Todos" : f === "public" ? "Públicos" : "Privados"}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-poke-red" />
        </div>
      ) : !error && teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 opacity-25">
            <svg viewBox="0 0 100 100" className="mx-auto h-16 w-16">
              <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#ef4444" />
              <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#e2e8f0" />
              <rect x="5" y="47" width="90" height="6" fill="#94a3b8" />
              <circle cx="50" cy="50" r="14" fill="#94a3b8" />
              <circle cx="50" cy="50" r="10" fill="#f1f5f9" />
              <circle cx="50" cy="50" r="6" fill="#cbd5e1" />
            </svg>
          </div>
          <p className="font-pixel text-[10px] text-slate-500">No teams found</p>
          <p className="mt-1 text-sm text-slate-400">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <>
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

          {paginationMeta.totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls
                meta={paginationMeta}
                onPageChange={onPageChange}
                showLimitSelector={false}
              />
            </div>
          )}
        </>
      )}

      <CreateTeamModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateSuccess}
        loading={submitting}
      />
    </div>
  );
}
