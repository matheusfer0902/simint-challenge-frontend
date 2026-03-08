"use client";

import { useState, useCallback } from "react";
import { MOCK_TEAMS } from "./data";
import type { Team } from "./types";

export type TeamsView = "list" | "detail";

export function useTeamsHandler() {
  const [view, setView] = useState<TeamsView>("list");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>(() =>
    JSON.parse(JSON.stringify(MOCK_TEAMS))
  );

  const selectedTeam =
    selectedTeamId != null
      ? teams.find((t) => t.id === selectedTeamId) ?? teams[0]
      : null;

  const handleViewTeam = useCallback((id: string) => {
    setSelectedTeamId(id);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBackToList = useCallback(() => {
    setView("list");
    setSelectedTeamId(null);
  }, []);

  const updateTeam = useCallback(
    (teamId: string, patch: { name?: string; description?: string }) => {
      setTeams((prev) =>
        prev.map((t) =>
          t.id !== teamId
            ? t
            : {
                ...t,
                ...(patch.name != null && { name: patch.name }),
                ...(patch.description != null && {
                  description: patch.description,
                }),
              }
        )
      );
    },
    []
  );

  const removePokemonFromTeam = useCallback((teamId: string, slotIndex: number) => {
    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId) return t;
        const next = [...t.pokemon];
        next[slotIndex] = null;
        return { ...t, pokemon: next };
      })
    );
  }, []);

  const clearAllPokemonFromTeam = useCallback((teamId: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id !== teamId ? t : { ...t, pokemon: Array(6).fill(null) }
      )
    );
  }, []);

  return {
    view,
    teams,
    selectedTeam,
    selectedTeamId,
    handleViewTeam,
    handleBackToList,
    updateTeam,
    removePokemonFromTeam,
    clearAllPokemonFromTeam,
  };
}

export function useCopyLink(url: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);
  return { copied, copy };
}
