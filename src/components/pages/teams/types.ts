export interface PokemonSummary {
  id: number;
  name: string;
  type: string;
  level: number;
  sprite: string;
  role: string;
}

export type TeamRank = "S" | "A" | "B" | "C";

export interface Team {
  id: string;
  name: string;
  description: string;
  wins: number;
  losses: number;
  rank: TeamRank;
  region: string;
  createdAt: string;
  pokemon: (PokemonSummary | null)[];
  shareSlug: string;
  /** Se true, o time é público (globo); se false, privado (cadeado). */
  isPublic: boolean;
}
