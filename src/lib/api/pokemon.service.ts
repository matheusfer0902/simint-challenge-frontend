import { httpClient } from "@/lib/api/http-client";

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
}

export const pokemonService = new PokemonService();
