"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { pokemonService } from "@/lib/api/pokemon.service";
import type { MyPokemonDto } from "@/lib/api/pokemon.service";

interface PickPokemonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemon: MyPokemonDto) => void;
}

export function PickPokemonModal({
  isOpen,
  onClose,
  onSelect,
}: PickPokemonModalProps) {
  const [list, setList] = useState<MyPokemonDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    pokemonService
      .getMyPokemons()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-poke-red/10 to-rose-50 px-6 py-4">
          <h2 className="font-pixel text-sm text-slate-800">
            MEUS POKÉMON — Escolha um para o time
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-poke-red" />
            </div>
          ) : list.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500">
              Você ainda não tem Pokémon. Capture ou crie um na página Meus Pokémon.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {list.map((p) => (
                <button
                  key={p.uuid}
                  type="button"
                  onClick={() => {
                    onSelect(p);
                    onClose();
                  }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-poke-red/40 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-poke-red"
                >
                  <img
                    src={p.spriteUrl}
                    alt={p.name}
                    className="h-16 w-16 object-contain"
                  />
                  <span className="font-pixel text-[10px] text-slate-800 truncate w-full text-center">
                    {p.name}
                  </span>
                  <span className="text-[9px] text-slate-400">Lv.{p.level}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
