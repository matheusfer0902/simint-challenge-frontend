"use client";

import { useState } from "react";
import { X, ChevronDown, CheckCircle2, Plus, AlertCircle } from "lucide-react";
import { AppInput } from "@/components/shared/AppInput";
import { AppButton } from "@/components/shared/AppButton";
import { useKeyPress } from "@/lib/hooks/use-key-press";
import { getMeta, TYPES_LIST } from "../data";
import { TypeBadge } from "./TypeBadge";
import { pokemonService } from "@/lib/api/pokemon.service";

interface NewPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SPRITE_URL = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

const NONE_TYPE = "none";

export function NewPokemonModal({ isOpen, onClose, onSuccess }: NewPokemonModalProps) {
  const [form, setForm] = useState({
    name: "",
    primaryType: "normal",
    secondaryType: NONE_TYPE,
    level: "1",
    hp: "45",
    pokedexId: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useKeyPress("Escape", onClose);

  const setField = (field: string, value: string) => {
    setError(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    const pokedexId = parseInt(form.pokedexId, 10);
    if (!form.pokedexId || isNaN(pokedexId) || pokedexId <= 0) {
      setError("Informe um número válido da Pokédex.");
      return;
    }

    const types =
      form.secondaryType !== NONE_TYPE
        ? [form.primaryType, form.secondaryType]
        : [form.primaryType];

    const hp = parseInt(form.hp, 10);
    const level = parseInt(form.level, 10);

    setLoading(true);
    setError(null);

    try {
      await pokemonService.create({
        name: form.name,
        types,
        id: pokedexId,
        level,
        hp,
        currentHp: hp,
        spriteUrl: SPRITE_URL(pokedexId),
      });

      setSuccess(true);
      onSuccess?.();

      setTimeout(() => {
        setSuccess(false);
        setForm({ name: "", primaryType: "normal", secondaryType: NONE_TYPE, level: "1", hp: "45", pokedexId: "" });
        onClose();
      }, 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar o Pokémon. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const { gradient } = getMeta(form.primaryType);

  const previewTypes =
    form.secondaryType !== NONE_TYPE
      ? [form.primaryType, form.secondaryType]
      : [form.primaryType];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create New Pokémon"
    >
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md animate-modalIn overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className={`relative flex items-center justify-between bg-gradient-to-r ${gradient} px-6 py-5`}>
          <div>
            <p className="font-pixel text-[9px] uppercase tracking-widest text-white/70">Pokémon Manager</p>
            <h2 className="font-pixel text-[13px] text-white">CREATE POKÉMON</h2>
          </div>
          <button
            onClick={onClose}
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
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Pokémon Name
            </label>
            <AppInput
              variant="search"
              required
              value={form.name}
              onChange={(v) => setField("name", v)}
              placeholder="Ex: Pikachu"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Pokédex Number
            </label>
            <AppInput
              variant="search"
              required
              value={form.pokedexId}
              onChange={(v) => setField("pokedexId", v.replace(/\D/g, ""))}
              placeholder="Ex: 25 (Pikachu)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
                Primary Type
              </label>
              <div className="relative">
                <select
                  value={form.primaryType}
                  onChange={(e) => setField("primaryType", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
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
              <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
                Secondary Type
              </label>
              <div className="relative">
                <select
                  value={form.secondaryType}
                  onChange={(e) => setField("secondaryType", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
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

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "level", label: "Level", min: 1, max: 100 },
              { key: "hp",    label: "HP",    min: 1, max: 255 },
            ].map(({ key, label, min, max }) => (
              <div key={key} className="space-y-1">
                <label className="block font-pixel text-[8px] uppercase tracking-widest text-slate-400">
                  {label}
                </label>
                <input
                  type="number"
                  min={min}
                  max={max}
                  required
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setField(key, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
                />
              </div>
            ))}
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
    </div>
  );
}
