"use client";

import { useRef } from "react";
import { X, ChevronDown, CheckCircle2, Plus, AlertCircle, ImagePlus } from "lucide-react";
import { AppInput } from "@/components/shared/AppInput";
import { AppButton } from "@/components/shared/AppButton";
import { useKeyPress } from "@/lib/hooks/use-key-press";
import { getMeta, TYPES_LIST } from "@/components/pages/pokemon/data";
import { TypeBadge } from "@/components/pages/pokemon/components/TypeBadge";
import type { CreatePokemonConflictItemDto } from "@/lib/api/pokemon.service";
import { ALLOWED_IMAGE_TYPES, MAX_SPRITE_SIZE_BYTES } from "@/lib/utils/file-upload";
import { useCreatePokemonHandler, NONE_TYPE } from "./useHandler";

interface CreatePokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

function ConflictCard({
  kind,
  pokemon,
}: {
  kind: "name" | "pokedex";
  pokemon: CreatePokemonConflictItemDto;
}) {
  const kindLabel = kind === "name" ? "Name conflict" : "Pokedex number conflict";
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

export function CreatePokemonModal({ isOpen, onClose, onSuccess }: CreatePokemonModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    form,
    setField,
    spriteFile,
    spriteError,
    handleSpriteChange,
    clearSprite,
    loading,
    success,
    error,
    conflicts,
    handleSubmit,
    handleClose,
  } = useCreatePokemonHandler(onSuccess, onClose);

  useKeyPress("Escape", handleClose);

  const onSpriteInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const result = await handleSpriteChange(file ?? null);
    if (result?.clearInput && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onClearSprite = () => {
    clearSprite();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  const { gradient } = getMeta(form.primaryType);

  const previewTypes =
    form.secondaryType !== NONE_TYPE
      ? [form.primaryType, form.secondaryType]
      : [form.primaryType];

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white";
  const labelCls = "block font-pixel text-[9px] uppercase tracking-widest text-slate-500";
  const labelSmallCls = "block font-pixel text-[8px] uppercase tracking-widest text-slate-400";

  return (
    <div
      className={`fixed inset-0 z-50 flex p-4 ${conflicts ? "items-start justify-start md:justify-center" : "items-center justify-center"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Create New Pokémon"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />

      <div
        className={`relative z-10 flex w-full gap-6 ${conflicts ? "max-w-5xl pl-4" : "max-w-md"} ${!conflicts ? "animate-modalIn" : ""}`}
      >
        <div className="w-full max-w-md shrink-0 overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className={`relative flex items-center justify-between bg-gradient-to-r ${gradient} px-6 py-5`}>
            <div>
              <p className="font-pixel text-[9px] uppercase tracking-widest text-white/70">Pokémon Manager</p>
              <h2 className="font-pixel text-[13px] text-white">CREATE POKÉMON</h2>
            </div>
            <button
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
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className={labelCls}>Pokémon Name</label>
                <AppInput
                  variant="search"
                  required
                  value={form.name}
                  onChange={(v) => setField("name", v)}
                  placeholder="Ex: Pikachu"
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls}>Pokédex Number</label>
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
                <label className={labelCls}>Primary Type</label>
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
                <label className={labelCls}>Secondary Type</label>
                <div className="relative">
                  <select
                    value={form.secondaryType}
                    onChange={(e) => setField("secondaryType", e.target.value)}
                    className={inputCls + " appearance-none pr-8"}
                  >
                    <option value={NONE_TYPE}>None</option>
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

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "level", label: "Level", min: 1, max: 100 },
                  { key: "hp", label: "HP", min: 1, max: 255 },
                ].map(({ key, label, min, max }) => (
                  <div key={key} className="space-y-1">
                    <label className={labelSmallCls}>{label}</label>
                    <input
                      type="number"
                      min={min}
                      max={max}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setField(key, e.target.value)}
                      className={inputCls + " px-3 py-2"}
                    />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "baseAttack", label: "Attack", min: 1, max: 255 },
                  { key: "baseDefense", label: "Defense", min: 1, max: 255 },
                  { key: "baseSpeed", label: "Speed", min: 1, max: 255 },
                ].map(({ key, label, min, max }) => (
                  <div key={key} className="space-y-1">
                    <label className={labelSmallCls}>{label}</label>
                    <input
                      type="number"
                      min={min}
                      max={max}
                      required
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setField(key, e.target.value)}
                      className={inputCls + " px-3 py-2"}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelCls}>Sprite</label>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_IMAGE_TYPES.join(",")}
                  onChange={onSpriteInputChange}
                  className="hidden"
                />
                <div className="flex min-w-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 transition-colors hover:border-poke-red/40 hover:bg-white"
                    title={spriteFile ? spriteFile.name : undefined}
                  >
                    <ImagePlus className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="min-w-0 truncate" title={spriteFile ? spriteFile.name : undefined}>
                      {spriteFile ? spriteFile.name : "Escolher imagem"}
                    </span>
                  </button>
                  {spriteFile && (
                    <button
                      type="button"
                      onClick={onClearSprite}
                      className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-600 hover:bg-slate-200"
                    >
                      Remover
                    </button>
                  )}
                </div>
                {spriteError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {spriteError}
                  </p>
                )}
                <p className="text-[10px] text-slate-400">
                  Max. {MAX_SPRITE_SIZE_BYTES / 1024 / 1024} MB. The file is validated by type and signature.
                </p>
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
                    <span className="font-pixel text-[10px] tracking-wider">POKÉMON CREATED!</span>
                  </span>
                ) : undefined
              }
              icon={<Plus className="h-4 w-4" />}
              className={success ? "from-emerald-500 to-green-600 shadow-emerald-500/30" : ""}
            >
              <span className="font-pixel text-[10px] tracking-wider">CREATE POKÉMON</span>
            </AppButton>
          </form>
        </div>

        {conflicts && (
          <div className="flex min-w-0 flex-1 flex-col rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-xl">
            <h3 className="font-pixel text-[11px] uppercase tracking-widest text-slate-500">
              Pokemon in conflict
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              There is already a Pokemon that uses the name or the Pokedex number you tried to use.
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
