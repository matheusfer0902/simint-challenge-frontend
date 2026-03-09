import type { PokemonDetailDto } from "@/lib/api/pokemon.service";

export type ViewMode = "grid" | "list";

export type CapturedFilter = "all" | "captured" | "not_captured";

export interface PokedexFilters {
  search: string;
  type: string;
  captured: CapturedFilter;
}

export type PanelTab = "overview" | "stats" | "research";

export interface TypeMeta {
  gradient: string;
  badge: string;
  glow: string;
  accent: string;
  icon: string;
}

export type { PokemonDetailDto };
