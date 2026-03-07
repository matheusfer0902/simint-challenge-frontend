export interface PokemonSlotData {
  id: number;
  name: string;
  sprite: string;
  type: string;
}

export interface BattleCardData {
  id: number;
  teamName: string;
  owner: {
    name: string;
    avatar: string;
    level: number;
    region: string;
  };
  pokemon: PokemonSlotData[];
  wins: number;
  rank: "S" | "A" | "B" | "C";
}

export interface UserCardData {
  id: number;
  name: string;
  avatar: string;
  title: string;
  level: number;
  region: string;
  badges: number;
  isFollowing: boolean;
}

export type Tab = "battle" | "users";
