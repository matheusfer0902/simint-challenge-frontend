import { httpClient } from "@/lib/api/http-client";
import type { PaginatedResponse } from "@/lib/pagination/types";

export interface PokemonDto {
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
  creatorId: string | null;
  location: string | null;
}

/** Resposta da rota GET /pokemon/:id (detalhe do Pokémon) */
export interface PokemonDetailDto {
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
  /** UUID do usuário criador; null se Pokémon oficial/selvagem */
  creatorId: string | null;
}

/** Parâmetros da rota GET /pokemon/all (listagem paginada da Pokédex) */
export interface PokedexAllParams {
  search?: string;
  page?: number;
  limit?: number;
  /** Slug do tipo (ex: "fire", "grass") — até 1 filtro de tipo */
  type?: string;
  /** true = só capturados, false = só não capturados, omitido = todos */
  captured?: boolean;
}

/** Resposta da rota GET /pokemon/all — inclui ids dos Pokémon capturados pelo usuário */
export interface PokedexAllResponse extends PaginatedResponse<PokemonDetailDto> {
  capturedIds: number[];
}

export interface MyPokemonDto extends PokemonDto {
  status: "captured" | "created";
}

export type MyPokemonFilter = "captured" | "created";

export interface CatchPokemonDto {
  pokemonId: number;
  location: string;
}

export interface CreatePokemonPayload {
  name: string;
  types: string[];
  id: number;
  level: number;
  hp: number;
  currentHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  sprite: File;
}

export interface CreatePokemonConflictItemDto {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string;
}

export interface CreatePokemonConflictsDto {
  nameConflict?: CreatePokemonConflictItemDto;
  pokedexConflict?: CreatePokemonConflictItemDto;
}

export interface CreatePokemonResponseDto {
  message: string;
  /** Pokémon criado (quando o backend retorna no body da criação) */
  pokemon?: PokemonDto;
}

export interface CatchPokemonResponseDto {
  caught: boolean;
  pokemon: PokemonDto;
}

class PokemonService {
  async getMyPokemons(params?: { filter?: MyPokemonFilter; search?: string }): Promise<MyPokemonDto[]> {
    const searchParams = new URLSearchParams();
    if (params?.filter) searchParams.set("filter", params.filter);
    if (params?.search?.trim()) searchParams.set("search", params.search.trim());
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return httpClient.get<MyPokemonDto[]>(`/pokemon/me${qs}`);
  }

  async getWildArea(): Promise<PokemonDto[]> {
    return httpClient.get<PokemonDto[]>("/pokemon/wild-area");
  }

  async create(data: CreatePokemonPayload): Promise<CreatePokemonResponseDto> {
    const form = new FormData();
    form.append("name", data.name);
    data.types.forEach((t) => form.append("types", t));
    form.append("id", String(data.id));
    form.append("level", String(data.level));
    form.append("hp", String(data.hp));
    form.append("currentHp", String(data.currentHp));
    form.append("baseAttack", String(data.baseAttack));
    form.append("baseDefense", String(data.baseDefense));
    form.append("baseSpeed", String(data.baseSpeed));
    if (data.sprite) {
      form.append("sprite", data.sprite);
    }
    return httpClient.postForm<CreatePokemonResponseDto>("/pokemon", form);
  }

  async catch(data: CatchPokemonDto): Promise<CatchPokemonResponseDto> {
    return httpClient.post<CatchPokemonResponseDto>("/pokemon/catch", data);
  }

  /** Lista todos os Pokémon com paginação e filtros (GET /pokemon/all). page no backend é 1-based. */
  async getAll(params?: PokedexAllParams): Promise<PokedexAllResponse> {
    const searchParams = new URLSearchParams();
    if (params?.search?.trim()) searchParams.set("search", params.search.trim());
    if (params?.page !== undefined) searchParams.set("page", String(params.page + 1));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params?.type) searchParams.set("type", params.type);
    if (params?.captured === true) searchParams.set("captured", "true");
    if (params?.captured === false) searchParams.set("captured", "false");
    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return httpClient.get<PokedexAllResponse>(`/pokemon/all${qs}`);
  }

  async getById(id: number): Promise<PokemonDetailDto> {
    return httpClient.get<PokemonDetailDto>(`/pokemon/${id}`);
  }

  /** Atualiza nome, HP, tipos, nível e número da Pokédex; pode retornar conflitos como na criação */
  async update(
    pokemonId: number,
    data: { name: string; hp: number; types: string[]; level: number; id: number }
  ): Promise<{ pokemon: PokemonDetailDto }> {
    return httpClient.patch<{ pokemon: PokemonDetailDto }>(`/pokemon/${pokemonId}`, data);
  }

  async delete(pokemonId: number): Promise<void> {
    return httpClient.delete<void>(`/pokemon/${pokemonId}`);
  }

  /** Cura até 6 pokémons pelo id. Corpo: { ids: number[] }. Retorna { healed: PokemonDto[] } */
  async heal(ids: number[]): Promise<{ healed: PokemonDto[] }> {
    return httpClient.post<{ healed: PokemonDto[] }>("/pokemon/heal", { ids });
  }

  /** Aumenta o nível do pokémon em 1. :id = id do pokémon. */
  async train(id: number): Promise<{ pokemon: PokemonDto }> {
    return httpClient.post<{ pokemon: PokemonDto }>(`/pokemon/train/${id}`, {});
  }
}

export const pokemonService = new PokemonService();
