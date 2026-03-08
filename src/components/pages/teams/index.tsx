"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useTeamsHandler } from "./useHandler";
import { TeamListView } from "./components/TeamListView";
import { TeamDetailView } from "./components/TeamDetailView";

export function TeamsPage() {
  const {
    view,
    teams,
    selectedTeam,
    handleViewTeam,
    handleBackToList,
    updateTeam,
    removePokemonFromTeam,
    clearAllPokemonFromTeam,
  } = useTeamsHandler();

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        {view === "list" && (
          <TeamListView teams={teams} onViewTeam={handleViewTeam} />
        )}
        {view === "detail" && selectedTeam && (
          <TeamDetailView
            team={selectedTeam}
            onBack={handleBackToList}
            onUpdateTeam={updateTeam}
            onRemovePokemon={removePokemonFromTeam}
            onClearAll={clearAllPokemonFromTeam}
          />
        )}
      </div>
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
      `}</style>
    </AppLayout>
  );
}
