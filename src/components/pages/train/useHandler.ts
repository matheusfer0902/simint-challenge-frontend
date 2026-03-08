"use client";

import { useState, useEffect, useReducer, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────────────────

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

const sp = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const TRAINING_ROSTER: TrainPokemon[] = [
  { id: 94, name: "Gengar", type: "ghost", secondType: "poison", level: 34, hp: 60, maxHp: 60, attack: 65, defense: 60, speed: 110, xp: 980, xpToNext: 1000, sprite: sp(94) },
  { id: 25, name: "Pikachu", type: "electric", level: 31, hp: 35, maxHp: 35, attack: 55, defense: 30, speed: 90, xp: 620, xpToNext: 1000, sprite: sp(25) },
  { id: 6, name: "Charizard", type: "fire", secondType: "flying", level: 37, hp: 78, maxHp: 78, attack: 84, defense: 78, speed: 100, xp: 750, xpToNext: 1200, sprite: sp(6) },
  { id: 1, name: "Bulbasaur", type: "grass", secondType: "poison", level: 29, hp: 45, maxHp: 45, attack: 49, defense: 49, speed: 45, xp: 440, xpToNext: 900, sprite: sp(1) },
  { id: 7, name: "Squirtle", type: "water", level: 28, hp: 44, maxHp: 44, attack: 48, defense: 65, speed: 43, xp: 590, xpToNext: 900, sprite: sp(7) },
  { id: 149, name: "Dragonite", type: "dragon", secondType: "flying", level: 54, hp: 91, maxHp: 91, attack: 134, defense: 95, speed: 80, xp: 390, xpToNext: 1500, sprite: sp(149) },
];

export type Phase = "idle" | "bouncing" | "xp-fill" | "level-up" | "celebrating";

export interface TrainState {
  phase: Phase;
  xp: number;
  level: number;
  xpGained: number;
  particles: boolean;
}

type TrainAction =
  | { type: "INITIATE" }
  | { type: "BOUNCE_END" }
  | { type: "XP_GAINED"; xpGain: number; newXp: number }
  | { type: "TRIGGER_LEVEL_UP"; newLevel: number; overflowXp: number }
  | { type: "CELEBRATE_END" }
  | { type: "RESET_POKEMON"; xp: number; level: number }
  | { type: "PARTICLES_OFF" };

function trainReducer(state: TrainState, action: TrainAction): TrainState {
  switch (action.type) {
    case "INITIATE":
      return { ...state, phase: "bouncing", particles: true, xpGained: 0 };
    case "BOUNCE_END":
      return { ...state, phase: "xp-fill" };
    case "XP_GAINED":
      return { ...state, xp: action.newXp, xpGained: action.xpGain, phase: "idle" };
    case "TRIGGER_LEVEL_UP":
      return { ...state, level: action.newLevel, xp: action.overflowXp, phase: "level-up" };
    case "CELEBRATE_END":
      return { ...state, phase: "idle" };
    case "RESET_POKEMON":
      return { phase: "idle", xp: action.xp, level: action.level, xpGained: 0, particles: false };
    case "PARTICLES_OFF":
      return { ...state, particles: false };
    default:
      return state;
  }
}

function useTraining(pokemon: TrainPokemon) {
  const [state, dispatch] = useReducer(trainReducer, {
    phase: "idle",
    xp: pokemon.xp,
    level: pokemon.level,
    xpGained: 0,
    particles: false,
  });

  useEffect(() => {
    dispatch({ type: "RESET_POKEMON", xp: pokemon.xp, level: pokemon.level });
  }, [pokemon.id]);

  const train = useCallback(() => {
    if (state.phase !== "idle") return;
    dispatch({ type: "INITIATE" });

    setTimeout(() => {
      dispatch({ type: "BOUNCE_END" });
      const remaining = pokemon.xpToNext - state.xp;
      const gain = Math.max(Math.min(Math.floor(Math.random() * 100) + 60, remaining + 20), 40);
      const newXp = state.xp + gain;

      if (newXp >= pokemon.xpToNext) {
        setTimeout(() => {
          dispatch({ type: "TRIGGER_LEVEL_UP", newLevel: state.level + 1, overflowXp: newXp - pokemon.xpToNext });
          setTimeout(() => dispatch({ type: "CELEBRATE_END" }), 3800);
        }, 1300);
      } else {
        setTimeout(() => {
          dispatch({ type: "XP_GAINED", xpGain: gain, newXp });
        }, 300);
      }

      setTimeout(() => dispatch({ type: "PARTICLES_OFF" }), 1500);
    }, 650);
  }, [state.phase, state.xp, state.level, pokemon.id, pokemon.xpToNext]);

  return { state, train };
}

export function useTrainHandler() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const pokemon = TRAINING_ROSTER[selectedIdx];
  const { state, train } = useTraining(pokemon);

  return {
    roster: TRAINING_ROSTER,
    selectedIdx,
    setSelectedIdx,
    pokemon,
    state,
    train,
  };
}
