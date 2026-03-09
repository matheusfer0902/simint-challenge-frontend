export type PokeStatus =
  | "healthy"
  | "fainted"
  | "poisoned"
  | "burned"
  | "frozen"
  | "paralyzed";

export interface HealPokemon {
  id: number;
  name: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  sprite: string;
  status: PokeStatus;
}

export type HealPhase = "idle" | "loading" | "sequencing" | "filling" | "done";

export interface HealState {
  phase: HealPhase;
  loadedSlots: boolean[];
  activeSlot: number;
  litSlots: boolean[];
  displayHp: number[];
  showToast: boolean;
}

export interface TypeColors {
  gradient: string;
  badge: string;
  glow: string;
}

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
}
