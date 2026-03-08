import { httpClient } from "@/lib/api/http-client";

/** Pokémon aninhado no membro (GET /teams/:id) */
export interface TeamMemberPokemonDto {
  id: number;
  uuid: string;
  name: string;
  spriteUrl: string;
  types: string[];
  level: number;
  hp: number;
  currentHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  region: string | null;
  locations: string[];
}

/** Membro do time (detalhe GET /teams/:id — sem moves, pode incluir pokemon) */
export interface TeamMemberSummaryDto {
  id: string;
  teamId: string;
  pokemonId: number;
  nickname: string | null;
  level: number | null;
  pokemon?: TeamMemberPokemonDto;
}

/** Membro com moves (listagem GET /teams) */
export interface TeamMemberDto extends TeamMemberSummaryDto {
  move1?: string | null;
  move2?: string | null;
  move3?: string | null;
  move4?: string | null;
}

/** Time (listagem, criar, editar) — sem gameVersion e userId */
export interface TeamDto {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  grade: "S" | "A" | "B" | "C";
  wins: number;
  losses: number;
  battles: number;
  members: TeamMemberDto[] | TeamMemberSummaryDto[];
  createdAt: string;
  updatedAt: string;
  /** Apenas em GET /teams e GET /teams/:id */
  accessRole?: "owner" | "shared";
}

export interface TeamsListResponseDto {
  data: TeamDto[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTeamMemberPayload {
  pokemonId: number;
}

export interface CreateTeamPayload {
  name: string;
  description: string;
  isPublic?: boolean;
  members?: CreateTeamMemberPayload[];
}

/** Item para adicionar membro no PATCH /teams/:id */
export interface AddMemberItem {
  pokemonId: number;
  nickname?: string | null;
  level?: number | null;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
  gameVersion?: string | null;
  isPublic?: boolean;
  /** Adicionar membros ao time (máx. 6 no total) */
  addMembers?: AddMemberItem[];
  /** UUIDs dos membros a remover (members[].id do GET) */
  removeMemberIds?: string[];
}

export interface ShareTeamPayload {
  sharedWithUserId: string;
}

export interface RegisterBattlePayload {
  result: "win" | "loss";
}

export interface ShareTeamResponseDto {
  message: string;
}

export interface RegisterBattleResponseDto {
  message: string;
}

/** Body opcional para POST /teams/:id/share-link */
export interface ShareLinkBody {
  expiresInDays?: number;
}

/** Resposta 201 de POST /teams/:id/share-link */
export interface ShareLinkResponseDto {
  token: string;
}

/** Pokémon no time compartilhado (GET /teams/shared/:token) */
export interface PokemonSummarySharedDto {
  id: number;
  uuid: string;
  name: string;
  spriteUrl: string;
  types: string[];
  level: number;
  hp: number;
  currentHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  region: string | null;
  locations: string[];
}

/** Membro no time compartilhado */
export interface TeamMemberDetailSharedDto {
  id: string;
  teamId: string;
  pokemonId: number;
  nickname: string | null;
  level: number | null;
  pokemon: PokemonSummarySharedDto;
}

/** Resposta 200 de GET /teams/shared/:token */
export interface TeamSharedResponseDto {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  grade: "S" | "A" | "B" | "C";
  wins: number;
  losses: number;
  battles: number;
  members: TeamMemberDetailSharedDto[];
  createdAt: string;
  updatedAt: string;
}

export type TeamFilter = "public" | "private";

export interface ListTeamsParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: TeamFilter;
}

class TeamService {
  async list(params?: ListTeamsParams): Promise<TeamsListResponseDto> {
    const searchParams = new URLSearchParams();
    if (params?.page != null) searchParams.set("page", String(params.page));
    if (params?.limit != null) searchParams.set("limit", String(params.limit));
    if (params?.search?.trim()) searchParams.set("search", params.search.trim());
    if (params?.filter) searchParams.set("filter", params.filter);
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return httpClient.get<TeamsListResponseDto>(`/teams${qs}`);
  }

  async getById(id: string): Promise<TeamDto> {
    return httpClient.get<TeamDto>(`/teams/${id}`);
  }

  async create(data: CreateTeamPayload): Promise<TeamDto> {
    return httpClient.post<TeamDto>("/teams", data);
  }

  async update(id: string, data: UpdateTeamPayload): Promise<TeamDto> {
    return httpClient.patch<TeamDto>(`/teams/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`/teams/${id}`);
  }

  async share(id: string, data: ShareTeamPayload): Promise<ShareTeamResponseDto> {
    return httpClient.post<ShareTeamResponseDto>(`/teams/${id}/share`, data);
  }

  async registerBattle(
    id: string,
    data: RegisterBattlePayload
  ): Promise<RegisterBattleResponseDto> {
    return httpClient.post<RegisterBattleResponseDto>(
      `/teams/${id}/battles`,
      data
    );
  }

  /** Gera link de compartilhamento (apenas dono, time privado). Retorna a URL completa. */
  async createShareLink(
    teamId: string,
    options?: { expiresInDays?: number }
  ): Promise<{ token: string; shareUrl: string }> {
    const body: ShareLinkBody =
      options?.expiresInDays != null && options.expiresInDays >= 1
        ? { expiresInDays: options.expiresInDays }
        : {};
    const res = await httpClient.post<ShareLinkResponseDto>(
      `/teams/${teamId}/share-link`,
      Object.keys(body).length > 0 ? body : undefined
    );
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/teams/shared/${res.token}`;
    return { token: res.token, shareUrl };
  }

  /** Obtém time por token de compartilhamento (rota pública). Retorna null se 404. */
  async getSharedTeam(token: string): Promise<TeamSharedResponseDto | null> {
    try {
      return await httpClient.get<TeamSharedResponseDto>(
        `/teams/shared/${encodeURIComponent(token)}`
      );
    } catch (e: unknown) {
      if (e && typeof e === "object" && "apiError" in e) {
        const err = e as { apiError: { status: number } };
        if (err.apiError.status === 404) return null;
      }
      throw e;
    }
  }
}

export const teamService = new TeamService();
