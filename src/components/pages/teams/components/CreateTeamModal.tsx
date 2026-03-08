"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import type { MyPokemonDto } from "@/lib/api/pokemon.service";
import { Switch } from "@/components/ui/switch";
import { EmptySlot } from "./EmptySlot";
import { PickPokemonModal } from "./PickPokemonModal";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    isPublic?: boolean;
    members?: { pokemonId: number }[];
  }) => Promise<unknown>;
  loading?: boolean;
}

export function CreateTeamModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CreateTeamModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<(MyPokemonDto | null)[]>(
    () => Array(6).fill(null)
  );
  const [pickerForSlot, setPickerForSlot] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedSlots(Array(6).fill(null));
      setPickerForSlot(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPokemon = (pokemon: MyPokemonDto) => {
    if (pickerForSlot === null) return;
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[pickerForSlot] = pokemon;
      return next;
    });
    setPickerForSlot(null);
  };

  const handleClearSlot = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!name.trim() || !desc.trim()) return;
    const members = selectedSlots
      .filter((p): p is MyPokemonDto => p != null)
      .map((p) => ({ pokemonId: p.id }));
    try {
      await onSubmit({
        name: name.trim(),
        description: desc.trim(),
        isPublic,
        members: members.length > 0 ? members : undefined,
      });
      setName("");
      setDesc("");
      setIsPublic(false);
      setSelectedSlots(Array(6).fill(null));
      setPickerForSlot(null);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Erro ao criar time. Tente novamente."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-md animate-modalIn overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-poke-red to-rose-600 px-6 py-5">
          <div>
            <p className="font-pixel text-[9px] uppercase tracking-widest text-white/70">
              Poke Center
            </p>
            <h2 className="font-pixel text-sm text-white">CREATE NEW TEAM</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 opacity-10">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <path
                d="M50 5 A45 45 0 0 1 95 50 L50 50 Z"
                fill="#fff"
              />
              <circle cx="50" cy="50" r="10" fill="#fff" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {submitError && (
            <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700">
              {submitError}
            </p>
          )}
          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Team Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thunder Squad"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white focus:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block font-pixel text-[9px] uppercase tracking-widest text-slate-500">
              Description
            </label>
            <textarea
              rows={3}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe your team strategy..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition-all focus:border-poke-red/40 focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <span className="text-[10px] font-semibold text-slate-600">
              Time público
            </span>
            <Switch
              checked={isPublic}
              onCheckedChange={setIsPublic}
              className="data-[state=checked]:bg-poke-red"
            />
          </div>
          <div>
            <p className="mb-2 font-pixel text-[9px] uppercase tracking-widest text-slate-400">
              Pokémon Slots
            </p>
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const p = selectedSlots[i];
                return p ? (
                  <div
                    key={i}
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <img
                      src={p.spriteUrl}
                      alt={p.name}
                      className="h-8 w-8 object-contain"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleClearSlot(i, e)}
                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-poke-red"
                      aria-label="Remover"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPickerForSlot(i)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red focus-visible:ring-offset-2 rounded-xl"
                  >
                    <EmptySlot />
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[10px] text-slate-400">
              Clique em um slot para escolher um Pokémon. Você pode editar o time após criar.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-3 font-pixel text-[10px] tracking-wider text-white transition-all focus:outline-none active:scale-[0.98] disabled:opacity-70 ${
              loading
                ? "bg-slate-400"
                : "bg-gradient-to-r from-poke-red to-rose-600 hover:shadow-lg hover:shadow-poke-red/30"
            }`}
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> CREATING...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> CREATE TEAM
              </>
            )}
          </button>
        </form>
      </div>

      <PickPokemonModal
        isOpen={pickerForSlot !== null}
        onClose={() => setPickerForSlot(null)}
        onSelect={handleSelectPokemon}
      />
    </div>
  );
}
