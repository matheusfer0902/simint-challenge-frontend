"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { usePokemonDetailHandler } from "./useHandler";
import { getDetailTypeStyle } from "./data";
import { DetailHero } from "./components/DetailHero";
import { PokedexCard } from "./components/PokedexCard";
import { DetailTabs } from "./components/DetailTabs";

export function PokemonDetailPage() {
  const { pokemon, handleBack } = usePokemonDetailHandler();
  const primaryType = getDetailTypeStyle(pokemon.types[0]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50">
        <DetailHero pokemon={pokemon} onBack={handleBack} />

        <div className="mx-auto -mt-12 max-w-5xl px-4 pb-16 sm:px-6">
          <PokedexCard pokemon={pokemon} />
          <DetailTabs
            pokemon={pokemon}
            primaryGradient={primaryType.gradient}
            onBack={handleBack}
          />
        </div>
      </div>
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </AppLayout>
  );
}
