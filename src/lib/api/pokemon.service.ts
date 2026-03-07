import { httpClient } from "@/lib/api/http-client";

export interface PokemonDto {
  id: string;
  name: string;
  number: string;
  types: string[];
  imageUrl: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  trainerId: string;
}

export interface CreatePokemonDto {
  name: string;
  number: string;
  types: string[];
  imageUrl?: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface PokemonListDto {
  data: PokemonDto[];
  total: number;
  page: number;
  perPage: number;
}

export interface PokemonFilters {
  search?: string;
  type?: string;
  page?: number;
  perPage?: number;
}

class PokemonService {
  async list(filters: PokemonFilters = {}): Promise<PokemonListDto> {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.type) params.set("type", filters.type);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.perPage) params.set("perPage", String(filters.perPage));

    const qs = params.toString();
    return httpClient.get<PokemonListDto>(`/pokemons${qs ? `?${qs}` : ""}`);
  }

  async getById(id: string): Promise<PokemonDto> {
    return httpClient.get<PokemonDto>(`/pokemons/${id}`);
  }

  async create(data: CreatePokemonDto): Promise<PokemonDto> {
    return httpClient.post<PokemonDto>("/pokemons", data);
  }

  async update(id: string, data: Partial<CreatePokemonDto>): Promise<PokemonDto> {
    return httpClient.patch<PokemonDto>(`/pokemons/${id}`, data);
  }

  async remove(id: string): Promise<void> {
    return httpClient.delete<void>(`/pokemons/${id}`);
  }
}

export const pokemonService = new PokemonService();