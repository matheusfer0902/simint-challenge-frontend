"use client";

import { useState, useCallback, useEffect } from "react";
import { teamService } from "@/lib/api/team.service";
import type { TeamDto, TeamMemberSummaryDto } from "@/lib/api/team.service";
import type { Team } from "./types";
import type { TeamFilter } from "@/lib/api/team.service";
import { usePaginationParams } from "@/lib/pagination";
import { createPaginationMeta } from "@/lib/pagination";

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

export function useTeamsHandler() {
  const { page, limit, setPage } = usePaginationParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TeamFilter | "">("");
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  const fetchTeams = useCallback(
    async (opts?: { search?: string; filter?: TeamFilter | "" }) => {
      setListLoading(true);
      setListError(null);
      try {
        const nextSearch = opts?.search !== undefined ? opts.search : search;
        const nextFilter = opts?.filter !== undefined ? opts.filter : filter;
        const res = await teamService.list({
          page: page + 1,
          limit,
          search: nextSearch.trim() || undefined,
          filter: nextFilter === "" ? undefined : nextFilter || undefined,
        });
        setTeams(res.data.map(dtoToTeam));
        setTotal(res.total);
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
  }, [page, limit, search, filter]);

  const refreshList = useCallback(() => {
    fetchTeams({ search, filter });
  }, [fetchTeams, search, filter]);

  const paginationMeta = createPaginationMeta(total, page, limit);

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
    paginationMeta,
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
