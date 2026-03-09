export interface TrainPokemon {
  id: number;
  name: string;
  type: string;
  secondType?: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  xp: number;
  xpToNext: number;
  sprite: string;
  cry?: string;
}

export type Phase = "idle" | "bouncing" | "xp-fill" | "level-up" | "celebrating";

export interface TrainState {
  phase: Phase;
  xp: number;
  level: number;
  xpGained: number;
  particles: boolean;
}

export interface TypeColors {
  gradient: string;
  glow: string;
  accent: string;
  badge: string;
}
