/** Nota do time (API usa "grade") */
export type TeamGrade = "S" | "A" | "B" | "C";

/** Alias para compatibilidade com componentes que usam "rank" */
export type TeamRank = TeamGrade;

/** Membro do time conforme retornado pela API (detalhe: sem moves) */
export interface TeamMember {
  id: string;
  teamId: string;
  pokemonId: number;
  nickname: string | null;
  level: number | null;
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
}

const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

/** Gera URL do sprite a partir do pokemonId (Pokedex) */
export function getMemberSprite(pokemonId: number): string {
  return `${SPRITE_BASE}/${pokemonId}.png`;
}

/** Converte um TeamMember em PokemonSummary para exibição nos slots */
export function memberToSummary(m: TeamMember): PokemonSummary {
  return {
    id: m.pokemonId,
    name: m.nickname?.trim() || `#${m.pokemonId}`,
    type: "normal",
    level: m.level ?? 1,
    sprite: getMemberSprite(m.pokemonId),
    role: "",
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
