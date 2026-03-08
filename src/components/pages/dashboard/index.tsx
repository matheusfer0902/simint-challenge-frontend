"use client";

import { Pokeball } from "@/components/landing/Pokeball";
import { AppLayout } from "@/components/layout/AppLayout";
import { useDashboardHandler } from "./useHandler";
import { TabBar } from "./components/TabBar";
import { BattleCard } from "./components/BattleCard";
import { UserCard } from "./components/UserCard";
import { EmptyState } from "./components/EmptyState";

export function DashboardPage() {
  const {
    isLoading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    filteredBattles,
    filteredUsers,
    isEmpty,
    debouncedSearch,
  } = useDashboardHandler();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin">
            <Pokeball size={56} animate={false} />
          </div>
          <p className="font-pixel text-xs text-poke-dark-gray/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout
      search={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search teams, users..."
    >
      <div className="px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-pixel text-base text-slate-800 sm:text-lg">Arena</h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeTab === "battle"
                ? "Challenge teams or find opponents"
                : "Connect with other trainers"}
            </p>
          </div>
          <TabBar
            active={activeTab}
            onChange={setActiveTab}
            battleCount={filteredBattles.length}
            usersCount={filteredUsers.length}
          />
        </div>

        {isEmpty && debouncedSearch ? (
          <EmptyState query={debouncedSearch} />
        ) : activeTab === "battle" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredBattles.map((card, i) => (
              <div
                key={card.id}
                className="animate-fadeSlideUp"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <BattleCard card={card} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filteredUsers.map((u, i) => (
              <div
                key={u.id}
                className="animate-fadeSlideUp"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: "both" }}
              >
                <UserCard user={u} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp {
          animation: fadeSlideUp 0.35s ease-out;
        }
      `}</style>
    </AppLayout>
  );
}
