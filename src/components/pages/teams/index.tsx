"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTeamsHandler } from "./useHandler";
import { TeamListView } from "./components/TeamListView";

const SEARCH_DEBOUNCE_MS = 400;

export function TeamsPage() {
  const router = useRouter();
  const {
    teams,
    total,
    page,
    limit,
    search,
    filter,
    listLoading,
    listError,
    fetchTeams,
    setSearch,
    setFilter,
    setPage,
    createTeam,
    paginationMeta,
  } = useTeamsHandler();

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHeaderSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = setTimeout(() => {
        searchDebounceRef.current = null;
        setSearch(value);
        setPage(0);
      }, SEARCH_DEBOUNCE_MS);
    },
    [setSearch, setPage, fetchTeams, filter]
  );

  const handleViewTeam = useCallback(
    (id: string) => {
      router.push(`/teams/${id}`);
    },
    [router]
  );

  return (
    <AppLayout
      search={search}
      onSearchChange={handleHeaderSearchChange}
      searchPlaceholder="Buscar times…"
    >
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <TeamListView
          teams={teams}
          total={total}
          page={page}
          limit={limit}
          search={search}
          filter={filter}
          loading={listLoading}
          error={listError}
          onViewTeam={handleViewTeam}
          onFilterChange={setFilter}
          onPageChange={setPage}
          onFetchTeams={fetchTeams}
          onCreateTeam={createTeam}
          paginationMeta={paginationMeta}
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
