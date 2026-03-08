"use client";

import { useState, useCallback } from "react";
import { MOCK_TEAMS } from "./data";
import type { Team } from "./types";

export type TeamsView = "list" | "detail";

export function useTeamsHandler() {
  const [view, setView] = useState<TeamsView>("list");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const teams = MOCK_TEAMS;

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

  return {
    view,
    teams,
    selectedTeam,
    selectedTeamId,
    handleViewTeam,
    handleBackToList,
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
