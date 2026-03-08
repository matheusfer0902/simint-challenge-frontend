"use client";

import { X, ChevronDown, CheckCircle2, Pencil } from "lucide-react";
import { AppInput } from "@/components/shared/AppInput";
import { AppButton } from "@/components/shared/AppButton";
import { useKeyPress } from "@/lib/hooks/use-key-press";
import { getMeta, TYPES_LIST } from "@/components/pages/pokemon/data";
import { TypeBadge } from "@/components/pages/pokemon/components/TypeBadge";
import type { CreatePokemonConflictItemDto } from "@/lib/api/pokemon.service";
import type { PokemonDetail } from "@/components/pages/pokemon-detail/types";
import { useEditPokemonHandler, type EditPokemonForm } from "./useHandler";
import { NONE_TYPE } from "@/components/modal/create-pokemon/useHandler";

function ConflictCard({
  kind,
  pokemon,
}: {
  kind: "name" | "pokedex";
  pokemon: CreatePokemonConflictItemDto;
}) {
  const kindLabel = kind === "name" ? "Conflito de nome" : "Conflito de número da Pokédex";
  const kindBg = kind === "name" ? "bg-amber-500/15 border-amber-400/50" : "bg-rose-500/15 border-rose-400/50";
  const kindBadge = kind === "name" ? "text-amber-700 bg-amber-200/80" : "text-rose-700 bg-rose-200/80";
  return (
    <div className={`rounded-2xl border-2 ${kindBg} p-4 shadow-lg`}>
      <span className={`inline-block rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${kindBadge}`}>
        {kindLabel}
      </span>
      <div className="mt-3 flex items-start gap-3">
        <img
          src={pokemon.spriteUrl}
          alt={pokemon.name}
          className="h-16 w-16 shrink-0 rounded-xl bg-slate-100 object-cover"
        />
        <div className="min-w-0">
          <p className="font-semibold text-slate-800">{pokemon.name}</p>
          <p className="text-xs text-slate-500">ID #{pokemon.id}</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {pokemon.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface EditPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pokemon: PokemonDetail | null;
}

export function EditPokemonModal({ isOpen, onClose, onSuccess, pokemon }: EditPokemonModalProps) {
  const {
    form,
    setField,
    loading,
    success,
    error,
    conflicts,
    handleSubmit,
    handleClose,
  } = useEditPokemonHandler(pokemon, onSuccess, onClose);

  useKeyPress("Escape", handleClose);

  if (!isOpen) return null;

  const primaryType = (form as EditPokemonForm).primaryType || "normal";
  const { gradient } = getMeta(primaryType);
  const previewTypes =
    (form as EditPokemonForm).secondaryType !== NONE_TYPE
      ? [(form as EditPokemonForm).primaryType, (form as EditPokemonForm).secondaryType]
      : [(form as EditPokemonForm).primaryType];

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white";
  const labelCls = "block font-pixel text-[9px] uppercase tracking-widest text-slate-500";
  const labelSmallCls = "block font-pixel text-[8px] uppercase tracking-widest text-slate-400";

  return (
    <div
      className={`fixed inset-0 z-50 flex p-4 ${conflicts ? "items-start justify-start md:justify-center" : "items-center justify-center"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Edit Pokémon"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div
        className={`relative z-10 flex w-full gap-6 ${conflicts ? "max-w-5xl pl-4" : "max-w-md"} ${!conflicts ? "animate-modalIn" : ""}`}
      >
        <div className="w-full max-w-md shrink-0 overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className={`relative flex items-center justify-between bg-gradient-to-r ${gradient} px-6 py-5`}>
            <div>
              <p className="font-pixel text-[9px] uppercase tracking-widest text-white/70">Pokémon Manager</p>
              <h2 className="font-pixel text-[13px] text-white">EDITAR POKÉMON</h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 opacity-10">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <path d="M50 5 A45 45 0 0 1 95 50 L50 50 Z" fill="#fff" />
                <path d="M50 95 A45 45 0 0 1 5 50 L50 50 Z" fill="#fff" />
                <rect x="5" y="47" width="90" height="6" fill="#000" />
                <circle cx="50" cy="50" r="10" fill="#000" />
                <circle cx="50" cy="50" r="6" fill="#fff" />
              </svg>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelCls}>Nome do Pokémon</label>
                <AppInput
                  variant="search"
                  required
                  value={form.name}
                  onChange={(v) => setField("name", v)}
                  placeholder="Ex: Pikachu"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Número da Pokédex</label>
                <AppInput
                  variant="search"
                  required
                  value={form.pokedexId}
                  onChange={(v) => setField("pokedexId", v.replace(/\D/g, ""))}
                  placeholder="Ex: 25"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelCls}>Tipo primário</label>
                <div className="relative">
                  <select
                    value={form.primaryType}
                    onChange={(e) => setField("primaryType", e.target.value)}
                    className={inputCls + " appearance-none pr-8"}
                  >
                    {TYPES_LIST.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Tipo secundário</label>
                <div className="relative">
                  <select
                    value={form.secondaryType}
                    onChange={(e) => setField("secondaryType", e.target.value)}
                    className={inputCls + " appearance-none pr-8"}
                  >
                    <option value={NONE_TYPE}>Nenhum</option>
                    {TYPES_LIST.filter((t) => t !== form.primaryType).map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {previewTypes.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
              <span className="text-[10px] text-slate-400">preview</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelSmallCls}>Nível</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={form.level}
                  onChange={(e) => setField("level", e.target.value)}
                  className={inputCls + " px-3 py-2"}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelSmallCls}>HP</label>
                <input
                  type="number"
                  min={1}
                  max={255}
                  required
                  value={form.hp}
                  onChange={(e) => setField("hp", e.target.value)}
                  className={inputCls + " px-3 py-2"}
                />
              </div>
            </div>

            <AppButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading || success}
              loadingIndicator={
                success ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="font-pixel text-[10px] tracking-wider">POKÉMON ATUALIZADO!</span>
                  </span>
                ) : undefined
              }
              icon={<Pencil className="h-4 w-4" />}
              className={success ? "from-emerald-500 to-green-600 shadow-emerald-500/30" : ""}
              disabled={!pokemon}
            >
              <span className="font-pixel text-[10px] tracking-wider">SALVAR ALTERAÇÕES</span>
            </AppButton>
          </form>
        </div>

        {conflicts && (
          <div className="flex min-w-0 flex-1 flex-col rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="font-pixel text-[11px] uppercase tracking-widest text-slate-500">
              Pokémon em conflito
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Já existe um Pokémon que usa o nome ou o número da Pokédex que você tentou usar.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {conflicts.nameConflict && (
                <ConflictCard kind="name" pokemon={conflicts.nameConflict} />
              )}
              {conflicts.pokedexConflict && (
                <ConflictCard kind="pokedex" pokemon={conflicts.pokedexConflict} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
