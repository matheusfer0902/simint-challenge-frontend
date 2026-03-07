export type PokemonTag = "created" | "captured" | "wild";
export type FilterOption = "all" | "created" | "captured";
export type PageTab = "your-pokemon" | "wild-area" | "new-pokemon";

export interface PokemonStat {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface PokemonData {
  id: number;
  dexNumber: string;
  name: string;
  types: string[];
  level: number;
  stats: PokemonStat;
  tag: PokemonTag;
  sprite: string;
  shiny?: boolean;
  region: string;
}
