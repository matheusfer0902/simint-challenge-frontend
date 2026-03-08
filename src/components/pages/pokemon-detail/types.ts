export interface Stat {
  hp: number;
  attack: number;
  defense: number;
  spAtk: number;
  spDef: number;
  speed: number;
}

export interface Evolution {
  id: number;
  name: string;
  level: number;
  sprite: string;
}

export interface Move {
  name: string;
  type: string;
  power: number | "—";
  pp: number;
}

export interface PokemonDetail {
  id: number;
  dexNumber: string;
  name: string;
  types: string[];
  level: number;
  height: string;
  weight: string;
  region: string;
  ability: string;
  description: string;
  flavourText: string;
  stats: Stat;
  moves: Move[];
  evolution: Evolution[];
  sprite: string;
  shiny: boolean;
  category: string;
  generation: string;
}
