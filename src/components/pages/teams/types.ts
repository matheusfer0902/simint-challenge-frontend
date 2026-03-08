/** Nota do time (API usa "grade") */
export type TeamGrade = "S" | "A" | "B" | "C";

/** Alias para compatibilidade com componentes que usam "rank" */
export type TeamRank = TeamGrade;

/** Dados do Pokémon aninhado no membro (GET /teams/:id) */
export interface TeamMemberPokemon {
  id: number;
  name: string;
  spriteUrl: string;
  types: string[];
  level: number;
  region: string | null;
}

/** Membro do time conforme retornado pela API (detalhe: sem moves, pode incluir pokemon) */
export interface TeamMember {
  id: string;
  teamId: string;
  pokemonId: number;
  nickname: string | null;
  level: number | null;
  pokemon?: TeamMemberPokemon;
}

/** Time conforme retornado pela API (listagem e detalhe) */
export interface Team {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  grade: TeamGrade;
  wins: number;
  losses: number;
  battles: number;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
  accessRole?: "owner" | "shared";
}

/** Resumo de Pokémon para exibição em slot (derivado de TeamMember + sprite) */
export interface PokemonSummary {
  id: number;
  name: string;
  type: string;
  level: number;
  sprite: string;
  role: string;
  /** Região (quando vem do GET /teams/:id com pokemon aninhado) */
  region?: string | null;
}

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/** Gera URL do sprite a partir do pokemonId (Pokedex) */
export function getMemberSprite(pokemonId: number): string {
  return `${SPRITE_BASE}/${pokemonId}.png`;
}

/** Converte um TeamMember em PokemonSummary para exibição nos slots */
export function memberToSummary(m: TeamMember): PokemonSummary {
  const pokemon = m.pokemon;
  return {
    id: pokemon?.id ?? m.pokemonId,
    name: m.nickname?.trim() || pokemon?.name || `#${m.pokemonId}`,
    type: pokemon?.types?.[0] ?? "normal",
    level: m.level ?? pokemon?.level ?? 1,
    sprite: pokemon?.spriteUrl ?? getMemberSprite(m.pokemonId),
    role: "",
    region: pokemon?.region ?? null,
  };
}

/** Preenche array de members até 6 slots (null = vazio) para a UI */
export function membersToSlots(members: TeamMember[]): (PokemonSummary | null)[] {
  const out: (PokemonSummary | null)[] = [];
  for (let i = 0; i < 6; i++) {
    out.push(
      members[i] ? memberToSummary(members[i]) : null
    );
  }
  return out;
}
