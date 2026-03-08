/** Stats derivados da API para exibição (Base Stats) */
export interface Stat {
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

/** Tipo usado na página de detalhe: dados da API + campos derivados para UI */
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
  /** UUID do usuário criador; null se Pokémon oficial/selvagem */
  creatorId: string | null;
  /** Derivado: #001, #026, etc. */
  dexNumber: string;
  /** Derivado: { hp, attack, defense, speed } para gráficos e barras */
  stats: Stat;
}
