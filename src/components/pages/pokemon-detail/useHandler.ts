"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { POKEMON_DETAIL_REGISTRY } from "./data";
import type { PokemonDetail } from "./types";

export function useCountUp(
  target: number,
  duration = 1200,
  trigger: boolean
): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setVal(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return val;
}

export function usePokemonDetailHandler() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id) || 1;
  const pokemon: PokemonDetail =
    POKEMON_DETAIL_REGISTRY[id] ?? POKEMON_DETAIL_REGISTRY[1];

  const handleBack = useCallback(() => {
    router.push("/pokemon");
  }, [router]);

  return { pokemon, pokemonId: id, handleBack };
}
