export interface Stat {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface PokemonDetail {
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
  creatorId: string | null;
  dexNumber: string;
  stats: Stat;
}
