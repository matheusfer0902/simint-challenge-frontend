"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Edit3,
  Star,
  Trophy,
  TrendingUp,
  Zap,
  Trash2,
  Pencil,
  Globe,
  Lock,
} from "lucide-react";
import { RANK_STYLE } from "../data";
import type { Team } from "../types";
import type { PokemonSummary } from "../types";
import { Switch } from "@/components/ui/switch";
import { PokemonSlotCard } from "./PokemonSlotCard";
import { ShareLinkBox } from "./ShareLinkBox";
import { EditTeamModal } from "./EditTeamModal";

interface TeamDetailViewProps {
  team: Team;
  onBack: () => void;
  onUpdateTeam: (
    teamId: string,
    data: { name?: string; description?: string; isPublic?: boolean }
  ) => void;
  onRemovePokemon: (teamId: string, slotIndex: number) => void;
  onClearAll: (teamId: string) => void;
}

export function TeamDetailView({
  team,
  onBack,
  onUpdateTeam,
  onRemovePokemon,
  onClearAll,
}: TeamDetailViewProps) {
  const [editingName, setEditingName] = useState(false);
  const [teamName, setTeamName] = useState(team.name);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTeamName(team.name);
  }, [team.name]);

  const avgLevel = Math.round(
    team.pokemon
      .filter(Boolean)
      .reduce(
        (sum, p) => sum + (p as PokemonSummary).level,
        0
      ) / Math.max(team.pokemon.filter(Boolean).length, 1)
  );
  const winRate = Math.round(
    (team.wins / (team.wins + team.losses)) * 100
  );

  return (
    <div>
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-poke-red"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Teams
        </button>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 opacity-[0.06]">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#fff" />
              <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" />
              <rect x="5" y="47" width="90" height="6" fill="#000" />
              <circle cx="50" cy="50" r="14" fill="#000" />
              <circle cx="50" cy="50" r="10" fill="#fff" />
              <circle cx="50" cy="50" r="6" fill="#000" />
            </svg>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                {editingName ? (
                  <input
                    ref={nameInputRef}
                    autoFocus
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    onBlur={() => {
                      setEditingName(false);
                      if (teamName.trim()) onUpdateTeam(team.id, { name: teamName.trim() });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingName(false);
                        if (teamName.trim()) onUpdateTeam(team.id, { name: teamName.trim() });
                      }
                    }}
                    className="border-b-2 border-poke-red/60 bg-transparent font-pixel text-xl text-white outline-none sm:text-2xl"
                  />
                ) : (
                  <h1 className="font-pixel text-xl text-white sm:text-2xl">
                    {teamName}
                  </h1>
                )}
                <button
                  type="button"
                  onClick={() => setEditingName((v) => !v)}
                  className="rounded-lg bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  title="Edit team name"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mb-3 max-w-md text-sm text-slate-400">
                {team.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${RANK_STYLE[team.rank]} px-3 py-1.5`}
                >
                  <Star className="h-3.5 w-3.5 text-white" />
                  <span className="font-pixel text-[9px] text-white">
                    RANK {team.rank}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 sm:flex-col">
              {[
                {
                  label: "Wins",
                  value: team.wins,
                  color: "text-emerald-400",
                  icon: <Trophy className="h-4 w-4" />,
                },
                {
                  label: "Win Rate",
                  value: `${winRate}%`,
                  color: "text-blue-400",
                  icon: <TrendingUp className="h-4 w-4" />,
                },
                {
                  label: "Avg Level",
                  value: `Lv.${avgLevel}`,
                  color: "text-yellow-400",
                  icon: <Zap className="h-4 w-4" />,
                },
              ].map(({ label, value, color, icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2.5 backdrop-blur-sm"
                >
                  <span className={color}>{icon}</span>
                  <div>
                    <p className="font-pixel text-[8px] uppercase tracking-wider text-white/50">
                      {label}
                    </p>
                    <p className={`font-pixel text-sm ${color}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 h-px bg-gradient-to-r from-poke-red/30 via-slate-200 to-transparent" />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-poke-red" />
          <h2 className="font-pixel text-[11px] uppercase tracking-widest text-slate-600">
            Team Roster ({team.pokemon.filter(Boolean).length}/6)
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            {team.isPublic ? (
              <Globe className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span className="text-[10px] font-semibold text-slate-600">
              {team.isPublic ? "Público" : "Privado"}
            </span>
            <Switch
              checked={team.isPublic}
              onCheckedChange={(checked) =>
                onUpdateTeam(team.id, { isPublic: checked })
              }
              className="data-[state=checked]:bg-poke-red"
            />
          </div>
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-500 transition-all hover:border-poke-red/30 hover:text-poke-red"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Team
          </button>
          <button
            type="button"
            onClick={() => onClearAll(team.id)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[10px] font-semibold text-slate-500 transition-all hover:border-poke-red/30 hover:text-poke-red"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear All
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-fadeSlideUp"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
            <PokemonSlotCard
              pokemon={team.pokemon[i] ?? null}
              slot={i}
              onRemove={
                team.pokemon[i]
                  ? () => onRemovePokemon(team.id, i)
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      <EditTeamModal
        team={team}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={({ name, description }) =>
          onUpdateTeam(team.id, { name, description })
        }
      />

      <div className="mb-6 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-poke-red" />
        <h2 className="font-pixel text-[11px] uppercase tracking-widest text-slate-600">
          Share Team
        </h2>
      </div>
      <ShareLinkBox team={team} />
    </div>
  );
}
