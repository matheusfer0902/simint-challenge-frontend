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

}

export const teamService = new TeamService();
