"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { pokemonService } from "@/lib/api/pokemon.service";
import type { MyPokemonDto } from "@/lib/api/pokemon.service";

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

const DEFAULT_TRAIN_POKEMON: TrainPokemon = {
  id: 0,
  name: "",
  type: "normal",
  level: 1,
  hp: 0,
  maxHp: 1,
  attack: 0,
  defense: 0,
  speed: 0,
  xp: 0,
  xpToNext: 1000,
  sprite: "",
};

function mapMyPokemonToTrain(dto: MyPokemonDto): TrainPokemon {
  const [type] = dto.types ?? ["normal"];
  return {
    id: dto.id,
    name: dto.name,
    type,
    secondType: dto.types?.[1],
    level: dto.level,
    hp: dto.currentHp ?? dto.hp,
    maxHp: dto.hp,
    attack: dto.baseAttack ?? 0,
    defense: dto.baseDefense ?? 0,
    speed: dto.baseSpeed ?? 0,
    xp: 0,
    xpToNext: 1000,
    sprite: dto.spriteUrl ?? "",
  };
}

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

function useTraining(
  pokemon: TrainPokemon,
  onLevelUpComplete?: (pokemonId: number, newLevel: number) => void
) {
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

  const train = useCallback(
    (levelFromApi?: number) => {
      if (state.phase !== "idle") return;
      dispatch({ type: "INITIATE" });

      if (levelFromApi != null) {
        setTimeout(() => {
          dispatch({ type: "BOUNCE_END" });
          setTimeout(() => {
            dispatch({ type: "TRIGGER_LEVEL_UP", newLevel: levelFromApi, overflowXp: 0 });
            setTimeout(() => {
              dispatch({ type: "CELEBRATE_END" });
              onLevelUpComplete?.(pokemon.id, levelFromApi);
            }, 3800);
          }, 1300);
        }, 650);
        setTimeout(() => dispatch({ type: "PARTICLES_OFF" }), 1500);
        return;
      }

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
    },
    [state.phase, state.xp, state.level, pokemon.id, pokemon.xpToNext, onLevelUpComplete]
  );

  return { state, train };
}

export function useTrainHandler(debouncedSearch: string) {
  const [roster, setRoster] = useState<TrainPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [trainError, setTrainError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const search = debouncedSearch.trim() || undefined;
    pokemonService
      .getMyPokemons(search ? { search } : {})
      .then((list) => {
        if (cancelled) return;
        const mapped = list.map(mapMyPokemonToTrain);
        setRoster(mapped);
        setSelectedIdx((i) => (i >= mapped.length ? 0 : i));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const onLevelUpComplete = useCallback((pokemonId: number, newLevel: number) => {
    setRoster((prev) =>
      prev.map((p) => (p.id === pokemonId ? { ...p, level: newLevel } : p))
    );
  }, []);

  const safeIdx = roster.length ? Math.min(selectedIdx, roster.length - 1) : 0;
  const pokemon = roster[safeIdx] ?? null;
  const { state, train } = useTraining(
    pokemon ?? DEFAULT_TRAIN_POKEMON,
    onLevelUpComplete
  );

  const handleTrain = useCallback(async () => {
    if (!pokemon || state.phase !== "idle") return;
    setTrainError(null);
    try {
      const res = await pokemonService.train(pokemon.id);
      train(res.pokemon.level);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Erro ao treinar.";
      setTrainError(message);
    }
  }, [pokemon, state.phase, train]);

  return {
    roster,
    loading,
    selectedIdx: safeIdx,
    setSelectedIdx,
    pokemon: pokemon ?? null,
    state,
    train: handleTrain,
    trainError,
    clearTrainError: () => setTrainError(null),
  };
}
