"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { usePokemonHandler } from "./useHandler";
import { PokemonTabBar } from "./components/PokemonTabBar";
import { YourPokemonGrid } from "./components/YourPokemonGrid";
import { WildAreaGrid } from "./components/WildAreaGrid";
import { NewPokemonModal } from "./components/NewPokemonModal";
import { DetailModal } from "./components/DetailModal";

export function PokemonPage() {
  const {
    activeTab,
    modalOpen,
    setModalOpen,
    detailPokemon,
    setDetailPokemon,
    handleTabChange,
    handleDetails,
    handleCatch,
    handleCreateSuccess,
    search,
    handleSearchChange,
    myPokemon,
    wildPokemon,
    myLoading,
    wildLoading,
  } = usePokemonHandler();

  const stats = [
    { label: "Total",    value: myLoading   ? "—" : myPokemon.length,                                     color: "text-slate-700" },
    { label: "Created",  value: myLoading   ? "—" : myPokemon.filter((p) => p.tag === "created").length,  color: "text-emerald-600" },
    { label: "Captured", value: myLoading   ? "—" : myPokemon.filter((p) => p.tag === "captured").length, color: "text-blue-600" },
  ];

  return (
    <AppLayout search={search} onSearchChange={handleSearchChange} searchPlaceholder="Search Pokémon">
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-pixel text-2xl text-poke-red sm:text-3xl">POKÉMON MANAGER</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Manage your collection, explore wild areas, and register new Pokémon.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {stats.map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <span className={`font-pixel text-sm ${color}`}>{value}</span>
                <span className="text-[10px] text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <PokemonTabBar active={activeTab} onChange={handleTabChange} />
        </div>

        <div className="mb-6 h-px bg-gradient-to-r from-poke-red/30 via-slate-200 to-transparent" />

        {activeTab === "your-pokemon" && (
          <YourPokemonGrid
            pokemon={myPokemon}
            loading={myLoading}
            onDetails={handleDetails}
          />
        )}
        {activeTab === "wild-area" && (
          <WildAreaGrid
            pokemon={wildPokemon}
            loading={wildLoading}
            onCatch={handleCatch}
          />
        )}
      </div>

      <NewPokemonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
      <DetailModal pokemon={detailPokemon} onClose={() => setDetailPokemon(null)} />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp { animation: fadeSlideUp 0.35s ease-out; }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modalIn { animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1); }

        @keyframes shimmer {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
        .group-hover\\:animate-shimmer { animation: shimmer 0.6s ease-in-out; }
      `}</style>
    </AppLayout>
  );
}
