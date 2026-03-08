"use client";

import { useState, useReducer, useCallback, useRef, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────────────────

export type PokeStatus = "healthy" | "fainted" | "poisoned" | "burned" | "frozen" | "paralyzed";

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

const sp = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const HEAL_TEAM: HealPokemon[] = [
  { id: 25, name: "Pikachu", type: "electric", level: 32, hp: 6, maxHp: 35, sprite: sp(25), status: "poisoned" },
  { id: 6, name: "Charizard", type: "fire", level: 37, hp: 18, maxHp: 78, sprite: sp(6), status: "burned" },
  { id: 1, name: "Bulbasaur", type: "grass", level: 30, hp: 0, maxHp: 45, sprite: sp(1), status: "fainted" },
  { id: 7, name: "Squirtle", type: "water", level: 30, hp: 44, maxHp: 44, sprite: sp(7), status: "healthy" },
  { id: 94, name: "Gengar", type: "ghost", level: 35, hp: 14, maxHp: 60, sprite: sp(94), status: "frozen" },
  { id: 149, name: "Dragonite", type: "dragon", level: 54, hp: 42, maxHp: 91, sprite: sp(149), status: "paralyzed" },
];

export type HealPhase = "idle" | "loading" | "sequencing" | "filling" | "done";

export interface HealState {
  phase: HealPhase;
  loadedSlots: boolean[];
  activeSlot: number;
  litSlots: boolean[];
  displayHp: number[];
  showToast: boolean;
}

type HealAction =
  | { type: "BEGIN" }
  | { type: "LOAD_SLOT"; idx: number }
  | { type: "ACTIVATE_SLOT"; idx: number }
  | { type: "LIT_SLOT"; idx: number }
  | { type: "DEACTIVATE" }
  | { type: "START_FILL" }
  | { type: "TICK_HP"; idx: number; value: number }
  | { type: "DONE" }
  | { type: "HIDE_TOAST" }
  | { type: "RESET"; initialHp: number[] };

function healReducer(s: HealState, a: HealAction): HealState {
  switch (a.type) {
    case "BEGIN":
      return { ...s, phase: "loading", loadedSlots: Array(6).fill(false), litSlots: Array(6).fill(false), activeSlot: -1 };
    case "LOAD_SLOT": {
      const ls = [...s.loadedSlots];
      ls[a.idx] = true;
      return { ...s, loadedSlots: ls };
    }
    case "ACTIVATE_SLOT":
      return { ...s, phase: "sequencing", activeSlot: a.idx };
    case "LIT_SLOT": {
      const lit = [...s.litSlots];
      lit[a.idx] = true;
      return { ...s, litSlots: lit };
    }
    case "DEACTIVATE":
      return { ...s, activeSlot: -1 };
    case "START_FILL":
      return { ...s, phase: "filling" };
    case "TICK_HP": {
      const hp = [...s.displayHp];
      hp[a.idx] = a.value;
      return { ...s, displayHp: hp };
    }
    case "DONE":
      return { ...s, phase: "done", showToast: true };
    case "HIDE_TOAST":
      return { ...s, showToast: false };
    case "RESET":
      return {
        phase: "idle",
        loadedSlots: Array(6).fill(false),
        activeSlot: -1,
        litSlots: Array(6).fill(false),
        displayHp: a.initialHp,
        showToast: false,
      };
    default:
      return s;
  }
}

const SLOT_DELAY = 430;
const SLOT_ACTIVE = 360;
const HP_STEPS = 50;
const HP_TICK_MS = 22;

function useHeal(team: HealPokemon[]) {
  const initialHp = team.map((p) => p.hp);
  const [state, dispatch] = useReducer(healReducer, {
    phase: "idle",
    loadedSlots: Array(6).fill(false),
    activeSlot: -1,
    litSlots: Array(6).fill(false),
    displayHp: initialHp,
    showToast: false,
  });
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const after = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  const heal = useCallback(() => {
    if (state.phase !== "idle" && state.phase !== "done") return;
    clearTimers();
    if (state.phase === "done") {
      dispatch({ type: "RESET", initialHp });
      after(80, () => dispatch({ type: "BEGIN" }));
    } else {
      dispatch({ type: "BEGIN" });
    }

    let cursor = 200;

    for (let i = 0; i < 6; i++) {
      const c = cursor + i * 130;
      after(c, () => dispatch({ type: "LOAD_SLOT", idx: i }));
    }
    cursor += 6 * 130 + 200;

    for (let i = 0; i < 6; i++) {
      const c = cursor + i * SLOT_DELAY;
      after(c, () => dispatch({ type: "ACTIVATE_SLOT", idx: i }));
      after(c + SLOT_ACTIVE, () => dispatch({ type: "LIT_SLOT", idx: i }));
    }
    const allLit = cursor + 6 * SLOT_DELAY + SLOT_ACTIVE + 200;
    after(allLit, () => dispatch({ type: "DEACTIVATE" }));

    const fillStart = allLit + 300;
    after(fillStart, () => dispatch({ type: "START_FILL" }));

    for (let i = 0; i < team.length; i++) {
      const { hp, maxHp } = team[i];
      if (hp === maxHp) continue;
      const diff = maxHp - hp;
      const stepSize = diff / HP_STEPS;
      for (let s = 1; s <= HP_STEPS; s++) {
        after(fillStart + i * 60 + s * HP_TICK_MS, () => {
          const val = Math.round(hp + stepSize * s);
          dispatch({ type: "TICK_HP", idx: i, value: Math.min(val, maxHp) });
        });
      }
    }

    const doneAt = fillStart + team.length * 60 + HP_STEPS * HP_TICK_MS + 400;
    after(doneAt, () => dispatch({ type: "DONE" }));
    after(doneAt + 4500, () => dispatch({ type: "HIDE_TOAST" }));
  }, [state.phase, team]);

  useEffect(() => () => clearTimers(), []);

  return { state, heal };
}

export function useHealHandler() {
  const [team] = useState(HEAL_TEAM);
  const { state, heal } = useHeal(team);

  return {
    team,
    state,
    heal,
  };
}
