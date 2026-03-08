"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { teamService } from "@/lib/api/team.service";
import type { TeamDto, TeamMemberSummaryDto } from "@/lib/api/team.service";
import type { Team } from "@/components/pages/teams/types";

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

export function useTeamDetailHandler() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? "";

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    router.push("/teams");
  }, [router]);

  const refetch = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const dto = await teamService.getById(id);
      setTeam(dtoToTeam(dto));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar time.");
      setTeam(null);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      setError("Time não encontrado.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    teamService
      .getById(id)
      .then((dto) => {
        if (!cancelled) setTeam(dtoToTeam(dto));
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Erro ao carregar time.");
          setTeam(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const updateTeam = useCallback(
    async (
      teamId: string,
      patch: { name?: string; description?: string; isPublic?: boolean }
    ) => {
      const dto = await teamService.update(teamId, patch);
      const updated = dtoToTeam(dto);
      setTeam((prev) => {
        if (prev?.id !== teamId) return prev;
        return {
          ...updated,
          accessRole: updated.accessRole ?? prev.accessRole,
        };
      });
    },
    []
  );

  const deleteTeam = useCallback(
    async (teamId: string) => {
      await teamService.delete(teamId);
      router.push("/teams");
    },
    [router]
  );

  const shareTeam = useCallback(async (teamId: string, sharedWithUserId: string) => {
    await teamService.share(teamId, { sharedWithUserId });
    if (teamId === id) await refetch();
  }, [id, refetch]);

  const registerBattle = useCallback(
    async (teamId: string, result: "win" | "loss") => {
      await teamService.registerBattle(teamId, { result });
      if (teamId === id) await refetch();
    },
    [id, refetch]
  );

  const addMember = useCallback(
    async (teamId: string, pokemonId: number) => {
      const dto = await teamService.update(teamId, {
        addMembers: [{ pokemonId }],
      });
      const updated = dtoToTeam(dto);
      setTeam((prev) => {
        if (prev?.id !== teamId) return prev;
        return { ...updated, accessRole: updated.accessRole ?? prev.accessRole };
      });
    },
    []
  );

  const removeMember = useCallback(
    async (teamId: string, memberId: string) => {
      const dto = await teamService.update(teamId, {
        removeMemberIds: [memberId],
      });
      const updated = dtoToTeam(dto);
      setTeam((prev) => {
        if (prev?.id !== teamId) return prev;
        return { ...updated, accessRole: updated.accessRole ?? prev.accessRole };
      });
    },
    []
  );

  return {
    team,
    teamId: id,
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
  };
}
