"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useTeamDetailHandler } from "./useHandler";
import { TeamDetailView } from "@/components/pages/teams/components/TeamDetailView";

export function TeamDetailPage() {
  const {
    team,
    loading,
    error,
    handleBack,
    refetch,
    updateTeam,
    deleteTeam,
    shareTeam,
    registerBattle,
    addMember,
    removeMember,
  } = useTeamDetailHandler();

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <TeamDetailView
          team={team}
          loading={loading}
          error={error}
          onBack={handleBack}
          onUpdateTeam={updateTeam}
          onDeleteTeam={deleteTeam}
          onShareTeam={shareTeam}
          onRegisterBattle={registerBattle}
          onRefresh={refetch}
          onAddMember={addMember}
          onRemoveMember={removeMember}
        />
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
