"use client";

import { useState, useReducer, useCallback, useRef, useEffect } from "react";
import { pokemonService } from "@/lib/api/pokemon.service";
import type { MyPokemonDto } from "@/lib/api/pokemon.service";

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

function mapMyPokemonToHeal(dto: MyPokemonDto): HealPokemon {
  const type = dto.types?.[0] ?? "normal";
  const maxHp = dto.hp;
  const currentHp = dto.currentHp ?? dto.hp;
  const status: PokeStatus = currentHp <= 0 ? "fainted" : "healthy";
  return {
    id: dto.id,
    name: dto.name,
    type,
    level: dto.level,
    hp: currentHp,
    maxHp,
    sprite: dto.spriteUrl ?? "",
    status,
  };
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

function useHeal(tray: HealPokemon[], onDone?: () => void) {
  const initialHp = Array.from({ length: 6 }, (_, i) => tray[i]?.hp ?? 0);
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
    if (tray.length === 0) return;
    clearTimers();
    const slotCount = Math.min(tray.length, 6);
    const resetHp = Array.from({ length: 6 }, (_, i) => tray[i]?.hp ?? 0);
    if (state.phase === "done") {
      dispatch({ type: "RESET", initialHp: resetHp });
      after(80, () => dispatch({ type: "BEGIN" }));
    } else {
      dispatch({ type: "BEGIN" });
    }

    let cursor = 200;

    for (let i = 0; i < slotCount; i++) {
      const c = cursor + i * 130;
      after(c, () => dispatch({ type: "LOAD_SLOT", idx: i }));
    }
    cursor += slotCount * 130 + 200;

    for (let i = 0; i < slotCount; i++) {
      const c = cursor + i * SLOT_DELAY;
      after(c, () => dispatch({ type: "ACTIVATE_SLOT", idx: i }));
      after(c + SLOT_ACTIVE, () => dispatch({ type: "LIT_SLOT", idx: i }));
    }
    const allLit = cursor + slotCount * SLOT_DELAY + SLOT_ACTIVE + 200;
    after(allLit, () => dispatch({ type: "DEACTIVATE" }));

    const fillStart = allLit + 300;
    after(fillStart, () => dispatch({ type: "START_FILL" }));

    for (let i = 0; i < tray.length; i++) {
      const { hp, maxHp } = tray[i];
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

    const doneAt = fillStart + tray.length * 60 + HP_STEPS * HP_TICK_MS + 400;
    after(doneAt, () => {
      dispatch({ type: "DONE" });
      onDone?.();
    });
    after(doneAt + 4500, () => dispatch({ type: "HIDE_TOAST" }));
  }, [state.phase, tray, onDone]);

  useEffect(() => () => clearTimers(), []);

  return { state, heal };
}

const MAX_TRAY = 6;

export function useHealHandler(debouncedSearch: string) {
  const [team, setTeam] = useState<HealPokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [tray, setTray] = useState<HealPokemon[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const search = debouncedSearch.trim() || undefined;
    pokemonService
      .getMyPokemons(search ? { search } : {})
      .then((list) => {
        if (cancelled) return;
        setTeam(list.map(mapMyPokemonToHeal));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const onHealDone = useCallback(() => {
    setTeam((prev) =>
      prev.map((p) => (tray.some((t) => t.id === p.id) ? { ...p, hp: p.maxHp } : p))
    );
  }, [tray]);

  const { state, heal: runHealAnimation } = useHeal(tray, onHealDone);
  const [healError, setHealError] = useState<string | null>(null);

  const heal = useCallback(async () => {
    if (tray.length === 0 || (state.phase !== "idle" && state.phase !== "done")) return;
    setHealError(null);
    try {
      await pokemonService.heal(tray.map((p) => p.id));
      runHealAnimation();
    } catch (e) {
      setHealError(e instanceof Error ? e.message : "Erro ao curar.");
    }
  }, [tray, state.phase, runHealAnimation]);

  const addToTray = useCallback((p: HealPokemon) => {
    setTray((prev) => {
      if (prev.some((t) => t.id === p.id) || prev.length >= MAX_TRAY) return prev;
      return [...prev, p];
    });
  }, []);

  const removeFromTray = useCallback((p: HealPokemon) => {
    setTray((prev) => prev.filter((t) => t.id !== p.id));
  }, []);

  const isInTray = useCallback(
    (p: HealPokemon) => tray.some((t) => t.id === p.id),
    [tray]
  );

  const trayIndex = useCallback(
    (p: HealPokemon) => tray.findIndex((t) => t.id === p.id),
    [tray]
  );

  return {
    team,
    loading,
    tray,
    addToTray,
    removeFromTray,
    isInTray,
    trayIndex,
    state,
    heal,
    healError,
    clearHealError: () => setHealError(null),
  };
}
