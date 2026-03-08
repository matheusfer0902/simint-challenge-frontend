export type PokemonStatus = "captured" | "created";
export type PokemonTag = PokemonStatus | "wild";
export type FilterOption = "all" | "captured" | "created";
export type PageTab = "your-pokemon" | "wild-area" | "new-pokemon";

export interface PokemonData {
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
  location: string;
  creatorId: string | null;
  tag: PokemonTag;
}
