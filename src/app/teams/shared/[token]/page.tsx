"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { teamService } from "@/lib/api/team.service";
import type {
  TeamSharedResponseDto,
  TeamMemberDetailSharedDto,
} from "@/lib/api/team.service";
import { TeamDetailView } from "@/components/pages/teams/components/TeamDetailView";
import type { Team, TeamMember } from "@/components/pages/teams/types";

function mapSharedTeamToTeam(dto: TeamSharedResponseDto): Team {
  const members: TeamMember[] = dto.members.map((m: TeamMemberDetailSharedDto) => ({
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
  }));
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
  };
}

const noop = () => Promise.resolve();

export default function SharedTeamPage() {
  const params = useParams();
  const router = useRouter();
  const token = (params?.token as string) ?? "";

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (!token) {
      setError("Link inválido.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    teamService
      .getSharedTeam(token)
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setTeam(mapSharedTeamToTeam(data));
        } else {
          setError("Link inválido ou expirado.");
          setTeam(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Erro ao carregar o time.");
          setTeam(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <TeamDetailView
          team={team}
          loading={loading}
          error={error}
          onBack={handleBack}
          backLabel="Voltar"
          onUpdateTeam={noop}
          onDeleteTeam={noop}
          onShareTeam={noop}
          onRegisterBattle={noop}
          onRefresh={noop}
        />
      </div>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeSlideUp { animation: fadeSlideUp 0.35s ease-out; }
      `}</style>
    </AppLayout>
  );
}
