"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { usePokemonDetailHandler } from "./useHandler";
import { getDetailTypeStyle } from "./data";
import { DetailHero } from "./components/DetailHero";
import { PokedexCard } from "./components/PokedexCard";
import { DetailTabs } from "./components/DetailTabs";
import { EditPokemonModal } from "@/components/modal/edit-pokemon";

export function PokemonDetailPage() {
  const { pokemon, loading, error, handleBack, refetch } = usePokemonDetailHandler();
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-poke-red" />
        </div>
      </AppLayout>
    );
  }

  if (error || !pokemon) {
    return (
      <AppLayout>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
          <p className="text-center text-slate-600">{error ?? "Pokémon não encontrado."}</p>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl bg-poke-red px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Voltar à lista
          </button>
        </div>
      </AppLayout>
    );
  }

  const primaryType = getDetailTypeStyle(pokemon.types[0]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50">
        <DetailHero
          pokemon={pokemon}
          onBack={handleBack}
          onEditClick={() => setEditModalOpen(true)}
        />

        <div className="mx-auto -mt-12 max-w-5xl px-4 pb-16 sm:px-6">
          <PokedexCard pokemon={pokemon} />
          <DetailTabs
            pokemon={pokemon}
            primaryGradient={primaryType.gradient}
            onBack={handleBack}
          />
        </div>
      </div>

      <EditPokemonModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={refetch}
        pokemon={pokemon}
      />

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </AppLayout>
  );
}
