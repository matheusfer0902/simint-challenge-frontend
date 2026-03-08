"use client";

import { useState, useCallback, useEffect } from "react";
import { teamService } from "@/lib/api/team.service";
import type { TeamDto, TeamMemberSummaryDto } from "@/lib/api/team.service";
import type { Team } from "./types";
import type { TeamFilter } from "@/lib/api/team.service";

function dtoToTeam(dto: TeamDto): Team {
  const members: Team["members"] = (dto.members ?? []).map(
    (m: TeamMemberSummaryDto) => ({
      id: m.id,
      teamId: m.teamId,
      pokemonId: m.pokemonId,
      nickname: m.nickname,
      level: m.level,
      pokemon: m.pokemon
        ? {
            id: m.pokemon.id,
            name: m.pokemon.name,
            spriteUrl: m.pokemon.spriteUrl,
            types: m.pokemon.types ?? [],
            level: m.pokemon.level,
            region: m.pokemon.region ?? null,
          }
        : undefined,
    })
  );
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? null,
    isPublic: dto.isPublic,
    grade: dto.grade,
    wins: dto.wins,
    losses: dto.losses,
    battles: dto.battles,
    members,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    accessRole: dto.accessRole,
  };
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export function useTeamsHandler() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit] = useState(DEFAULT_LIMIT);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TeamFilter | "">("");
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const fetchTeams = useCallback(
    async (opts?: { page?: number; search?: string; filter?: TeamFilter | "" }) => {
      setListLoading(true);
      setListError(null);
      try {
        const nextSearch = opts?.search !== undefined ? opts.search : search;
        const nextFilter = opts?.filter !== undefined ? opts.filter : filter;
        const res = await teamService.list({
          page: opts?.page ?? page,
          limit,
          search: nextSearch.trim() || undefined,
          filter: nextFilter === "" ? undefined : nextFilter || undefined,
        });
        setTeams(res.data.map(dtoToTeam));
        setTotal(res.total);
        if (opts?.page != null) setPage(opts.page);
        if (opts?.search !== undefined) setSearch(opts.search);
        if (opts?.filter !== undefined) setFilter(opts.filter);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Erro ao carregar times.";
        setListError(message);
        setTeams([]);
        setTotal(0);
      } finally {
        setListLoading(false);
      }
    },
    [page, limit, search, filter]
  );

  useEffect(() => {
    fetchTeams();
  }, []);

  const refreshList = useCallback(() => {
    fetchTeams({ page, search, filter });
  }, [fetchTeams, page, search, filter]);

  const createTeam = useCallback(
    async (data: {
      name: string;
      description: string;
      isPublic?: boolean;
      members?: { pokemonId: number }[];
    }) => {
      const dto = await teamService.create({
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        members: data.members?.length ? data.members : undefined,
      });
      await refreshList();
      return dtoToTeam(dto);
    },
    [refreshList]
  );

  return {
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
