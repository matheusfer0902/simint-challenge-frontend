"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Edit3,
  Star,
  Trophy,
  TrendingUp,
  Zap,
  Pencil,
  Globe,
  Lock,
  Trash2,
  Loader2,
} from "lucide-react";
import { RANK_STYLE } from "../data";
import type { Team } from "../types";
import type { PokemonSummary } from "../types";
import { membersToSlots } from "../types";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PokemonSlotCard } from "./PokemonSlotCard";
import { PickPokemonModal } from "./PickPokemonModal";
import { ShareTeamBox } from "./ShareTeamBox";
import { EditTeamModal } from "./EditTeamModal";
import { RegisterBattleButtons } from "./RegisterBattleButtons";

interface TeamDetailViewProps {
  team: Team | null;
  loading: boolean;
  error: string | null;
  onBack: () => void;
  onUpdateTeam: (
    teamId: string,
    data: { name?: string; description?: string; isPublic?: boolean }
  ) => Promise<void>;
  onDeleteTeam: (teamId: string) => Promise<void>;
  onShareTeam: (teamId: string, sharedWithUserId: string) => Promise<void>;
  onRegisterBattle: (teamId: string, result: "win" | "loss") => Promise<void>;
  onRefresh: (id: string) => Promise<void>;
  onAddMember?: (teamId: string, pokemonId: number) => Promise<void>;
  onRemoveMember?: (teamId: string, memberId: string) => Promise<void>;
}

export function TeamDetailView({
  team,
  loading,
  error,
  onBack,
  onUpdateTeam,
  onDeleteTeam,
  onShareTeam,
  onRegisterBattle,
  onAddMember,
  onRemoveMember,
}: TeamDetailViewProps) {
  const [editingName, setEditingName] = useState(false);
  const [teamName, setTeamName] = useState(team?.name ?? "");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTeamName(team?.name ?? "");
  }, [team?.name]);

  if (loading && !team) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-poke-red" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-4 flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-poke-red"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Teams
        </button>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-red-700">
          {error || "Time não encontrado."}
        </div>
      </div>
    );
  }

  const slots = membersToSlots(team.members);
  const filledSlots = team.members.length;
  const avgLevel =
    filledSlots > 0
      ? Math.round(
          team.members.reduce((s, m) => s + (m.level ?? 0), 0) / filledSlots
        )
      : 0;
  const winRate =
    team.battles > 0 ? Math.round((team.wins / team.battles) * 100) : 0;
  const isOwner = team.accessRole === "owner";

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
                {editingName && isOwner ? (
                  <input
                    ref={nameInputRef}
                    autoFocus
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    onBlur={() => {
                      setEditingName(false);
                      if (teamName.trim())
                        onUpdateTeam(team.id, { name: teamName.trim() });
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setEditingName(false);
                        if (teamName.trim())
                          onUpdateTeam(team.id, { name: teamName.trim() });
                      }
                    }}
                    className="border-b-2 border-poke-red/60 bg-transparent font-pixel text-xl text-white outline-none sm:text-2xl"
                  />
                ) : (
                  <h1 className="font-pixel text-xl text-white sm:text-2xl">
                    {teamName}
                  </h1>
                )}
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => setEditingName((v) => !v)}
                    className="rounded-lg bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                    title="Edit team name"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mb-3 max-w-md text-sm text-slate-400">
                {team.description ?? "—"}
              </p>
              <div className="flex flex-wrap gap-2">
                <div
                  className={`flex items-center gap-1.5 rounded-xl bg-gradient-to-r ${RANK_STYLE[team.grade]} px-3 py-1.5`}
                >
                  <Star className="h-3.5 w-3.5 text-white" />
                  <span className="font-pixel text-[9px] text-white">
                    RANK {team.grade}
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

      {isOwner && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <RegisterBattleButtons
            teamId={team.id}
            onRegister={onRegisterBattle}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 rounded-full bg-poke-red" />
          <h2 className="font-pixel text-[11px] uppercase tracking-widest text-slate-600">
            Team Roster ({filledSlots}/6)
          </h2>
        </div>
        {isOwner && (
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
              onClick={() => setDeleteDialogOpen(true)}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[10px] font-semibold text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              Excluir time
            </button>
          </div>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-fadeSlideUp"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
          >
            <PokemonSlotCard
              pokemon={slots[i] ?? null}
              slot={i}
              onRemove={
                isOwner && onRemoveMember && team.members[i]
                  ? () => onRemoveMember(team.id, team.members[i].id)
                  : undefined
              }
              onAddClick={
                isOwner && onAddMember && !slots[i]
                  ? () => setPickerSlot(i)
                  : undefined
              }
            />
          </div>
        ))}
      </div>

      {isOwner && onAddMember && (
        <PickPokemonModal
          isOpen={pickerSlot !== null}
          onClose={() => setPickerSlot(null)}
          onSelect={async (pokemon) => {
            if (pickerSlot === null || !team) return;
            try {
              await onAddMember(team.id, pokemon.id);
              setPickerSlot(null);
            } catch {
              // keep modal open on error so user can retry
            }
          }}
        />
      )}

      {isOwner && (
        <EditTeamModal
          team={team}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={({ name, description }) =>
            onUpdateTeam(team.id, { name, description })
          }
        />
      )}

      {isOwner && !team.isPublic && (
        <>
          <div className="mb-6 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-poke-red" />
            <h2 className="font-pixel text-[11px] uppercase tracking-widest text-slate-600">
              Compartilhar time
            </h2>
          </div>
          <ShareTeamBox team={team} onShare={onShareTeam} />
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl border-slate-200 bg-white p-0 shadow-xl">
          <AlertDialogHeader className="gap-2 px-6 pt-6 text-left">
            <AlertDialogTitle className="font-pixel text-base text-slate-800">
              Excluir time?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              Esta ação não pode ser desfeita. O time <strong>{team.name}</strong> e todos os dados associados serão removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-end gap-2 px-6 pb-6 pt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 bg-white px-4 text-slate-600 hover:bg-slate-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                setDeleting(true);
                try {
                  await onDeleteTeam(team.id);
                } finally {
                  setDeleting(false);
                }
              }}
              className="rounded-xl bg-red-600 px-4 text-white hover:bg-red-700 focus:ring-red-500"
            >
              Excluir time
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
