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
  region: string;
  creatorId: string | null;
  location: string;
}

export interface MyPokemonDto extends PokemonDto {
  status: "captured" | "created";
}

export type MyPokemonFilter = "captured" | "created";

export interface CatchPokemonDto {
  pokemonId: number;
  location: string;
}

export interface CreatePokemonDto {
  name: string;
  types: string[];
  id: number;
  level: number;
  hp: number;
  currentHp: number;
  spriteUrl: string;
}

export interface CreatePokemonResponseDto {
  message: string;
}

export interface CatchPokemonResponseDto {
  caught: boolean;
  pokemon: PokemonDto;
}

class PokemonService {
  async getMyPokemons(filter?: MyPokemonFilter): Promise<MyPokemonDto[]> {
    const qs = filter ? `?filter=${filter}` : "";
    return httpClient.get<MyPokemonDto[]>(`/pokemon/me${qs}`);
  }

  async getWildArea(): Promise<PokemonDto[]> {
    return httpClient.get<PokemonDto[]>("/pokemon/wild-area");
  }

  async create(data: CreatePokemonDto): Promise<CreatePokemonResponseDto> {
    return httpClient.put<CreatePokemonResponseDto>("/pokemon", data);
  }

  async catch(data: CatchPokemonDto): Promise<CatchPokemonResponseDto> {
    return httpClient.post<CatchPokemonResponseDto>("/pokemon/catch", data);
  }
}

export const pokemonService = new PokemonService();
