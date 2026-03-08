"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { pokemonService } from "@/lib/api/pokemon.service";
import type { PokemonDetailDto } from "@/lib/api/pokemon.service";
import type { PokemonDetail, Stat } from "./types";

function mapDetailDtoToPokemonDetail(dto: PokemonDetailDto): PokemonDetail {
  const stats: Stat = {
    hp: dto.hp,
    attack: dto.baseAttack,
    defense: dto.baseDefense,
    speed: dto.baseSpeed,
  };
  return {
    id: dto.id,
    uuid: dto.uuid,
    name: dto.name,
    spriteUrl: dto.spriteUrl,
    types: dto.types,
    level: dto.level,
    hp: dto.hp,
    currentHp: dto.currentHp,
    baseAttack: dto.baseAttack,
    baseDefense: dto.baseDefense,
    baseSpeed: dto.baseSpeed,
    region: dto.region,
    locations: dto.locations ?? [],
    creatorId: dto.creatorId,
    dexNumber: `#${dto.id.toString().padStart(3, "0")}`,
    stats,
  };
}

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
  const id = Number(params?.id) || NaN;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    router.push("/pokemon");
  }, [router]);

  const refetch = useCallback(() => {
    if (!Number.isFinite(id) || id < 1) return;
    setError(null);
    pokemonService
      .getById(id)
      .then((data) => setPokemon(mapDetailDtoToPokemonDetail(data)))
      .catch((err) => setError(err?.message ?? "Não foi possível carregar o Pokémon."));
  }, [id]);

  useEffect(() => {
    if (!Number.isFinite(id) || id < 1) {
      setError("ID inválido");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    pokemonService
      .getById(id)
      .then((data) => {
        if (!cancelled) {
          setPokemon(mapDetailDtoToPokemonDetail(data));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? "Não foi possível carregar o Pokémon.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { pokemon, pokemonId: id, loading, error, handleBack, refetch };
}
